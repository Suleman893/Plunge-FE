'use client'

//React Imports
import { useEffect } from 'react'

//MUI Imports
import Grid from '@mui/material/Grid2'
import Divider from '@mui/material/Divider'

//Third Party Imports
import { useSelector, useDispatch } from 'react-redux'

//Component Imports
import BasicInfo from '@components/cards/BasicInfo'

//Types Imports
import type { BasicInfoProps } from '@custom-types/components/cards'

//Redux Imports
import type { RootState } from '@features/store'
import { fetchRecentStats } from '@features/dashboard/thunk'

//Assets Imports
import Users from '@assets/svgs/app-user-management/Users'
import AddUser from '@assets/svgs/dashboard/AddUser'

const DashboardCard = () => {
  const dispatch = useDispatch()

  const { recentStats } = useSelector((state: RootState) => state.dashboard)

  useEffect(() => {
    dispatch(fetchRecentStats() as any)
  }, [])

  //Vars
  const data: BasicInfoProps[] = [
    {
      title: 'Total Users',
      stats: recentStats?.totalUsers,
      avatarIcon: <Users />,
      avatarColor: '#3E6CFF14'
    },
    {
      title: 'New Sign Ups (this month)',
      stats: recentStats?.signupThisMonth,
      avatarIcon: <AddUser />,
      avatarColor: '#3E6CFF14'
    }
  ]

  return (
    <>
      <Grid container spacing={6} sx={{ p: '25px' }}>
        {data.map((item, i) => (
          <Grid key={i} size={{ xs: 12, md: 6 }}>
            <BasicInfo {...item} bgColor='#F8F8F8' boxShadow='none' border='1px solid #EEEEEE' />
          </Grid>
        ))}
      </Grid>
      <Divider />
    </>
  )
}

export default DashboardCard
