'use client'

//Next Imports
import { useRouter } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

const MostRecentCardWrapper = (props: any) => {
  //Hooks
  const router = useRouter()

  const { heading, subHeading, content, navigateTo } = props

  return (
    <Card
      sx={{
        height: {
          xs: 'auto',
          md: '475px'
        }
      }}
    >
      <CardHeader
        title={heading}
        subheader={subHeading}
        action={
          <p className='text-primary font-medium cursor-pointer' onClick={() => router.push(navigateTo)}>
            View All
          </p>
        }
        titleTypographyProps={{ fontSize: 18, fontWeight: 600 }}
        subheaderTypographyProps={{ fontSize: 14, fontWeight: 400 }}
      />
      <CardContent className='flex flex-col gap-4'>{content}</CardContent>
    </Card>
  )
}

export default MostRecentCardWrapper
