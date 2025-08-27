//Third Party Imports
import { createAsyncThunk } from '@reduxjs/toolkit'

//Service Imports
import dashboardService from '@features/dashboard/service'

export const fetchRecentStats = createAsyncThunk('dashboard/fetch-recent-users-stats', async (_, thunkAPI) => {
  try {
    return await dashboardService.fetchRecentStats()
  } catch (error: any) {
    const errorMessage: string = 'Failed to fetch recent users stats'

    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const fetchBasicStats = createAsyncThunk('dashboard/fetch-dashboard-basic-stats', async (_, thunkAPI) => {
  try {
    return await dashboardService.fetchBasicStats()
  } catch (error: any) {
    const errorMessage: string = 'Failed to fetch dashboard basic stats'

    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const fetchPopularVideos = createAsyncThunk('dashboard/fetch-dashboard-popular-videos', async (_, thunkAPI) => {
  try {
    return await dashboardService.fetchPopularVideos()
  } catch (error: any) {
    const errorMessage: string = 'Failed to fetch popular videos'

    return thunkAPI.rejectWithValue(errorMessage)
  }
})
