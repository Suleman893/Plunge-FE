//Third party imports
import { createSlice } from '@reduxjs/toolkit'

//Thunks Imports
import {
  fetchAllPlaylist,
  fetchAllLicenseTypes,
  addMusic,
  fetchAllMusics,
  fetchDashboardStats,
  updateStatus,
  deleteMusic,
  editMusic,
  fetchMuxAudioMeta
} from './thunk'

//Initial States Imports
import { initialState } from './initialState'

//Reset Action Import
import { resetStore } from '@features/resetStore'

export const musicManagementSlice = createSlice({
  name: 'musicManagement',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(resetStore, () => initialState)
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
      .addCase(fetchAllLicenseTypes.pending, state => {
        state.allLicenseTypesLoading = true
      })
      .addCase(fetchAllLicenseTypes.fulfilled, (state, action) => {
        state.allLicenseTypesLoading = false
        state.allLicenseTypes = action.payload
      })
      .addCase(fetchAllLicenseTypes.rejected, state => {
        state.allLicenseTypesLoading = false
      })
      .addCase(addMusic.pending, state => {
        state.isAddMusicLoading = true
      })
      .addCase(addMusic.fulfilled, state => {
        state.isAddMusicLoading = false
        state.isAddMusicSuccess = !state.isAddMusicSuccess
      })
      .addCase(addMusic.rejected, state => {
        state.isAddMusicLoading = false
      })
      .addCase(fetchAllMusics.pending, state => {
        state.isAllMusicLoading = true
      })
      .addCase(fetchAllMusics.fulfilled, (state, action) => {
        state.isAllMusicLoading = false
        state.allMusics = action.payload
      })
      .addCase(fetchAllMusics.rejected, state => {
        state.isAllMusicLoading = false
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
        state.isMusicStatusUpdateLoading = true
      })
      .addCase(updateStatus.fulfilled, state => {
        state.isMusicStatusUpdateLoading = false
        state.isMusicStatusUpdateSuccess = !state.isMusicStatusUpdateSuccess
      })
      .addCase(updateStatus.rejected, state => {
        state.isMusicStatusUpdateLoading = false
      })
      .addCase(deleteMusic.pending, state => {
        state.isMusicDeleteLoading = true
      })
      .addCase(deleteMusic.fulfilled, state => {
        state.isMusicDeleteLoading = false
        state.isMusicDeleteSuccess = !state.isMusicDeleteSuccess
      })
      .addCase(deleteMusic.rejected, state => {
        state.isMusicDeleteLoading = false
      })
      .addCase(editMusic.pending, state => {
        state.isEditMusicLoading = true
      })
      .addCase(editMusic.fulfilled, state => {
        state.isEditMusicLoading = false
        state.isEditMusicSuccess = !state.isEditMusicSuccess
      })
      .addCase(editMusic.rejected, state => {
        state.isEditMusicLoading = false
      })
      .addCase(fetchMuxAudioMeta.pending, state => {
        state.isMuxAudioMetaLoading = true
      })
      .addCase(fetchMuxAudioMeta.fulfilled, state => {
        state.isMuxAudioMetaLoading = false
      })
      .addCase(fetchMuxAudioMeta.rejected, state => {
        state.isMuxAudioMetaLoading = false
      })
  }
})

export default musicManagementSlice.reducer
