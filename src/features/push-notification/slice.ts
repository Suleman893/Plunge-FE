//Third party Imports
import { createSlice } from '@reduxjs/toolkit'

//Thunks Imports
import { createNotification, fetchAllNotifications, deleteNotification, editNotification } from './thunk'

//Initial State Imports
import { initialState } from './initialState'

export const pushNotificationSlice = createSlice({
  name: 'pushNotification',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(createNotification.pending, state => {
        state.isCreateNotificationLoading = true
      })
      .addCase(createNotification.fulfilled, state => {
        state.isCreateNotificationLoading = false
        state.isCreateNotificationSuccess = !state.isCreateNotificationSuccess
      })
      .addCase(createNotification.rejected, state => {
        state.isCreateNotificationLoading = false
      })
      .addCase(fetchAllNotifications.pending, state => {
        state.isAllNotificationLoading = true
      })
      .addCase(fetchAllNotifications.fulfilled, (state, action) => {
        state.isAllNotificationLoading = false
        state.allNotifications = action.payload
      })
      .addCase(fetchAllNotifications.rejected, state => {
        state.isAllNotificationLoading = false
      })
      .addCase(deleteNotification.pending, state => {
        state.isNotificationDeleteLoading = true
      })
      .addCase(deleteNotification.fulfilled, state => {
        state.isNotificationDeleteLoading = false
        state.isNotificationDeleteSuccess = !state.isNotificationDeleteSuccess
      })
      .addCase(deleteNotification.rejected, state => {
        state.isNotificationDeleteLoading = false
      })
      .addCase(editNotification.pending, state => {
        state.isEditNotificationLoading = true
      })
      .addCase(editNotification.fulfilled, state => {
        state.isEditNotificationLoading = false
        state.isEditNotificationSuccess = !state.isEditNotificationSuccess
      })
      .addCase(editNotification.rejected, state => {
        state.isEditNotificationLoading = false
      })
  }
})

export default pushNotificationSlice.reducer
