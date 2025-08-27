'use client'

//Next Imports
import { useRouter } from 'next/navigation'

//MUI Imports
import Typography from '@mui/material/Typography'

//Components Imports
import CustomButton from '@core/components/mui/Button'

const DashboardFilters = () => {
  const router = useRouter()

  return (
    <div className='flex flex-col gap-2 w-full'>
      <div className='flex justify-between items-center gap-4 max-sm:flex-col'>
        <div className='flex flex-col gap-1'>
          <Typography variant='h4'>Recent User Sign Ups</Typography>
          <p>This list shows the recent end users onboarded on the mobile app</p>
        </div>
        <div className='max-sm:w-full'>
          <CustomButton
            variant='tonal'
            text='View All Users'
            type='submit'
            onClick={() => router.push('/app-user-management')}
          />
        </div>
      </div>
    </div>
  )
}

export default DashboardFilters
