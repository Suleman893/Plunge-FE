//Third Party Imports
import { useSelector } from 'react-redux'

//Component Imports
import CustomButton from '@core/components/mui/Button'
import BorderButton from '@components/buttons/BorderButton'

//Redux Imports
import type { RootState } from '@features/store'

//Types Import
import type { ActionModalProps } from '@custom-types/components/modals'

const ActionModal = (props: ActionModalProps) => {
  const { actionType, onRightBtnClick, onLeftBtnClick } = props

  const { isUserStatusUpdateLoading, isUserDeleteLoading } = useSelector((state: RootState) => state.users)
  const { isPlungeStatusUpdateLoading, isPlungeDeleteLoading } = useSelector((state: RootState) => state.plungeModel)
  const { isNotificationDeleteLoading } = useSelector((state: RootState) => state.pushNotification)
  const { isMusicDeleteLoading, isMusicStatusUpdateLoading } = useSelector((state: RootState) => state.musicManagement)
  const { isVideoDeleteLoading, isVideoStatusUpdateLoading } = useSelector((state: RootState) => state.videoManagement)
  const { isAppUserStatusUpdateLoading } = useSelector((state: RootState) => state.appUserManagement)

  const loading =
    isUserStatusUpdateLoading ||
    isUserDeleteLoading ||
    isPlungeStatusUpdateLoading ||
    isPlungeDeleteLoading ||
    isNotificationDeleteLoading ||
    isMusicStatusUpdateLoading ||
    isMusicDeleteLoading ||
    isVideoDeleteLoading ||
    isVideoStatusUpdateLoading ||
    isAppUserStatusUpdateLoading

  const renderRightButton = () => {
    switch (actionType) {
      case 'Activate':
        return <CustomButton color='primary' text='Yes, Activate' handleClick={onRightBtnClick} loading={loading} />
      case 'Delete':
        return <CustomButton color='error' text='Yes, Delete' handleClick={onRightBtnClick} loading={loading} />
      case 'Disable':
        return (
          <CustomButton
            variant='tonal'
            color='error'
            text='Yes, Disable'
            handleClick={onRightBtnClick}
            loading={loading}
          />
        )
      case 'Suspend':
        return (
          <CustomButton
            variant='tonal'
            color='error'
            text='Yes, Suspend'
            handleClick={onRightBtnClick}
            loading={loading}
          />
        )
      case 'Archive':
        return (
          <CustomButton
            variant='tonal'
            color='error'
            text='Yes, Archive'
            handleClick={onRightBtnClick}
            loading={loading}
          />
        )
    }
  }

  return (
    <div className='flex justify-end items-center gap-4'>
      <BorderButton handleClick={onLeftBtnClick} text='No, Cancel' />
      {renderRightButton()}
    </div>
  )
}

export default ActionModal
