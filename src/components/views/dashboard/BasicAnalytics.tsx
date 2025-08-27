'use client'

//React Imports
import { useEffect } from 'react'

//MUI Imports
import Grid from '@mui/material/Grid2'

//Third Party Imports
import { useSelector, useDispatch } from 'react-redux'

//Component Imports
import BasicInfo from '@components/cards/BasicInfo'

//Types Imports
import type { BasicInfoProps } from '@custom-types/components/cards'

//Redux Imports
import type { RootState } from '@features/store'
import { fetchBasicStats } from '@features/dashboard/thunk'

//Assets Imports
import Video from '@assets/svgs/Video'
import Timer from '@assets/svgs/dashboard/Timer'
import Pause from '@assets/svgs/dashboard/Pause'
import VideoCam from '@assets/svgs/VideoCam'

const BasicAnalytics = () => {
  const dispatch = useDispatch()

  const { isBasicStatsLoading, basicStats } = useSelector((state: RootState) => state.dashboard)

  useEffect(() => {
    dispatch(fetchBasicStats() as any)
  }, [])

  //Vars
  const data: BasicInfoProps[] = [
    {
      title: 'Uploaded Videos',
      stats: basicStats?.totalUploadedVideos || 0,
      avatarIcon: <Video color='#3E6CFF' />,
      avatarColor: '#3E6CFF14'
    },
    {
      title: 'Total Sessions/Minutes',
      stats: basicStats?.totalUsersSessionMinutes || 0,
      avatarIcon: <Timer />,
      avatarColor: '#3E6CFF14'
    },
    {
      title: 'Recorded Sessions',
      stats: basicStats?.totalRecordedSessions || 0,
      avatarIcon: <VideoCam />,
      avatarColor: '#AAAAAA14'
    },
    {
      title: 'Total Video Plays',
      stats: basicStats?.totalVideoPlays || 0,
      avatarIcon: <Pause />,
      avatarColor: '#AAAAAA14'
    }
  ]

  return (
    <Grid container spacing={6}>
      {data.map((item, i) => (
        <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
          <BasicInfo {...item} isLoading={isBasicStatsLoading} height='108px' />
        </Grid>
      ))}
    </Grid>
  )
}

export default BasicAnalytics
