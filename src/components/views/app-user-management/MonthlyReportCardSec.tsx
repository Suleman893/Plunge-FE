'use client'

//React Imports
import { useEffect } from 'react'

//Third Party Imports
import { useSelector, useDispatch } from 'react-redux'

//Redux Imports
import type { RootState } from '@features/store'
import { fetchRecentStats } from '@features/app-user/thunk'

//Component Imports
import MonthlyReport from '@components/cards/MonthlyReport'

const MonthlyReportCardSection = () => {
  //Hooks
  const dispatch = useDispatch()

  const { isRecentStatsLoading, recentStats } = useSelector((state: RootState) => state.appUserManagement)

  useEffect(() => {
    dispatch(fetchRecentStats() as any)
  }, [])

  return <MonthlyReport isLoading={isRecentStatsLoading} data={recentStats} />
}

export default MonthlyReportCardSection
