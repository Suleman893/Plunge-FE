'use client'

//React Imports
import { useEffect, useState } from 'react'

//Next Imports
import { useRouter } from 'next/navigation'

//MUI Imports
import Typography from '@mui/material/Typography'

// Third-party Imports
import { useSelector } from 'react-redux'

//Component Imports
import CustomButton from '@core/components/mui/Button'

//Redux Imports
import type { RootState } from '@features/store'

const NotFound = () => {
  const router = useRouter()
  const { firebaseUser } = useSelector((state: RootState) => state?.auth)

  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    if (firebaseUser?.accessToken && firebaseUser?.uid) {
      router.back()
    } else {
      setShouldRender(true)
    }
  }, [firebaseUser, router])

  if (!shouldRender) return null

  return (
    <div className='flex items-center justify-center min-bs-[100dvh] relative p-6 overflow-x-hidden'>
      <div className='flex items-center flex-col text-center'>
        <div className='flex flex-col gap-2 is-[90vw] sm:is-[unset] mbe-6'>
          <Typography className='font-medium text-8xl' color='text.primary'>
            404
          </Typography>
          <Typography variant='h4'>Page Not Found ⚠️</Typography>
          <Typography>We couldn&#39;t find the page you are looking for.</Typography>
        </div>
        <CustomButton onClick={() => router.back()} variant='contained' text='Back to Previous Page' />
      </div>
    </div>
  )
}

export default NotFound
