'use client'

//Next Imports
import { useRouter } from 'next/navigation'

//MUI Imports
import Typography from '@mui/material/Typography'

//Components Imports
import BreadcrumbSection from '@components/breadcrumb'

const UserProfileSectionInfo = () => {
  const router = useRouter()

  return (
    <div className='flex flex-col gap-1'>
      <div className='flex items-center gap-2'>
        <i className='tabler-arrow-left text-black cursor-pointer' onClick={() => router.back()} />
        <Typography variant='h4'>User Profile</Typography>
      </div>
      <BreadcrumbSection href='/app-user-management' mainPage='App User Management' subPage='User Details' />
    </div>
  )
}

export default UserProfileSectionInfo
