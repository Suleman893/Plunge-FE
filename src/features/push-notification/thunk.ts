//Third Party Imports
import { createAsyncThunk } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

//Service Import
import notificationService from '@features/push-notification/service'

export const createNotification = createAsyncThunk('pushNotification/create', async (payload: any, thunkAPI) => {
  try {
    return await notificationService.createNotification(payload)
  } catch (error: any) {
    const errorMessage: string = 'Failed to create notification'

    toast.error(errorMessage)

    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const fetchAllNotifications = createAsyncThunk(
  'pushNotification/fetch-all-notification',
  async (payload: any, thunkAPI) => {
    try {
      return await notificationService.fetchAllNotifications(payload)
    } catch (error: any) {
      const errorMessage: string = 'Failed to fetch all notifications'

      return thunkAPI.rejectWithValue(errorMessage)
    }
  }
)

export const deleteNotification = createAsyncThunk(
  'pushNotification/delete-notification',
  async (payload: any, thunkAPI) => {
    try {
      return await notificationService.deleteNotification(payload)
    } catch (error: any) {
      const errorMessage: string = 'Failed to delete notification'

      toast.error(errorMessage)

      return thunkAPI.rejectWithValue(errorMessage)
    }
  }
)

export const editNotification = createAsyncThunk('pushNotification/edit', async (payload: any, thunkAPI) => {
  try {
    return await notificationService.editNotification(payload)
  } catch (error: any) {
    const errorMessage: string = 'Failed to update notification'

    toast.error(errorMessage)

    return thunkAPI.rejectWithValue(errorMessage)
  }
})
