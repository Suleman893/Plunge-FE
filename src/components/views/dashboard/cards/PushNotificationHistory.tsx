'use client'

// React Imports
import { useEffect } from 'react'

// MUI Imports
import Typography from '@mui/material/Typography'

// Third Party Imports
import { useSelector, useDispatch } from 'react-redux'
import Skeleton from 'react-loading-skeleton'

// Components Imports
import CustomChip from '@core/components/mui/Chip'

// Redux Imports
import type { RootState } from '@features/store'
import { fetchAllNotifications } from '@features/push-notification/thunk'

// Constants Imports
import { SORT_BY } from '@constants/common'

// Helpers and Utils Imports
import { snakeToPascalConverter, statusColor } from '@helpers/common'
import { formatTimeTo12Hour, formatTimestampToDate, truncateText } from '@utils/common'

const PushNotificationHistory = () => {
  const dispatch = useDispatch()
  const { isAllNotificationLoading, allNotifications } = useSelector((state: RootState) => state.pushNotification)

  useEffect(() => {
    dispatch(
      fetchAllNotifications({
        page: 1,
        elements: 5,
        sortBy: SORT_BY
      }) as any
    )
  }, [])

  // If no record
  if (!isAllNotificationLoading && allNotifications?.item?.length === 0) {
    return <Typography variant='h6'>No push notifications found</Typography>
  }

  const renderList = isAllNotificationLoading ? Array.from({ length: 5 }) : allNotifications?.items || []

  return (
    <>
      {renderList?.map((item: any, index: number) => (
        <div key={index} className='flex items-center gap-4 mb-4'>
          <div className='flex flex-wrap justify-between items-center gap-x-4 gap-y-1 is-full max-sm:flex-col max-sm:items-start'>
            <div className='flex flex-col'>
              <div className='flex items-center gap-1 max-sm:flex-col max-sm:items-start'>
                <Typography variant='h6' className='font-medium' color='text.primary'>
                  {isAllNotificationLoading ? (
                    <Skeleton width={120} />
                  ) : (
                    `${truncateText(snakeToPascalConverter(item?.notificationType?.name), 20)} |`
                  )}
                </Typography>

                <Typography variant='body2'>
                  {isAllNotificationLoading ? (
                    <Skeleton width={120} />
                  ) : (
                    `${formatTimestampToDate(item?.date, 'DD/MM/YY')} | ${formatTimeTo12Hour(item?.time)}`
                  )}
                </Typography>
              </div>

              <Typography variant='body2'>
                {isAllNotificationLoading ? <Skeleton width={245} /> : truncateText(item?.message, 50) || '-'}
              </Typography>
            </div>

            <div className='flex justify-end items-center'>
              {isAllNotificationLoading ? (
                <Skeleton width={60} height={24} borderRadius={4} />
              ) : (
                <CustomChip
                  variant='tonal'
                  label={snakeToPascalConverter(item?.status === 'schedule' ? 'scheduled' : 'sent')}
                  size='small'
                  color={statusColor('push-notifications', item?.status)}
                />
              )}
            </div>
          </div>
        </div>
      ))}
    </>
  )
}

export default PushNotificationHistory
