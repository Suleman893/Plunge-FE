'use client'

//Third Party Imports
import { useSelector } from 'react-redux'

//Component Imports
import TabsView from '@components/tab'

//Redux Imports
import type { RootState } from '@features/store'

//Types Imports
import { Roles } from '@custom-types/common'

//Data Imports
import { tabOptions } from '@data/settings/index'

//View Import
import ManageUsersAndRoles from '@views/settings/ManageUsersAndRoles'
import Security from '@views/settings/Security'

const tabContentList = () => ({
  manageUsersAndRoles: <ManageUsersAndRoles />,
  security: <Security />
})

const SettingTabSection = () => {
  const { userInfo } = useSelector((state: RootState) => state.user)
  const isSuperAdmin = userInfo?.userType === Roles.SuperAdmin

  // Disable certain tabs for non-SuperAdmins
  const allowedTabOptions = tabOptions.map(option =>
    option.value === 'manageUsersAndRoles' ? { ...option, disabled: !isSuperAdmin } : option
  )

  const allowedInitialActive = isSuperAdmin ? 'manageUsersAndRoles' : 'security'

  return <TabsView initialActive={allowedInitialActive} viewList={tabContentList()} options={allowedTabOptions} />
}

export default SettingTabSection
