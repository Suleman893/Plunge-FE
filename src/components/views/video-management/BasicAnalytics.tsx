'use client'

//React Imports
import { useEffect } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'

//Third Party Imports
import { useSelector, useDispatch } from 'react-redux'

//Component Imports
import BasicInfo from '@components/cards/BasicInfo'

//Redux Imports
import { fetchDashboardStats } from '@features/video-management/thunk'
import type { RootState } from '@features/store'

//Types Imports
import type { BasicInfoProps } from '@custom-types/components/cards'

//Assets Imports
import Video from '@assets/svgs/Video'
import VideoCam from '@assets/svgs/VideoCam'

const BasicAnalytics = () => {
  const dispatch = useDispatch()

  const {
    dashboardStats,
    isDashboardStatsLoading,
    isAddVideoSuccess,
    isVideoStatusUpdateSuccess,
    isVideoDeleteSuccess
  } = useSelector((state: RootState) => state.videoManagement)

  useEffect(() => {
    dispatch(fetchDashboardStats() as any)
  }, [isAddVideoSuccess, isVideoStatusUpdateSuccess, isVideoDeleteSuccess])

  // Vars
  const data: BasicInfoProps[] = [
    {
      title: 'Total Uploaded Videos',
      stats: dashboardStats?.total || 0,
      avatarIcon: <Video color='#3E6CFF' />,
      avatarColor: '#3E6CFF14'
    },
    {
      title: 'Active Videos',
      stats: dashboardStats?.active || 0,
      avatarIcon: <Video color='#AAAAAA' />,
      avatarColor: '#AAAAAA14'
    },
    {
      title: 'Archived Videos',
      stats: dashboardStats?.inactive || 0,
      avatarIcon: <VideoCam />,
      avatarColor: '#AAAAAA14'
    }
  ]

  return (
    <Grid container spacing={6}>
      {data.map((item, i) => (
        <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
          <BasicInfo {...item} isLoading={isDashboardStatsLoading} />
        </Grid>
      ))}
    </Grid>
  )
}

export default BasicAnalytics
