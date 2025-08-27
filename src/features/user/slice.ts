//Third party imports
import { createSlice } from '@reduxjs/toolkit'

//Thunks Imports
import { loggedInUser, editProfile, changePassword } from '@features/user/thunk'

//Initial State Imports
import { initialState } from './initialState'

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetUser: () => initialState
  },
  extraReducers: builder => {
    builder
      .addCase(loggedInUser.pending, state => {
        state.isInfoLoading = true
      })
      .addCase(loggedInUser.fulfilled, (state, action) => {
        state.isInfoLoading = false
        state.userInfo = action.payload
        state.isInfoSuccess = true
      })
      .addCase(loggedInUser.rejected, state => {
        state.isInfoLoading = false
      })
      .addCase(editProfile.pending, state => {
        state.isEditProfileLoading = true
      })
      .addCase(editProfile.fulfilled, (state, action) => {
        state.isEditProfileLoading = false
        state.userInfo = action.payload
      })
      .addCase(editProfile.rejected, state => {
        state.isEditProfileLoading = false
      })
      .addCase(changePassword.pending, state => {
        state.isChangePassLoading = true
      })
      .addCase(changePassword.fulfilled, state => {
        state.isChangePassLoading = false
      })
      .addCase(changePassword.rejected, state => {
        state.isChangePassLoading = false
      })
  }
})

export const { resetUser } = userSlice.actions
export default userSlice.reducer
