//Third Party Imports
import { createAsyncThunk } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

//Service Imports
import appUserManagementService from '@features/app-user/service'

//Utils Imports
import { deleteFileFromBucket } from '@utils/firebaseBucket'

export const fetchAllAppUsers = createAsyncThunk('appUser/fetch-all-app-users', async (payload: any, thunkAPI) => {
  try {
    return await appUserManagementService.fetchAllAppUsers(payload)
  } catch (error: any) {
    const errorMessage: string = 'Failed to fetch all app users'

    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const fetchRecentStats = createAsyncThunk('appUser/fetch-recent-stats', async (_, thunkAPI) => {
  try {
    return await appUserManagementService.fetchRecentStats()
  } catch (error: any) {
    const errorMessage: string = 'Failed to fetch recent stats'

    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const fetchBasicStats = createAsyncThunk('appUser/fetch-basic-stats', async (_, thunkAPI) => {
  try {
    return await appUserManagementService.fetchBasicStats()
  } catch (error: any) {
    const errorMessage: string = 'Failed to fetch basic stats'

    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const editUser = createAsyncThunk('appUser/edit-user', async (payload: any, thunkAPI) => {
  try {
    const { itemData, data } = payload

    //Reset image
    if (itemData?.photo && !data?.photo) {
      await deleteFileFromBucket(itemData?.photo)
    }

    return await appUserManagementService.editUser(payload)
  } catch (error: any) {
    const errorMessage: string = 'Failed to update user'

    toast.error(errorMessage)

    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const updateStatus = createAsyncThunk('appUser/update-status', async (payload: any, thunkAPI) => {
  try {
    return await appUserManagementService.updateStatus(payload)
  } catch (error: any) {
    const errorMessage: string = 'Failed to update status'

    toast.error(errorMessage)

    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const resetPassword = createAsyncThunk('appUser/reset-password', async (payload: any, thunkAPI) => {
  try {
    return await appUserManagementService.resetPassword(payload)
  } catch (error) {
    const errorMessage: string = 'Failed to reset password'

    toast.error(errorMessage)

    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const fetchUserInfo = createAsyncThunk('appUser/fetch-user-info', async (payload: any, thunkAPI) => {
  try {
    return await appUserManagementService.fetchUserInfo(payload)
  } catch (error) {
    const errorMessage: string = 'Failed to fetch user info'

    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const fetchAssociatedPlunges = createAsyncThunk(
  'appUser/fetch-associated-plunges',
  async (payload: any, thunkAPI) => {
    try {
      return await appUserManagementService.fetchAssociatedPlunges(payload)
    } catch (error) {
      const errorMessage: string = 'Failed to fetch user associated plunge'

      return thunkAPI.rejectWithValue(errorMessage)
    }
  }
)

export const fetchLoggedSessions = createAsyncThunk('appUser/fetch-logged-session', async (payload: any, thunkAPI) => {
  try {
    return await appUserManagementService.fetchLoggedSessions(payload)
  } catch (error) {
    const errorMessage: string = 'Failed to fetch user logged session'

    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const fetchDeviceDetail = createAsyncThunk('appUser/fetch-device-detail', async (payload: any, thunkAPI) => {
  try {
    return await appUserManagementService.fetchDeviceDetail(payload)
  } catch (error) {
    const errorMessage: string = 'Failed to fetch device detail'

    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const lastPasswordChange = createAsyncThunk('appUser/last-password-change', async (payload: any, thunkAPI) => {
  try {
    return await appUserManagementService.lastPasswordChange(payload)
  } catch (error) {
    const errorMessage: string = 'Failed to update last password change of app user'

    return thunkAPI.rejectWithValue(errorMessage)
  }
})
