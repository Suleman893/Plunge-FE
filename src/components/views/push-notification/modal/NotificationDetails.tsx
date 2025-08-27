//MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

//Third Party Imports
import { useDispatch, useSelector } from 'react-redux'
import dayjs from 'dayjs'

//Components Imports
import BorderButton from '@components/buttons/BorderButton'
import CustomButton from '@core/components/mui/Button'

//Types Imports
import type { NotificationDetailProps } from '@custom-types/pages/push-notifications'

//Redux Imports
import { editNotification } from '@features/push-notification/thunk'
import type { RootState } from '@features/store'

//Utils and Helpers Imports
import { snakeToPascalConverter } from '@helpers/common'
import { formatTimeTo12Hour, formatTimestampToDate } from '@utils/common'

const NotificationDetail = (props: NotificationDetailProps) => {
  const { onBtnClick, defaultData, onEditBtnClick } = props

  const dispatch = useDispatch()

  const { isEditNotificationLoading } = useSelector((state: RootState) => state.pushNotification)

  const sendNow = async () => {
    const currentDate = dayjs().format('YYYY-MM-DD') // Get current date
    const currentTime = dayjs().format('HH:mm') // Get current time

    const data = {
      status: 'sent',
      date: currentDate,
      time: currentTime
    }

    dispatch(
      editNotification({
        id: defaultData?.id,
        data,
        handleClose: onBtnClick
      }) as any
    )
  }

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-col gap-5'>
        <Box>
          <Typography>NOTIFICATION TYPE</Typography>
          <Typography className='font-bold'>{snakeToPascalConverter(defaultData?.notificationType?.name)}</Typography>
        </Box>

        <Box>
          <Typography>MESSAGE</Typography>
          <Typography className='font-bold'>{defaultData?.message}</Typography>
        </Box>

        <Box>
          <Typography>{defaultData?.status === 'schedule' ? 'SCHEDULED FOR' : 'SENT ON'}</Typography>
          <Typography className='font-bold'>{`${formatTimestampToDate(defaultData?.date, 'DD/MM/YY')} | ${formatTimeTo12Hour(
            defaultData?.time
          )}`}</Typography>
        </Box>
      </div>
      <div className='flex justify-center gap-2'>
        <BorderButton handleClick={onBtnClick} text='Close' />
        {defaultData?.status === 'schedule' && (
          <>
            <CustomButton
              text='Edit Notification'
              variant='tonal'
              disabled={isEditNotificationLoading}
              handleClick={onEditBtnClick}
            />
            <CustomButton text='Send Now' loading={isEditNotificationLoading} handleClick={sendNow} />
          </>
        )}
      </div>
    </div>
  )
}

export default NotificationDetail
