'use client'

//Next Imports
import { useSearchParams } from 'next/navigation'

//Redux Imports
import { useSelector, useDispatch } from 'react-redux'

//Redux Imports
import { resendInvite } from '@features/users/thunk'
import type { RootState } from '@features/store'

//Type Imports
import type { UidType } from '@custom-types/pages/auth'

//Components Imports
import CustomButton from '@core/components/mui/Button'

//Assets Imports
import AuthLogo from '@assets/svgs/AuthLogo'

const ResendInviteLink = () => {
  const { isResendInviteLoading } = useSelector((state: RootState) => state.users)

  //Hooks
  const dispatch = useDispatch()
  const searchParams = useSearchParams()

  //UID from URL

  const uid: UidType = searchParams.get('uid')

  return (
    <div className='flex justify-center items-center bs-full !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]'>
      <div className='flex flex-col gap-6 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] mbs-11 sm:mbs-14 md:mbs-0'>
        <div className='my-2'>
          <AuthLogo fill='#000' />
        </div>
        <p className='text-base text-gray-700'>
          The invite link has expired. Click the button below to request a new one.
        </p>
        <CustomButton
          fullWidth
          variant='contained'
          type='submit'
          text='Resend Invite Link'
          loading={isResendInviteLoading}
          onClick={() => dispatch(resendInvite(uid) as any)}
        />
      </div>
    </div>
  )
}

export default ResendInviteLink
