//React Imports
import { useEffect } from 'react'

//Redux Imports
import { useDispatch, useSelector } from 'react-redux'

//Component Imports
import ImgSection from '@components/views/auth/shared/ImgSection'
import InviteLoading from '@components/views/auth/invite/InviteLoading'
import InviteForm from '@components/views/auth/invite/InviteForm'
import ResendInviteLink from '@components/views/auth/invite/ResendInviteLink'

//Redux Imports
import type { RootState } from '@features/store'
import { checkEmailExpiry } from '@features/users/thunk'

//Types Imports
import type { InviteProps } from '@custom-types/pages/auth'

const Invite = (props: InviteProps) => {
  const { expiry } = props

  const dispatch = useDispatch()

  const { isEmailVerified, isEmailExpiryLoading } = useSelector((state: RootState) => state.users)

  useEffect(() => {
    if (expiry) dispatch(checkEmailExpiry(expiry) as any)
  }, [expiry])

  const CurrentComponent = () => {
    switch (true) {
      case isEmailExpiryLoading:
        return <InviteLoading />

      case isEmailVerified:
        return <InviteForm />

      case !isEmailVerified && !isEmailExpiryLoading:
        return <ResendInviteLink />

      default:
        return null
    }
  }

  return (
    <div className='flex bs-full justify-center'>
      <ImgSection />
      <CurrentComponent />
    </div>
  )
}

export default Invite
