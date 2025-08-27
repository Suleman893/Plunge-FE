'use client'

//React Imports
import { useEffect } from 'react'

//MUI Imports
import Grid from '@mui/material/Grid2'

//Third Party Imports
import { useSelector, useDispatch } from 'react-redux'

//Component Imports
import BasicInfo from '@components/cards/BasicInfo'

//Redux Imports
import { fetchDashboardStats } from '@features/music-management/thunk'
import type { RootState } from '@features/store'

//Types Imports
import type { BasicInfoProps } from '@custom-types/components/cards'

//Assets Imports
import MusicNote from '@assets/svgs/MusicNote'
import MusicNotes from '@assets/svgs/MusicNotes'

const BasicAnalytics = () => {
  const dispatch = useDispatch()

  const {
    dashboardStats,
    isDashboardStatsLoading,
    isAddMusicSuccess,
    isMusicDeleteSuccess,
    isMusicStatusUpdateSuccess,
    isEditMusicSuccess
  } = useSelector((state: RootState) => state.musicManagement)

  useEffect(() => {
    dispatch(fetchDashboardStats() as any)
  }, [isAddMusicSuccess, isMusicDeleteSuccess, isMusicStatusUpdateSuccess, isEditMusicSuccess])

  // Vars
  const data: BasicInfoProps[] = [
    {
      title: 'Total Uploaded Music',
      stats: dashboardStats?.total || 0,
      avatarIcon: <MusicNotes />,
      avatarColor: '#3E6CFF14'
    },
    {
      title: 'Active Music',
      stats: dashboardStats?.active || 0,
      avatarIcon: <MusicNote />,
      avatarColor: '#AAAAAA14'
    },
    {
      title: 'Archived Music',
      stats: dashboardStats?.inactive || 0,
      avatarIcon: <MusicNote />,
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
