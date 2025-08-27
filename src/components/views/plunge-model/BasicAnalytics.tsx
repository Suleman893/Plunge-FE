'use client'

//React Imports
import { useEffect } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'

// Third Party Imports
import { useSelector, useDispatch } from 'react-redux'

//Component Imports
import BasicInfo from '@components/cards/BasicInfo'

//Types Imports
import type { BasicInfoProps } from '@custom-types/components/cards'

//Redux Imports
import type { RootState } from '@features/store'
import { fetchDashboardStats } from '@features/plunge-model/thunk'

//Assets Imports
import PlungeBox from '@assets/svgs/PlungeBox'

const BasicAnalytics = () => {
  const dispatch = useDispatch()

  const { dashboardStats, isDashboardStatsLoading, isPlungeStatusUpdateSuccess, isPlungeDeleteSuccess } = useSelector(
    (state: RootState) => state.plungeModel
  )

  useEffect(() => {
    dispatch(fetchDashboardStats() as any)
  }, [isPlungeStatusUpdateSuccess, isPlungeDeleteSuccess])

  // Vars
  const data: BasicInfoProps[] = [
    {
      title: 'Total Models',
      stats: dashboardStats?.total || 0,
      avatarIcon: <PlungeBox color='#3E6CFF' />,
      avatarColor: '#3E6CFF14'
    },
    {
      title: 'Active Models',
      stats: dashboardStats?.active || 0,
      avatarIcon: <PlungeBox color='#3E6CFF' />,
      avatarColor: '#3E6CFF14'
    },
    {
      title: 'Disabled Models',
      stats: dashboardStats?.inactive || 0,
      avatarIcon: <PlungeBox color='#AAAAAA' />,
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
