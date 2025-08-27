// React Imports
import React, { useRef } from 'react'

// Third Party Imports
import { useDispatch } from 'react-redux'
import CircularProgress from '@mui/material/CircularProgress'
import { toast } from 'react-toastify'

// Types Imports
import type { UploadProgressCellProps } from '@custom-types/components/table'

// Service Imports
import { tusUpload } from '@services/tus'

// Context Imports
import { useUploadContext } from '@core/contexts/uploadInstanceContext'

// Helpers And Utils Imports
import { isValidMusicFile, isValidVideoFile, findTusUploadMetadataByUploadId } from '@helpers/common'

const UploadProgressCell = (props: UploadProgressCellProps) => {
  const { addUploadInstance, removeUploadInstance } = useUploadContext()
  const dispatch = useDispatch()
  const { type, progressItem, uploadedItem, setProgress, resetProgress, label } = props
  const { isPaused, progress } = progressItem
  const inputRef = useRef<HTMLInputElement>(null)

  const handlePickFile = () => {
    inputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]

    if (!selectedFile) return

    //1st: Type validation
    const isValid =
      (type === 'music' && isValidMusicFile(selectedFile)) ||
      (['video', 'setup-video', 'pairing-video', 'trouble-shoot-video'].includes(type) &&
        isValidVideoFile(selectedFile))

    if (!isValid) {
      toast.error('Invalid file type selected.')

      return
    }

    //2nd: Match against stored upload metadata
    let uploadId = ''

    if (type === 'music') {
      uploadId = uploadedItem.audioUploadId
    } else if (type === 'video') {
      uploadId = uploadedItem.videoUploadId
    } else if (type === 'setup-video') {
      uploadId = uploadedItem.setupVideoUploadId
    } else if (type === 'pairing-video') {
      uploadId = uploadedItem.pairingVideoUploadId
    } else if (type === 'trouble-shoot-video') {
      uploadId = uploadedItem.troubleShootVideoUploadId
    }

    const meta = findTusUploadMetadataByUploadId(uploadId)

    if (
      !meta ||
      meta.metadata.filename !== selectedFile.name ||
      meta.metadata.filetype !== selectedFile.type ||
      meta.size !== selectedFile.size ||
      meta.metadata.lastmodified !== String(selectedFile.lastModified)
    ) {
      const expectedName = meta?.metadata?.filename ?? 'original file'

      toast.error(`Please select ${expectedName}`)

      return
    }

    if (isPaused) {
      tusUpload({
        type,
        file: selectedFile,
        uploadedItem,
        dispatch,
        setProgress,
        resetProgress,
        addUploadInstance,
        removeUploadInstance
      })
    }
  }

  return (
    <div className='flex flex-col items-start gap-1'>
      <div className='relative inline-flex'>
        {/* Background circle */}
        <CircularProgress
          variant='determinate'
          value={100}
          sx={{
            color: '#e0e0e0',
            position: 'absolute',
            left: 0,
            zIndex: 0
          }}
          size={45}
        />

        {/* Foreground circle */}
        <CircularProgress variant='determinate' value={Number(progress)} color='primary' size={45} />

        {/* Centered % */}
        {!isPaused && (
          <div className='absolute inset-0 flex items-center justify-center text-[11px] font-normal z-[1]'>
            {`${progress}%`}
          </div>
        )}

        {/* Resume Icon */}
        {isPaused && (
          <>
            <input type='file' ref={inputRef} hidden onChange={handleFileChange} />
            <div
              onClick={handlePickFile}
              className='absolute inset-0 z-[2] flex items-center justify-center cursor-pointer hover:bg-white/60 transition-all'
            >
              <i className='tabler-player-play text-[20px] text-primary' />
            </div>
          </>
        )}
      </div>

      {/* Label for plunge model items */}
      {label && <span className='text-[11px] text-gray-600 truncate'>{label}</span>}
    </div>
  )
}

export default React.memo(UploadProgressCell)
