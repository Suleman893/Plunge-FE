// React
import { useEffect, useState } from 'react'

//Third Party Imports
import classNames from 'classnames'

//Assets Import
import GreenCheck from '@assets/svgs/GreenCheck'

//Types Imports
import type { UploadedFilePreviewProps } from '@custom-types/components/file-drop'

const UploadedImgPreview = (props: UploadedFilePreviewProps) => {
  const { file, selectedFile, previewThumbnail } = props

  const [fileURL, setFileURL] = useState<string>('') // Final preview URL (can be remote or local blob)
  const [previewFile, setPreviewFile] = useState<File | Blob | null>(null) // For blob/local thumbnail
  const [isContainObjectFit, setIsContainObjectFit] = useState<boolean>(false) // Use 'object-contain' for placeholder thumbnails, else 'object-cover'

  useEffect(() => {
    // Case: Existing file from DB
    if (selectedFile) {
      if (selectedFile.type.startsWith('audio') || selectedFile.type.startsWith('video')) {
        // Show thumbnail if media is audio/video
        if (previewThumbnail instanceof File || previewThumbnail instanceof Blob) {
          // New thumbnail being updated but not yet uploaded
          setPreviewFile(previewThumbnail)
        } else if (typeof previewThumbnail === 'string') {
          // Existing remote thumbnail URL
          setFileURL(previewThumbnail)
        }
      } else {
        // Case: Image file type (not audio/video where thumbnail logic needed)
        setFileURL(selectedFile?.url)
      }
    } else if (file) {
      // Case: New file added by user
      if (file.type.startsWith('audio') || file.type.startsWith('video')) {
        if (previewThumbnail instanceof File || previewThumbnail instanceof Blob) {
          // New thumbnail for audio/video
          setPreviewFile(previewThumbnail)
        } else {
          if (typeof previewThumbnail === 'string') {
            setFileURL(previewThumbnail) // Use provided thumbnail URL
          } else {
            // Fallback to static placeholder for audio/video
            if (file.type.startsWith('audio')) {
              setFileURL('/images/music/music-thumbnail.png')
              setIsContainObjectFit(true)
            } else {
              setFileURL('/images/video/video-thumbnail.jpg')
              setIsContainObjectFit(true)
            }
          }
        }
      } else {
        // Case: Image file type (not audio/video where thumbnail logic needed)
        setPreviewFile(file)
      }
    }
  }, [file, selectedFile, previewThumbnail])

  // Create object URL for previewFile (local blob or File object)
  useEffect(() => {
    if (previewFile) {
      const url = URL.createObjectURL(previewFile)

      setFileURL(url)
      setIsContainObjectFit(false)

      return () => {
        URL.revokeObjectURL(url) // Cleanup object URL on unmount/update
      }
    }
  }, [previewFile])

  const commonPreviewStyle = 'relative w-[140px] h-[70px] overflow-hidden rounded-md shadow-md'

  const imgClass = classNames('w-full h-full', {
    'object-contain': isContainObjectFit,
    'object-cover': !isContainObjectFit
  })

  const overlay = (
    <div className='absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 z-10'>
      <div className='w-10 h-10 rounded-full bg-[#00000070] flex items-center justify-center'>
        <GreenCheck />
      </div>
    </div>
  )

  return (
    <div className={commonPreviewStyle}>
      {fileURL && <img src={fileURL} alt='uploaded-img' className={imgClass} />}
      {overlay}
    </div>
  )
}

export default UploadedImgPreview
