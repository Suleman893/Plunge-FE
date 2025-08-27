//MUI Imports
import Divider from '@mui/material/Divider'

//Types Imports
import type { SessionDetailsProps } from '@custom-types/pages/app-user'

//Helpers And Utils Imports
import { snakeToPascalConverter } from '@helpers/common'
import { formatTimeRange, formatTimestampToDate } from '@utils/common'

const SessionDetails = (props: SessionDetailsProps) => {
  const { itemData } = props

  return (
    <>
      <div className='flex flex-col gap-3'>
        {/* Video Session Image Section */}
        {itemData.sessionType === 'video_guided' && (
          <div className='w-full relative'>
            <img src={itemData?.video?.thumbnail} height={160} className='object-contain rounded-lg w-full' />
            <div className='absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black to-transparent rounded-b-lg'></div>
            <div className='absolute bottom-4 left-2'>
              <p className='text-[#FFFFFF] text-sm font-medium'>{itemData?.video?.name || '-'}</p>
              <p className='text-[#FFFFFF] text-xs font-normal'>{itemData?.videoInstructor?.name || '-'}</p>
            </div>
          </div>
        )}
        {/* Basic information Section */}
        <h6 className='text-base font-semibold'>Basic Information</h6>
        <div className='flex flex-col gap-2'>
          <div>
            <span className='w-1/2 inline-block align-top text-[#666666]'>Name</span>
            <span className='w-1/2 inline-block'>{itemData?.name}</span>
          </div>
          <div>
            <span className='w-1/2 inline-block align-top text-[#666666]'>Type</span>
            <span className='w-1/2 inline-block'>{snakeToPascalConverter(itemData?.sessionType)}</span>
          </div>
          <div>
            <span className='w-1/2 inline-block align-top text-[#666666]'>Date</span>
            <span className='w-1/2 inline-block'>{formatTimestampToDate(itemData?.startTime, 'D, MMM YYYY')}</span>
          </div>
          <div>
            <span className='w-1/2 inline-block align-top text-[#666666]'>Time</span>
            <span className='w-1/2 inline-block'>{`${formatTimeRange(
              itemData?.startTime
            )} - ${formatTimeRange(itemData?.endTime)}`}</span>
          </div>
        </div>
      </div>
      <Divider sx={{ my: 3 }} />
      {/* Summary Section */}
      <div className='flex flex-col gap-3'>
        <h6 className='text-base font-semibold'>Summary</h6>
        <div className='flex flex-col gap-2'>
          <div>
            <span className='w-1/2 inline-block align-top text-[#666666]'>Total Time</span>
            <span className='w-1/2 inline-block'>{itemData?.totalTime}</span>
          </div>
          <div>
            <span className='w-1/2 inline-block align-top text-[#666666]'>Avg. Body Temp</span>
            <span className='w-1/2 inline-block'>
              {itemData?.bodyTemperature ? itemData?.bodyTemperature + '° F' : '0 °F'}
            </span>
          </div>
          <div>
            <span className='w-1/2 inline-block align-top text-[#666666]'>Avg. Heart Rate</span>
            <span className='w-1/2 inline-block'>{itemData?.heartRate ? itemData?.heartRate + 'BPM' : '0 BRM'}</span>
          </div>
          <div>
            <span className='w-1/2 inline-block align-top text-[#666666]'>Selfies Taken</span>
            <span className='w-1/2 inline-block'>{itemData?.totalSelfies || 0}</span>
          </div>
        </div>
      </div>
      <Divider sx={{ my: 3 }} />
      {/* Device Info Section */}
      <div className='flex flex-col gap-3'>
        <h6 className='text-base font-semibold'>Device Info</h6>
        <div className='flex flex-col gap-2'>
          <div>
            <span className='w-1/2 inline-block align-top text-[#666666]'>Logged Temperature</span>
            <span className='w-1/2 inline-block'>{itemData?.temperatureLogged || 0} °F</span>
          </div>
          <div>
            <span className='w-1/2 inline-block align-top text-[#666666]'>Sound</span>
            <span className='w-1/2 inline-block'>{itemData?.music ? 'Yes' : 'No'}</span>
          </div>
        </div>
      </div>
      <Divider sx={{ my: 3 }} />
    </>
  )
}

export default SessionDetails
