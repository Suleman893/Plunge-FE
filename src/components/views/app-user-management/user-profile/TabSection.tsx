'use client'

//Components Imports
import TabsView from '@components/tab'

//Data Imports
import { tabOptions } from '@data/user-management/index'

//View Import
import AssociatedPlungesTable from '@components/views/app-user-management/user-profile/table/AssociatedPlungesTable'
import UserLoggedSessionTable from '@components/views/app-user-management/user-profile/table/UserLoggedSessionTable'

const tabContentList = () => ({
  associatedPlunges: <AssociatedPlungesTable />,
  userLoggedSession: <UserLoggedSessionTable />
})

const UserManagementTabSection = () => {
  return <TabsView initialActive='associatedPlunges' viewList={tabContentList()} options={tabOptions} />
}

export default UserManagementTabSection
