//Third party imports
import { createSlice } from '@reduxjs/toolkit'

//Thunks Imports
import {
  addUser,
  checkEmailExpiry,
  activateInvitedUser,
  fetchAllUsers,
  updateStatus,
  deleteUser,
  editUserDetail,
  resetPassword,
  resendInvite
} from '@features/users/thunk'

//Initial State Imports
import { initialState } from './initialState'

//Reset Action Import
import { resetStore } from '../resetStore'

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(resetStore, () => initialState)
      .addCase(addUser.pending, state => {
        state.isAddUserLoading = true
      })
      .addCase(addUser.fulfilled, state => {
        state.isAddUserLoading = false
        state.isAddUserSuccess = !state.isAddUserSuccess
      })
      .addCase(addUser.rejected, state => {
        state.isAddUserLoading = false
      })
      .addCase(checkEmailExpiry.pending, state => {
        state.isEmailVerified = false
        state.isEmailExpiryLoading = true
      })
      .addCase(checkEmailExpiry.fulfilled, state => {
        state.isEmailExpiryLoading = false
        state.isEmailVerified = true
      })
      .addCase(checkEmailExpiry.rejected, state => {
        state.isEmailExpiryLoading = false
      })
      .addCase(resendInvite.pending, state => {
        state.isResendInviteLoading = true
      })
      .addCase(resendInvite.fulfilled, state => {
        state.isResendInviteLoading = false
      })
      .addCase(resendInvite.rejected, state => {
        state.isResendInviteLoading = false
      })
      .addCase(activateInvitedUser.pending, state => {
        state.isActivateInvitedUserLoading = true
      })
      .addCase(activateInvitedUser.fulfilled, state => {
        state.isActivateInvitedUserLoading = false
      })
      .addCase(activateInvitedUser.rejected, state => {
        state.isActivateInvitedUserLoading = false
      })
      .addCase(fetchAllUsers.pending, state => {
        state.isAllUsersLoading = true
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.isAllUsersLoading = false
        state.allUsers = action.payload
      })
      .addCase(fetchAllUsers.rejected, state => {
        state.isAllUsersLoading = false
      })
      .addCase(updateStatus.pending, state => {
        state.isUserStatusUpdateLoading = true
      })
      .addCase(updateStatus.fulfilled, state => {
        state.isUserStatusUpdateLoading = false
        state.isUserStatusUpdateSuccess = !state.isUserStatusUpdateSuccess
      })
      .addCase(updateStatus.rejected, state => {
        state.isUserStatusUpdateLoading = false
      })
      .addCase(deleteUser.pending, state => {
        state.isUserDeleteLoading = true
      })
      .addCase(deleteUser.fulfilled, state => {
        state.isUserDeleteLoading = false
        state.isUserDeleteSuccess = !state.isUserDeleteSuccess
      })
      .addCase(deleteUser.rejected, state => {
        state.isUserDeleteLoading = false
      })
      .addCase(editUserDetail.pending, state => {
        state.isEditUserDetailLoading = true
      })
      .addCase(editUserDetail.fulfilled, state => {
        state.isEditUserDetailLoading = false
        state.isEditUserDetailSuccess = !state.isEditUserDetailSuccess
      })
      .addCase(editUserDetail.rejected, state => {
        state.isEditUserDetailLoading = false
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
  }
})

export default usersSlice.reducer
