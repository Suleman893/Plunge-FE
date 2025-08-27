//Third party imports
import { createSlice } from '@reduxjs/toolkit'

//Thunks Imports
import {
  addVideo,
  fetchAllInstructor,
  fetchAllPlaylist,
  fetchAllVideoTypes,
  fetchAllVideos,
  fetchAllVideosOptions,
  fetchDashboardStats,
  updateStatus,
  deleteVideo,
  editVideo
} from './thunk'

//Initial States Imports
import { initialState } from './initialState'

//Reset Action Import
import { resetStore } from '@features/resetStore'

export const videoManagementSlice = createSlice({
  name: 'videoManagement',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(resetStore, () => initialState)
      .addCase(fetchAllInstructor.pending, state => {
        state.allInstructorLoading = true
      })
      .addCase(fetchAllInstructor.fulfilled, (state, action) => {
        state.allInstructorLoading = false
        state.allInstructor = action.payload
      })
      .addCase(fetchAllInstructor.rejected, state => {
        state.allInstructorLoading = false
      })
      .addCase(fetchAllPlaylist.pending, state => {
        state.allPlayListLoading = true
      })
      .addCase(fetchAllPlaylist.fulfilled, (state, action) => {
        state.allPlayListLoading = false
        state.allPlaylist = action.payload
      })
      .addCase(fetchAllPlaylist.rejected, state => {
        state.allPlayListLoading = false
      })
      .addCase(fetchAllVideoTypes.pending, state => {
        state.allVideoTypesLoading = true
      })
      .addCase(fetchAllVideoTypes.fulfilled, (state, action) => {
        state.allVideoTypesLoading = false
        state.allVideoTypes = action.payload
      })
      .addCase(fetchAllVideoTypes.rejected, state => {
        state.allVideoTypesLoading = false
      })
      .addCase(addVideo.pending, state => {
        state.isAddVideoLoading = true
      })
      .addCase(addVideo.fulfilled, state => {
        state.isAddVideoLoading = false
        state.isAddVideoSuccess = !state.isAddVideoSuccess
      })
      .addCase(addVideo.rejected, state => {
        state.isAddVideoLoading = false
      })
      .addCase(fetchAllVideos.pending, state => {
        state.isAllVideoLoading = true
      })
      .addCase(fetchAllVideos.fulfilled, (state, action) => {
        state.isAllVideoLoading = false
        state.allVideos = action.payload
      })
      .addCase(fetchAllVideos.rejected, state => {
        state.isAllVideoLoading = false
      })
      .addCase(fetchAllVideosOptions.pending, state => {
        state.isAllVideosOptionsLoading = true
      })
      .addCase(fetchAllVideosOptions.fulfilled, (state, action) => {
        state.isAllVideosOptionsLoading = false
        state.allVideosOptions = action.payload
      })
      .addCase(fetchAllVideosOptions.rejected, state => {
        state.isAllVideosOptionsLoading = false
      })
      .addCase(fetchDashboardStats.pending, state => {
        state.isDashboardStatsLoading = true
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.isDashboardStatsLoading = false
        state.dashboardStats = action.payload
      })
      .addCase(fetchDashboardStats.rejected, state => {
        state.isDashboardStatsLoading = false
      })
      .addCase(updateStatus.pending, state => {
        state.isVideoStatusUpdateLoading = true
      })
      .addCase(updateStatus.fulfilled, state => {
        state.isVideoStatusUpdateLoading = false
        state.isVideoStatusUpdateSuccess = !state.isVideoStatusUpdateSuccess
      })
      .addCase(updateStatus.rejected, state => {
        state.isVideoStatusUpdateLoading = false
      })
      .addCase(deleteVideo.pending, state => {
        state.isVideoDeleteLoading = true
      })
      .addCase(deleteVideo.fulfilled, state => {
        state.isVideoDeleteLoading = false
        state.isVideoDeleteSuccess = !state.isVideoDeleteSuccess
      })
      .addCase(deleteVideo.rejected, state => {
        state.isVideoDeleteLoading = false
      })
      .addCase(editVideo.pending, state => {
        state.isEditVideoLoading = true
      })
      .addCase(editVideo.fulfilled, state => {
        state.isEditVideoLoading = false
        state.isEditVideoSuccess = !state.isEditVideoSuccess
      })
      .addCase(editVideo.rejected, state => {
        state.isEditVideoLoading = false
      })
  }
})

export default videoManagementSlice.reducer
