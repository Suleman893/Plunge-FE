// React Imports
import React from 'react'

// Third Party Imports
import { useSelector } from 'react-redux'

//Type Imports
import type { Music } from '@custom-types/features/musicManagement'

//Components Imports
import CustomChip from '@core/components/mui/Chip'
import UploadProgressCell from '@components/table/UploadProgressCell'

//Redux Imports
import type { RootState } from '@features/store'
import { setMusicUploadProgress, resetMusicUploadProgress } from '@features/music-management/progress/slice'

//Utils And Helpers Imports
import { snakeToPascalConverter } from '@helpers/common'

const UploadProgress = React.memo(({ musicItem }: { musicItem: Music }) => {
  const currentUploadProgressList = useSelector((state: RootState) => state.musicProgress.uploadProgressList)
  const item = currentUploadProgressList.find((item: any) => String(item.id) === String(musicItem?.id))

  if (item && typeof item?.progress === 'number' && item?.progress >= 0) {
    return (
      <>
        {/* <div className='ml-[20%]'> */}
        <UploadProgressCell
          type='music'
          progressItem={item}
          uploadedItem={musicItem}
          setProgress={setMusicUploadProgress}
          resetProgress={resetMusicUploadProgress}
        />
        {/* </div> */}
      </>
    )
  }

  if (musicItem?.audioUploadId || musicItem?.audio) {
    return (
      <div className='flex items-center gap-3'>
        <CustomChip
          round='false'
          variant='tonal'
          label={snakeToPascalConverter(musicItem?.audioUploadId === null ? 'Completed' : 'In Progress')}
          size='small'
          color={musicItem?.audioUploadId === null ? 'success' : 'default'}
        />
      </div>
    )
  }

  return null
})

export default UploadProgress
