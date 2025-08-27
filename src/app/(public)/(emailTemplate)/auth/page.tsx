'use client'

//Next Imports
import { useSearchParams } from 'next/navigation'

//Views Imports
import ResetPassword from '@views/auth/ResetPassword'
import EmailVerification from '@views/auth/EmailVerification'
import NotFound from '@views/NotFound'

//Type Imports
import type { OobCodeType, ModeType } from '@custom-types/pages/auth'

export default function Page() {
  const searchParams = useSearchParams()

  const oobCode: OobCodeType = searchParams.get('oobCode')

  const mode: ModeType = searchParams.get('mode')

  if (mode === 'verifyEmail') return <EmailVerification oobCode={oobCode} />
  if (mode === 'resetPassword') return <ResetPassword oobCode={oobCode} />

  return <NotFound />
}
