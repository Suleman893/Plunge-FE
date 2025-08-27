//MUI Imports
import Divider from '@mui/material/Divider'

const DeviceDetails = () => {
  return (
    <>
      {/* Basic information Section */}
      <div className='flex flex-col gap-3'>
        <h6 className='text-base font-semibold'>Basic Information</h6>
        <div className='flex flex-col gap-2'>
          <div>
            <span className='w-1/2 inline-block align-top text-[#666666]'>Device ID:</span>
            <span className='w-1/2 inline-block'>6c45f22ddec4c67731w523</span>
          </div>
          <div>
            <span className='w-1/2 inline-block align-top text-[#666666]'>Product ID:</span>
            <span className='w-1/2 inline-block'>b7f9****6877</span>
          </div>
          <div>
            <span className='w-1/2 inline-block align-top text-[#666666]'>Custom name:</span>
            <span className='w-1/2 inline-block'>-</span>
          </div>
          <div>
            <span className='w-1/2 inline-block align-top text-[#666666]'>Default name:</span>
            <span className='w-1/2 inline-block'>Ice Bath Chiller</span>
          </div>
          <div>
            <span className='w-1/2 inline-block align-top text-[#666666]'>Product Belonged:</span>
            <span className='w-1/2 inline-block'>Ice Bath Chiller</span>
          </div>
          <div>
            <span className='w-1/2 inline-block align-top text-[#666666]'>Product ID:</span>
            <span className='w-1/2 inline-block'>ts2qobacfamk3fmi</span>
          </div>
          <div>
            <span className='w-1/2 inline-block align-top text-[#666666]'>Module firmware key:</span>
            <span className='w-1/2 inline-block'>keyukmh93ew3retr</span>
          </div>
          <div>
            <span className='w-1/2 inline-block align-top text-[#666666]'>Module firmware version:</span>
            <span className='w-1/2 inline-block'>1.1.14</span>
          </div>
          <div>
            <span className='w-1/2 inline-block align-top text-[#666666]'>MCU firmware key:</span>
            <span className='w-1/2 inline-block'></span>
          </div>
          <div>
            <span className='w-1/2 inline-block align-top text-[#666666]'>MCU firmware version:</span>
            <span className='w-1/2 inline-block'>1.0.0</span>
          </div>
          <div>
            <span className='w-1/2 inline-block align-top text-[#666666]'>Module SN:</span>
            <span className='w-1/2 inline-block'>10016871900041</span>
          </div>
          <div>
            <span className='w-1/2 inline-block align-top text-[#666666]'>Device SN:</span>
            <span className='w-1/2 inline-block'>-</span>
          </div>
        </div>
      </div>
      <Divider sx={{ my: 3 }} />
      {/* Device Activating Information Section */}
      <div className='flex flex-col gap-3'>
        <h6 className='text-base font-semibold'>Device Activating Information</h6>
        <div className='flex flex-col gap-2'>
          <div>
            <span className='w-1/2 inline-block align-top text-[#666666]'>Activation Status:</span>
            <span className='w-1/2 inline-block'>Yes</span>
          </div>
          <div>
            <span className='w-1/2 inline-block align-top text-[#666666]'>Time of Activation</span>
            <span className='w-1/2 inline-block'>2025-03-19 00:54:30</span>
          </div>
          <div>
            <span className='w-1/2 inline-block align-top text-[#666666]'>Last Device Activity</span>
            <span className='w-1/2 inline-block'>2025-03-19 00:54:30</span>
          </div>
          <div>
            <span className='w-1/2 inline-block align-top text-[#666666]'>Last Update</span>
            <span className='w-1/2 inline-block'>2025-03-19 00:54:30</span>
          </div>
          <div>
            <span className='w-1/2 inline-block align-top text-[#666666]'>Online Now</span>
            <span className='w-1/2 inline-block'>No</span>
          </div>
          <div>
            <span className='w-1/2 inline-block align-top text-[#666666]'>Binding User</span>
            <span className='w-1/2 inline-block'>*****</span>
          </div>
          <div>
            <span className='w-1/2 inline-block align-top text-[#666666]'>Binding App</span>
            <span className='w-1/2 inline-block'>Tuya Smart</span>
          </div>
          <div>
            <span className='w-1/2 inline-block align-top text-[#666666]'>Geographic Position</span>
            <span className='w-1/2 inline-block'>*****</span>
          </div>
          <div>
            <span className='w-1/2 inline-block align-top text-[#666666]'>Time Zone</span>
            <span className='w-1/2 inline-block'>Aisa/Shanghai GMT+08:00</span>
          </div>
        </div>
      </div>
      <Divider sx={{ my: 3 }} />
      {/* Device Status Section */}
      <div className='flex flex-col gap-3'>
        <h6 className='text-base font-semibold'>Device Status</h6>
        <div className='flex flex-col gap-2'>
          <div>
            <span className='w-1/2 inline-block align-top'>Temp Set:</span>
            <span className='w-1/2 inline-block'>39</span>
          </div>
          <div>
            <span className='w-1/2 inline-block align-top'>Temperature</span>
            <span className='w-1/2 inline-block'>21.40</span>
          </div>
          <div>
            <span className='w-1/2 inline-block align-top'>Child Lock</span>
            <span className='w-1/2 inline-block'>No</span>
          </div>
          <div>
            <span className='w-1/2 inline-block align-top'>Water Switch Two</span>
            <span className='w-1/2 inline-block'>No</span>
          </div>
          <div>
            <span className='w-1/2 inline-block align-top'>Flow Meter</span>
            <span className='w-1/2 inline-block'>0</span>
          </div>
          <div>
            <span className='w-1/2 inline-block align-top'>Power</span>
            <span className='w-1/2 inline-block'>No</span>
          </div>
          <div>
            <span className='w-1/2 inline-block align-top'>Temp Set</span>
            <span className='w-1/2 inline-block'>102</span>
          </div>
          <div>
            <span className='w-1/2 inline-block align-top'>Sound</span>
            <span className='w-1/2 inline-block'>No</span>
          </div>
          <div>
            <span className='w-1/2 inline-block align-top'>Unit</span>
            <span className='w-1/2 inline-block'>F</span>
          </div>
          <div>
            <span className='w-1/2 inline-block align-top'>Ozone Time</span>
            <span className='w-1/2 inline-block'>2</span>
          </div>
        </div>
      </div>
    </>
  )
}

export default DeviceDetails
