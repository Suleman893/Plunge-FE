'use client'

//React Imports
import { useEffect } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'

//Third Party Imports
import { useSelector, useDispatch } from 'react-redux'

//Component Imports
import BasicInfo from '@components/cards/BasicInfo'

//Types Imports
import type { BasicInfoProps } from '@custom-types/components/cards'

//Redux Imports
import type { RootState } from '@features/store'
import { fetchBasicStats } from '@features/app-user/thunk'

//Assets Imports
import User from '@assets/svgs/app-user-management/User'
import Users from '@assets/svgs/app-user-management/Users'

const BasicAnalytics = () => {
  const dispatch = useDispatch()

  const { basicStats, isAppUserStatusUpdateSuccess, isBasicStatsLoading } = useSelector(
    (state: RootState) => state.appUserManagement
  )

  useEffect(() => {
    dispatch(fetchBasicStats() as any)
  }, [isAppUserStatusUpdateSuccess])

  // Vars
  const data: BasicInfoProps[] = [
    {
      title: 'Total Registered Users',
      stats: basicStats?.totalUsers || 0,
      avatarIcon: <Users />,
      avatarColor: '#3E6CFF14'
    },
    {
      title: 'Active Users (Last 30 Days)',
      stats: basicStats?.totalLast30DaysActiveUsers || 0,
      avatarIcon: <User />,
      avatarColor: '#3E6CFF14'
    }
  ]

  return (
    <Grid container direction='column' spacing={4.5}>
      {data.map((item, i) => (
        <Grid key={i} size={{ xs: 12 }}>
          <BasicInfo {...item} isLoading={isBasicStatsLoading} />
        </Grid>
      ))}
    </Grid>
  )
}

export default BasicAnalytics
