'use client'

//Next Imports
import { useSearchParams } from 'next/navigation'

//View Imports
import Invite from '@views/auth/Invite'

//Types Imports
import type { ExpiryType } from '@custom-types/pages/auth'

export default function Page() {
  const searchParams = useSearchParams()

  const expiry: ExpiryType = searchParams.get('expiry')

  return <Invite expiry={expiry} />
}
