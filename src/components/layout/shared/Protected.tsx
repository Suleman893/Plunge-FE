'use client'

//React Import
import type { ReactNode } from 'react'
import { useState, useEffect } from 'react'

//Next Imports
import { usePathname, useRouter } from 'next/navigation'

//Third Party Imports
import { useDispatch, useSelector } from 'react-redux'

//Redux Imports
import type { RootState } from '@features/store'
import { loggedInUser } from '@features/user/thunk'

//Hooks Imports
// import { useReloadWarningOnProgress } from '@hooks/useReloadWarningOnProgress'
// import { useResumeUploadsFromIndexedDB } from '@hooks/useResumeUploadsFromIndexedDB'
import { useWarnAndPauseUploadsOnUnload } from '@hooks/useWarnAndPauseUploadsOnUnload'
import { useRestorePausedUploads } from '@hooks/useRestorePausedUploads'

//Helpers and Utils Imports
import { isAllowedPage } from '@helpers/accessControl'

interface ProtectedRouteProps {
  children: ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  //Redux
  const dispatch = useDispatch()
  const { firebaseUser } = useSelector((state: RootState) => state.auth)

  //Hooks
  const pathname = usePathname()
  const router = useRouter()

  //Authenticated and Authorized for pages access
  const [isAccessGranted, setIsAccessGranted] = useState(false)

  // Warns user on reload/close if any uploads are in progress,
  // and stores active upload IDs to pause them on next load.
  useWarnAndPauseUploadsOnUnload()

  // Restores paused state for uploads based on saved IDs in localStorage.
  const isRestoringPausedUploads = useRestorePausedUploads()

  useEffect(() => {
    const checkAccess = async () => {
      // Redirect if not logged in
      if (!firebaseUser?.accessToken || !firebaseUser?.uid) {
        router.push('/login')

        return
      }

      try {
        // Ensure user info is fetched
        const res = await dispatch(loggedInUser({ uid: firebaseUser.uid }) as any)

        if (res?.type === 'user/loggedIn-user/fulfilled') {
          const userInfo = res.payload

          const isAllowedAccess = isAllowedPage(pathname, userInfo?.role?.systemModules, userInfo?.userType)

          if (!isAllowedAccess) {
            // router.push('/not-found')
            router.back()
          } else {
            setIsAccessGranted(true)
          }
        }
      } catch (error) {
        setIsAccessGranted(false)
      }
    }

    checkAccess()
  }, [firebaseUser?.accessToken])

  // Don't render children until paused uploads are restored
  if (isRestoringPausedUploads) return null

  return <>{isAccessGranted && children}</>
}

export default ProtectedRoute
