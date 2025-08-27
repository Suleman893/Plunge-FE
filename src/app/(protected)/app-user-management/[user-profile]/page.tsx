//Views Import
import UserProfile from '@views/app-user-management/user-profile/UserProfile'

//Components Imports
import UserManagementTabSection from '@components/views/app-user-management/user-profile/TabSection'

const Page = async () => {
  return (
    <div className='flex flex-col gap-7'>
      <UserProfile />
      <UserManagementTabSection />
    </div>
  )
}

export default Page
