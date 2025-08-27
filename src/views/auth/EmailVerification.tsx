'use client'

//Next Imports
// import { useEffect } from 'react'

//Third Party Imports
import { useDispatch, useSelector } from 'react-redux'

//MUI Imports
// import Button from '@mui/material/Button'
// import CircularProgress from '@mui/material/CircularProgress'

//Component Imports
import Link from '@components/Link'
import DirectionalIcon from '@components/DirectionalIcon'
import CustomButton from '@core/components/mui/Button'

//Redux Imports
import { verifyEmail } from '@features/auth/thunk'
import type { RootState } from '@features/store'

const EmailVerification = ({ oobCode }: any) => {
  const { isEmailVerificationLoading } = useSelector((state: RootState) => state.auth)

  const dispatch = useDispatch()

  //   useEffect(() => {
  //     if (oobCode) {
  //     }
  //   }, [oobCode])

  return (
    <div className='flex flex-col justify-center items-center gap-8 min-bs-[100dvh] p-6'>
      {/* <Button
        onClick={() => dispatch(verifyEmail({ oobCode }) as any)}
        variant='contained'
        type='button'
        disabled={!oobCode || isEmailVerificationLoading}
      >
        {isEmailVerificationLoading ? <CircularProgress color='inherit' size={23} /> : 'Verify Email'}
      </Button> */}
      <CustomButton
        handleClick={() => dispatch(verifyEmail({ oobCode }) as any)}
        type='button'
        disabled={!oobCode || isEmailVerificationLoading}
        text='Verify your email'
        loading={isEmailVerificationLoading}
      />
      <Link href='/login' className='flex items-center gap-1.5'>
        <DirectionalIcon ltrIconClass='tabler-chevron-left' rtlIconClass='tabler-chevron-right' className='text-xl' />
        <span>Back to login</span>
      </Link>
    </div>
  )
}

export default EmailVerification
