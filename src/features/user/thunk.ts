//Third Party Imports
import { createAsyncThunk } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import { FirebaseError } from 'firebase/app'
import { nanoid } from 'nanoid'

//API Service Import
import userService from '@features/user/service'

//Utils Imports
import { uploadFileAndGetURL, deleteFileFromBucket } from '@utils/firebaseBucket'

//Constants Imports
import { USER_PIC_MAX_SIZE, USER_PIC_TYPE } from '@constants/common'

//Redux Import
import { renewAccessToken } from '@features/auth/slice'

export const loggedInUser = createAsyncThunk('user/loggedIn-user', async (payload: any, thunkAPI) => {
  try {
    return await userService.loggedInUser(payload)
  } catch (error) {
    const errorMessage: string = 'Failed to fetch user info'

    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const editProfile = createAsyncThunk('user/edit-profile', async (payload: any, thunkAPI) => {
  try {
    const { itemData, data, selectedFile } = payload

    //If update image
    if (selectedFile) {
      // const fileName = `${Date.now()}-${selectedFile.name}`

      const fileName = `${nanoid()}-${selectedFile.name}`

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

    return await userService.editProfile(payload)
  } catch (error) {
    console.log('The error', error)

    const errorMessage: string = 'Failed to update profile'

    toast.error(errorMessage)

    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const changePassword = createAsyncThunk('user/change-password', async (payload: any, thunkAPI) => {
  try {
    const newIdToken = await userService.changePassword(payload)

    return thunkAPI.dispatch(renewAccessToken({ newAccessToken: newIdToken }))
  } catch (error) {
    let errorMessage: string = 'Failed to update password'

    if (error instanceof FirebaseError) {
      switch (error.code) {
        case 'auth/invalid-credential':
        case 'auth/invalid-password':
        case 'auth/wrong-password':
          errorMessage = 'Invalid current password'
          break
      }
    }

    toast.error(errorMessage)

    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const lastPasswordChange = createAsyncThunk('user/last-password-change', async (payload: any, thunkAPI) => {
  try {
    return await userService.lastPasswordChange(payload)
  } catch (error) {
    const errorMessage: string = 'Failed to update last password change'

    return thunkAPI.rejectWithValue(errorMessage)
  }
})
