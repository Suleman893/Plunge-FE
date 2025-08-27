//MUI Imports
import Grid from '@mui/material/Grid2'

//Components Imports
import BasicAnalytics from '@components/views/app-user-management/BasicAnalytics'
import MonthlyReportCardSection from '@components/views/app-user-management/MonthlyReportCardSec'

const AppUsersCardSection = () => {
  return (
    <>
      <Grid size={{ xs: 12, md: 6 }}>
        <MonthlyReportCardSection />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <BasicAnalytics />
      </Grid>
    </>
  )
}

export default AppUsersCardSection
