//Third Party Imports
import { createSlice } from '@reduxjs/toolkit'

//Thunks Imports
import {
  fetchAllAppUsers,
  fetchRecentStats,
  fetchBasicStats,
  editUser,
  updateStatus,
  resetPassword,
  fetchUserInfo,
  fetchAssociatedPlunges,
  fetchLoggedSessions,
  fetchDeviceDetail
} from './thunk'

//Initial States Imports
import { initialState } from './initialState'

//Reset Action Imports
import { resetStore } from '@features/resetStore'

export const appUserManagementSlice = createSlice({
  name: 'appUserManagement',
  initialState,
  reducers: {
    storeAppUserUID: (state, action) => {
      state.appUserId = action.payload.id
      state.appUserUID = action.payload.uid
    }
  },
  extraReducers: builder => {
    builder
      .addCase(resetStore, () => initialState)
      .addCase(fetchAllAppUsers.pending, state => {
        state.isAllAppUserLoading = true
      })
      .addCase(fetchAllAppUsers.fulfilled, (state, action) => {
        state.isAllAppUserLoading = false
        state.allAppUsers = action.payload
      })
      .addCase(fetchAllAppUsers.rejected, state => {
        state.isAllAppUserLoading = false
      })
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
      .addCase(editUser.pending, state => {
        state.isEditUserLoading = true
      })
      .addCase(editUser.fulfilled, state => {
        state.isEditUserLoading = false
        state.isEditUserSuccess = !state.isEditUserSuccess
      })
      .addCase(editUser.rejected, state => {
        state.isEditUserLoading = false
      })
      .addCase(updateStatus.pending, state => {
        state.isAppUserStatusUpdateLoading = true
      })
      .addCase(updateStatus.fulfilled, state => {
        state.isAppUserStatusUpdateLoading = false
        state.isAppUserStatusUpdateSuccess = !state.isAppUserStatusUpdateSuccess
      })
      .addCase(updateStatus.rejected, state => {
        state.isAppUserStatusUpdateLoading = false
      })
      .addCase(resetPassword.pending, state => {
        state.isResetPasswordLoading = true
      })
      .addCase(resetPassword.fulfilled, state => {
        state.isResetPasswordLoading = false
      })
      .addCase(resetPassword.rejected, state => {
        state.isResetPasswordLoading = false
      })
      .addCase(fetchUserInfo.pending, state => {
        state.isFetchUserInfoLoading = true
      })
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        state.isFetchUserInfoLoading = false
        state.appUserInfo = action.payload
      })
      .addCase(fetchUserInfo.rejected, state => {
        state.isFetchUserInfoLoading = false
      })
      .addCase(fetchAssociatedPlunges.pending, state => {
        state.isAllAssociatedPlungesLoading = true
      })
      .addCase(fetchAssociatedPlunges.fulfilled, (state, action) => {
        state.isAllAssociatedPlungesLoading = false
        state.allAssociatedPlunges = action.payload
      })
      .addCase(fetchAssociatedPlunges.rejected, state => {
        state.isAllAssociatedPlungesLoading = false
      })
      .addCase(fetchLoggedSessions.pending, state => {
        state.isAllLoggedSessionLoading = true
      })
      .addCase(fetchLoggedSessions.fulfilled, (state, action) => {
        state.isAllLoggedSessionLoading = false
        state.allLoggedSession = action.payload
      })
      .addCase(fetchLoggedSessions.rejected, state => {
        state.isAllLoggedSessionLoading = false
      })
      .addCase(fetchDeviceDetail.pending, state => {
        state.isDeviceDetailLoading = true
      })
      .addCase(fetchDeviceDetail.fulfilled, (state, action) => {
        state.isDeviceDetailLoading = false
        state.deviceDetail = action.payload
      })
      .addCase(fetchDeviceDetail.rejected, state => {
        state.isDeviceDetailLoading = false
      })
  }
})

export const { storeAppUserUID } = appUserManagementSlice.actions
export default appUserManagementSlice.reducer
