//React Imports
import React from 'react'

//Third Party Imports
import { useSelector } from 'react-redux'

//Type Imports
import type { Video } from '@custom-types/features/videoManagement'

//Components Imports
import CustomChip from '@core/components/mui/Chip'
import UploadProgressCell from '@components/table/UploadProgressCell'

//Redux Imports
import type { RootState } from '@features/store'
import { setVideoUploadProgress, resetVideoUploadProgress } from '@features/video-management/progress/slice'

//Utils And Helpers Imports
import { snakeToPascalConverter } from '@helpers/common'

const UploadProgress = React.memo(({ videoItem }: { videoItem: Video }) => {
  const currentUploadProgressList = useSelector((state: RootState) => state.videoProgress.uploadProgressList)
  const item = currentUploadProgressList.find((item: any) => String(item.id) === String(videoItem?.id))

  if (item && typeof item?.progress === 'number' && item?.progress >= 0) {
    return (
      <>
        {/* <div className='ml-[20%]'> */}
        <UploadProgressCell
          type='video'
          progressItem={item}
          uploadedItem={videoItem}
          setProgress={setVideoUploadProgress}
          resetProgress={resetVideoUploadProgress}
        />
        {/* </div> */}
      </>
    )
  }

  if (videoItem?.videoUploadId || videoItem?.video) {
    return (
      <div className='flex items-center gap-3'>
        <CustomChip
          round='false'
          variant='tonal'
          label={snakeToPascalConverter(videoItem?.videoUploadId === null ? 'Completed' : 'In Progress')}
          size='small'
          color={videoItem?.videoUploadId === null ? 'success' : 'default'}
        />
      </div>
    )
  }

  return null
})

export default UploadProgress
