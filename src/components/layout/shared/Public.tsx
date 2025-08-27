'use client'

//React Imports
import type { ReactNode } from 'react'
import { useEffect } from 'react'

// Next Imports
import { useRouter } from 'next/navigation'

//Redux import
import { useSelector } from 'react-redux'

import type { RootState } from '@features/store'

interface PublicRouteProps {
  children: ReactNode
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const { firebaseUser } = useSelector((state: RootState) => state.auth)
  const router = useRouter()

  useEffect(() => {
    if (firebaseUser?.accessToken) {
      router.push('/')
    }
  }, [firebaseUser?.accessToken])

  return <div>{children}</div>
}

export default PublicRoute
