//MUI Imports
import Grid from '@mui/material/Grid2'

//Components Imports
import SectionInfo from '@components/cards/SectionInfo'
import UserManagementTable from '@components/views/app-user-management/table/UserManagementTable'
import AppUsersCardSection from '@components/views/app-user-management/AppUserCardSection'

const AppUserManagement = () => {
  return (
    <div className='flex flex-col gap-6'>
      <Grid container spacing={6}>
        <AppUsersCardSection />
      </Grid>
      <SectionInfo title='User Management' description='Lorem Ipsum' />
      <UserManagementTable />
    </div>
  )
}

export default AppUserManagement
