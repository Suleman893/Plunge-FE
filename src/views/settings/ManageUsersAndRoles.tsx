//Components Imports
import SectionInfo from '@components/cards/SectionInfo'
import UserTable from '@components/views/setting/table/UserTable'
import SettingSectionInfo from '@components/views/setting/SettingSectionInfo'
import AllRoles from '@components/views/setting/AllRoles'

const ManageUsersAndRoles = () => {
  return (
    <div className='flex flex-col gap-6'>
      <SettingSectionInfo />
      <AllRoles />
      <SectionInfo title='User Management' description='Lorem Ipsum' />
      <UserTable />
    </div>
  )
}

export default ManageUsersAndRoles
