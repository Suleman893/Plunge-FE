//Types Imports
import type { OobCodeType } from '@custom-types/pages/auth'

//Component Imports
import ResetPassForm from '@components/views/auth/ResetPassForm'
import ImgSection from '@components/views/auth/shared/ImgSection'

type ResetPasswordProps = {
  oobCode: OobCodeType
}

const ResetPassword = (props: ResetPasswordProps) => {
  const { oobCode } = props

  return (
    <div className='flex bs-full justify-center'>
      <ImgSection />
      <ResetPassForm oobCode={oobCode} />
    </div>
  )
}

export default ResetPassword
