//MUI Imports
import Grid from '@mui/material/Grid2'

//Components Imports
import MostPopularVideo from '@components/views/dashboard/cards/MostPopularVideo'
import PushNotificationHistory from '@components/views/dashboard/cards/PushNotificationHistory'
import MostRecentCardWrapper from '@components/views/dashboard/cards/MostRecentCardWrapper'

const MostRecent = () => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12, md: 6 }}>
        <MostRecentCardWrapper
          heading='Most Popular Videos'
          subHeading={`Sorting in this section is determined by the user's view.`}
          content={<MostPopularVideo />}
          navigateTo='/video-management'
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <MostRecentCardWrapper
          heading='Push Notifications History'
          subHeading='This list is based on your notification activity'
          content={<PushNotificationHistory />}
          navigateTo='/push-notifications'
        />
      </Grid>
    </Grid>
  )
}

export default MostRecent
