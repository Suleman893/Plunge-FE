'use client'

//React Imports
import { useEffect } from 'react'

//Third Party Imports
import { useSelector, useDispatch } from 'react-redux'

//Components Imports
import UserOverview from '@components/views/app-user-management/user-profile/UserOverview'
import UserProfileHeader from '@components/views/app-user-management/user-profile/UserProfileHeader'
import UserProfileSectionInfo from '@components/views/app-user-management/user-profile/UserProfileSectionInfo'

//Redux Imports
import { fetchUserInfo } from '@features/app-user/thunk'
import type { RootState } from '@features/store'

const UserProfile = () => {
  const { appUserUID, isAppUserStatusUpdateSuccess, isEditUserSuccess } = useSelector(
    (state: RootState) => state.appUserManagement
  )

  //Hooks
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchUserInfo({ uid: appUserUID }) as any)
  }, [isAppUserStatusUpdateSuccess, isEditUserSuccess])

  return (
    <div className='flex flex-col gap-5'>
      <UserProfileSectionInfo />
      <UserProfileHeader />
      <UserOverview />
    </div>
  )
}

export default UserProfile
