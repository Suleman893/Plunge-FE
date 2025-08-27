//Third Party Imports
import { createSlice } from '@reduxjs/toolkit'

//Thunks Imports
import { fetchRecentStats, fetchBasicStats, fetchPopularVideos } from './thunk'

//Initial States Imports
import { initialState } from './initialState'

//Reset Action Imports
import { resetStore } from '@features/resetStore'

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(resetStore, () => initialState)
      .addCase(fetchRecentStats.pending, state => {
        state.isRecentStatsLoading = true
      })
      .addCase(fetchRecentStats.fulfilled, (state, action) => {
        state.isRecentStatsLoading = false
        state.recentStats = action.payload
      })
      .addCase(fetchRecentStats.rejected, state => {
        state.isRecentStatsLoading = false
      })
      .addCase(fetchBasicStats.pending, state => {
        state.isBasicStatsLoading = true
      })
      .addCase(fetchBasicStats.fulfilled, (state, action) => {
        state.isBasicStatsLoading = false
        state.basicStats = action.payload
      })
      .addCase(fetchBasicStats.rejected, state => {
        state.isBasicStatsLoading = false
      })
      .addCase(fetchPopularVideos.pending, state => {
        state.isPopularVideosLoading = true
      })
      .addCase(fetchPopularVideos.fulfilled, (state, action) => {
        state.isPopularVideosLoading = false
        state.popularVideos = action.payload
      })
      .addCase(fetchPopularVideos.rejected, state => {
        state.isPopularVideosLoading = false
      })
  }
})

export default dashboardSlice.reducer
