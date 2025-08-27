//Third Party Imports
import { createAsyncThunk } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import { nanoid } from 'nanoid'

//API Service Import
import usersService from '@features/users/service'

//Utils and Helpers Imports
import { uploadFileAndGetURL, deleteFileFromBucket } from '@utils/firebaseBucket'
import httpStatus from '@constants/httpStatus'

//Constants Imports
import { USER_PIC_MAX_SIZE, USER_PIC_TYPE } from '@constants/common'

export const addUser = createAsyncThunk('users/onboard-user', async (payload: any, thunkAPI) => {
  try {
    return await usersService.addUser(payload)
  } catch (error: any) {
    let errorMessage: string = 'Failed to add user'

    if (error.status === httpStatus.BAD_REQUEST) {
      errorMessage = 'Email already exists'
    }

    toast.error(errorMessage)

    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const checkEmailExpiry = createAsyncThunk('users/check-email-expiry', async (payload: any, thunkAPI) => {
  try {
    return await usersService.checkEmailExpiry(payload)
  } catch (error: any) {
    const errorMessage: string = 'Invalid link or expired'

    toast.error(errorMessage)

    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const resendInvite = createAsyncThunk('users/resend-invite', async (payload: any, thunkAPI) => {
  try {
    return await usersService.resendInvite(payload)
  } catch (error: any) {
    const errorMessage: string = 'Failed to resend the invite'

    toast.error(errorMessage)

    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const activateInvitedUser = createAsyncThunk('users/activate-invited-user', async (payload: any, thunkAPI) => {
  try {
    const { uid, router, data } = payload

    const formattedPayload = {
      uid,
      router,
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        password: data.password
      }
    }

    return await usersService.activateInvitedUser(formattedPayload)
  } catch (error: any) {
    const errorMessage: string = 'Failed to activate'

    toast.error(errorMessage)

    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const fetchAllUsers = createAsyncThunk('users/fetch-all-users', async (payload: any, thunkAPI) => {
  try {
    return await usersService.fetchAllUsers(payload)
  } catch (error: any) {
    const errorMessage: string = 'Failed to fetch all users'

    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const updateStatus = createAsyncThunk('users/update-status', async (payload: any, thunkAPI) => {
  try {
    return await usersService.updateStatus(payload)
  } catch (error: any) {
    const errorMessage: string = 'Failed to update status'

    toast.error(errorMessage)

    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const deleteUser = createAsyncThunk('users/delete-user', async (payload: any, thunkAPI) => {
  try {
    return await usersService.deleteUser(payload)
  } catch (error: any) {
    const errorMessage: string = 'Failed to delete user'

    toast.error(errorMessage)

    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const editUserDetail = createAsyncThunk('users/edit-user-detail', async (payload: any, thunkAPI) => {
  try {
    const { itemData, data, selectedFile } = payload

    //If update image
    if (selectedFile) {
      // const fileName = `${Date.now()}-${selectedFile.name}`

      const fileName = `${nanoid()}-${selectedFile.name}`

      // const fileName = `${selectedFile.name}`

      //Upload new file
      const fileUrl = await uploadFileAndGetURL(selectedFile, `users/${fileName}`, USER_PIC_TYPE, USER_PIC_MAX_SIZE)

      data.photo = fileUrl

      //Remove previous file if exist
      if (itemData?.photo) await deleteFileFromBucket(itemData?.photo)
    }

    //If reset image
    if (itemData?.photo && !data?.photo) {
      await deleteFileFromBucket(itemData?.photo)
    }

    return await usersService.editUserDetail(payload)
  } catch (error) {
    console.log('The error', error)

    const errorMessage: string = 'Failed to update user details'

    toast.error(errorMessage)

    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const resetPassword = createAsyncThunk('users/reset-password', async (payload: any, thunkAPI) => {
  try {
    return await usersService.resetPassword(payload)
  } catch (error) {
    const errorMessage: string = 'Failed to reset password'

    toast.error(errorMessage)

    return thunkAPI.rejectWithValue(errorMessage)
  }
})
