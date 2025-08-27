'use client'

//React Imports
import { useEffect, useRef, useState } from 'react'

//Third Party Imports
// eslint-disable-next-line
import Hls from 'hls.js'

//Types Imports
import type { UploadedFilePreviewProps } from '@custom-types/components/file-drop'

//Assets Imports
import GreenCheck from '@assets/svgs/GreenCheck'

const UploadedVideoPreview = ({ file, selectedFile }: UploadedFilePreviewProps) => {
  const [fileURL, setFileURL] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Generate file URL based on selectedFile or file
  useEffect(() => {
    if (selectedFile?.url) {
      setFileURL(selectedFile.url)
    } else if (file) {
      const localUrl = URL.createObjectURL(file)

      setFileURL(localUrl)

      return () => {
        URL.revokeObjectURL(localUrl)
      }
    }
  }, [file, selectedFile])

  // Handle HLS playback
  useEffect(() => {
    const video = videoRef.current

    if (!video || !fileURL) return

    const handleCanPlay = () => {
      setIsLoading(false)
    }

    video.addEventListener('canplay', handleCanPlay)

    // If it's an HLS stream
    if (fileURL.includes('.m3u8')) {
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = fileURL
      } else if (Hls.isSupported()) {
        const hls = new Hls()

        hls.loadSource(fileURL)
        hls.attachMedia(video)

        return () => {
          hls.destroy()
        }
      }
    } else {
      video.src = fileURL
    }

    return () => {
      video.removeEventListener('canplay', handleCanPlay)
    }
  }, [fileURL])

  const commonPreviewStyle = 'relative w-[140px] h-[70px] overflow-hidden rounded-md shadow-md'

  const overlay = (
    <div className='absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 z-10'>
      <div className='w-10 h-10 rounded-full bg-[#00000070] flex items-center justify-center'>
        <GreenCheck />
      </div>
    </div>
  )

  return (
    <div className={commonPreviewStyle}>
      {/* Skeleton Loading */}
      {isLoading && <div className='absolute inset-0 z-20 bg-gray-200 animate-pulse rounded-md' />}

      {/* Video: Always rendered */}
      <video
        ref={videoRef}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        controls={false}
        muted
        autoPlay
        playsInline
        preload='auto'
      />

      {!isLoading && overlay}
    </div>
  )
}

export default UploadedVideoPreview
