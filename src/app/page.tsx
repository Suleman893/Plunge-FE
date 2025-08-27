'use client'

//React Imports
import { useEffect } from 'react'

//Next Imports
import { useRouter } from 'next/navigation'

//Third Party Imports
import { useSelector, useDispatch } from 'react-redux'

//Redux Imports
import type { RootState } from '@features/store'
import { loggedInUser } from '@features/user/thunk'

//Helpers Imports
import { getModuleHref } from '@helpers/accessControl'

export default function HomePage() {
  const router = useRouter()
  const dispatch = useDispatch()
  const { firebaseUser } = useSelector((state: RootState) => state.auth)
  const { userInfo } = useSelector((state: RootState) => state.user)

  useEffect(() => {
    const handleRedirect = async () => {
      if (!firebaseUser?.accessToken || !firebaseUser?.uid) {
        return router.push('/login')
      }

      let userInformation = userInfo

      if (!userInformation?.id) {
        const res = await dispatch(loggedInUser({ uid: firebaseUser.uid }) as any)

        if (res?.type !== 'user/loggedIn-user/fulfilled') {
          return router.push('/login')
        }

        userInformation = res.payload
      }

      if (userInformation?.id) {
        if (userInformation?.userType === 'super_admin') {
          return router.push('/dashboard')
        } else if (
          userInformation?.userType !== 'super_admin' &&
          userInformation?.role?.systemModules &&
          userInformation?.role?.systemModules?.length &&
          userInformation?.role?.systemModules[0]?.name
        ) {
          const redirectTo = getModuleHref(userInformation?.role?.systemModules[0]?.name)

          router.push(redirectTo)
        }

        // else {
        //   router.push('/not-found')
        // }
      }
    }

    // if (firebaseUser?.accessToken === null && userInfo?.id === null) {
    //   router.push('/login')
    // } else handleRedirect()
    handleRedirect()
  }, [firebaseUser?.accessToken, userInfo?.id, userInfo?.email])
}
