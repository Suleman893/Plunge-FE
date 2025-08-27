'use client'

// React Imports
import { useEffect, useRef } from 'react'

// Third Party Imports
// eslint-disable-next-line
import Hls from 'hls.js'

// Component Imports
import BorderButton from '@components/buttons/BorderButton'

//Types Imports
import type { VideoPlayerProps } from '@custom-types/pages/video-management'

const VideoPlayer = (props: VideoPlayerProps) => {
  const { item, handleClose } = props

  // Ref for video element
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (!item?.video || !videoRef.current) return

    const video = videoRef.current

    // If video is an HLS stream (.m3u8), use hls.js if browser doesn't support it
    if (item?.video?.includes('.m3u8')) {
      // Check if browser supports native HLS playback
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = item.video
      } else if (Hls.isSupported()) {
        const hls = new Hls()

        hls.loadSource(item?.video)
        hls.attachMedia(videoRef.current)

        return () => {
          hls.destroy()
        }
      }
    } else {
      // If it's an MP4 or another format, set the video source directly
      video.src = item?.video
    }
  }, [item?.video])

  return (
    <div className='flex flex-col items-center gap-5'>
      <div className='text-sm'>
        <p className='text-center font-semibold'>Currently Playing:</p>
        <span className='text-black'>{item?.name} | </span>
        <span className='font-extralight'>{item?.videoInstructor?.name}</span>
      </div>
      <div className='w-full'>
        <video
          ref={videoRef}
          className='w-full h-[400px] object-contain'
          autoPlay
          controls
          controlsList='nodownload noplaybackrate noremoteplayback'
        />
      </div>
      <BorderButton text='Close' handleClick={handleClose} />
    </div>
  )
}

export default VideoPlayer
