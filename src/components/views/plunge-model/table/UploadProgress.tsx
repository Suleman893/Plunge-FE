//React Imports
import React from 'react'

// Third Party Imports
import { useSelector } from 'react-redux'

// Components Imports
import CustomChip from '@core/components/mui/Chip'
import UploadProgressCell from '@components/table/UploadProgressCell'

// Redux Imports
import type { RootState } from '@features/store'
import {
  setPlungeModelUploadProgress,
  resetPlungeModelUploadProgressByKey
} from '@features/plunge-model/progress/slice'

//Utils And Helpers Imports
import { snakeToPascalConverter } from '@helpers/common'

const UploadProgress = React.memo(({ plungeItem }: { plungeItem: any }) => {
  const uploadProgressList = useSelector((state: RootState) => state.plungeModelProgress.uploadProgressList)
  const item = uploadProgressList.find((item: any) => String(item.id) === String(plungeItem?.id))

  const setupVideo = item?.progress?.setupVideo
  const pairingVideo = item?.progress?.pairingVideo
  const troubleShootVideo = item?.progress?.troubleShootVideo

  const showSetupProgress =
    typeof setupVideo?.progress === 'number' && setupVideo?.progress >= 0 && setupVideo?.progress < 100

  const showPairingProgress =
    typeof pairingVideo?.progress === 'number' && pairingVideo?.progress >= 0 && pairingVideo?.progress < 100

  const showTroubleShootProgress =
    typeof troubleShootVideo?.progress === 'number' &&
    troubleShootVideo.progress >= 0 &&
    troubleShootVideo.progress < 100

  if (showSetupProgress || showPairingProgress || showTroubleShootProgress) {
    return (
      <div className='flex items-center gap-2'>
        {showSetupProgress && (
          <UploadProgressCell
            type='setup-video'
            progressItem={setupVideo}
            uploadedItem={plungeItem}
            setProgress={({ progress, isPaused }: any) =>
              setPlungeModelUploadProgress({
                id: plungeItem.id,
                key: 'setupVideo',
                progress,
                isPaused
              })
            }
            resetProgress={() => resetPlungeModelUploadProgressByKey({ id: plungeItem?.id, key: 'setupVideo' })}
            label='Setup Video'
          />
        )}

        {showPairingProgress && (
          <UploadProgressCell
            type='pairing-video'
            progressItem={pairingVideo}
            uploadedItem={plungeItem}
            setProgress={({ progress, isPaused }: any) =>
              setPlungeModelUploadProgress({
                id: plungeItem.id,
                key: 'pairingVideo',
                progress,
                isPaused
              })
            }
            resetProgress={() => resetPlungeModelUploadProgressByKey({ id: plungeItem?.id, key: 'pairingVideo' })}
            label='Pairing Video'
          />
        )}

        {showTroubleShootProgress && (
          <UploadProgressCell
            type='trouble-shoot-video'
            progressItem={troubleShootVideo}
            uploadedItem={plungeItem}
            setProgress={({ progress, isPaused }: any) =>
              setPlungeModelUploadProgress({
                id: plungeItem.id,
                key: 'troubleShootVideo',
                progress,
                isPaused
              })
            }
            resetProgress={() => resetPlungeModelUploadProgressByKey({ id: plungeItem?.id, key: 'troubleShootVideo' })}
            label='TroubleShoot Video'
          />
        )}
      </div>
    )
  }

  const isCompleted =
    plungeItem?.pairingVideoUploadId === null &&
    plungeItem?.setupVideoUploadId === null &&
    plungeItem?.troubleShootVideoUploadId === null

  return (
    <div className='flex items-center gap-3'>
      <CustomChip
        round='false'
        variant='tonal'
        label={snakeToPascalConverter(isCompleted ? 'Completed' : 'In Progress')}
        size='small'
        color={isCompleted ? 'success' : 'default'}
      />
    </div>
  )
})

export default UploadProgress
