//Third Party Imports
import { createAsyncThunk } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import { FirebaseError } from 'firebase/app'

//Service Import
import authService from '@features/auth/service'

//Thunks Imports
import { resetUser } from '../user/slice'
import { loggedInUser } from '../user/thunk'

export const register = createAsyncThunk('auth/register', async (payload: any, thunkAPI) => {
  try {
    return await authService.register(payload)
  } catch (error) {
    let errorMessage = 'Registration failed'

    if (error instanceof FirebaseError) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Email already registered '
          break
      }
    }

    toast.error(errorMessage)

    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const verifyEmail = createAsyncThunk('auth/verify-email', async (payload: any, thunkAPI) => {
  try {
    return await authService.verifyEmail(payload)
  } catch (error) {
    let errorMessage = 'Failed to verify user'

    if (error instanceof FirebaseError) {
      switch (error.code) {
        case 'auth/invalid-action-code':
          errorMessage = 'Verification link is invalid or expired'
          break
      }
    }

    toast.error(errorMessage)

    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const login = createAsyncThunk('auth/login', async (payload: any, thunkAPI) => {
  try {
    const res = await authService.login(payload)

    const response = await thunkAPI.dispatch(loggedInUser({ uid: res?.uid }) as any)

    if (response.type !== 'user/loggedIn-user/fulfilled') {
      toast.error('Unauthorized access.')

      payload?.router.push('/login')
      await thunkAPI.dispatch(logout() as any)
    }

    if (response.type === 'user/loggedIn-user/fulfilled') {
      toast.success('Login successful')
      payload?.router.push('/')

      return res
    }
  } catch (error) {
    let errorMessage = 'Login failed'

    if (error instanceof FirebaseError) {
      switch (error.code) {
        // Email enumeration protection from firebase, when ON then "invalid credentials" error else "User not found"
        case 'auth/user-not-found':
          errorMessage = 'Invalid credentials'
          break
        case 'auth/invalid-credential':
        case 'auth/invalid-email':
        case 'auth/invalid-password':
        case 'auth/wrong-password':
          errorMessage = 'Invalid credentials'
          break
        case 'auth/email-not-verified':
          errorMessage = 'Email not verified'
          break
        case 'auth/user-disabled':
          errorMessage = 'Account is suspend'
          break
      }
    }

    toast.error(errorMessage)

    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const forgotPassword = createAsyncThunk('auth/forgot-password', async (payload: any, thunkAPI) => {
  try {
    return await authService.forgotPassword(payload)
  } catch (error) {
    let errorMessage = 'Server Error'

    if (error instanceof FirebaseError) {
      switch (error.code) {
        // Email enumeration protection from firebase, when ON then email sent message, but email wont be sent and wont be a error else "Email not found"
        case 'auth/user-not-found':
        case 'auth/email-not-found':
          errorMessage = 'User not found'
          break
      }
    }

    toast.error(errorMessage)

    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const resetPassword = createAsyncThunk('auth/reset-password', async (payload: any, thunkAPI) => {
  try {
    const response = await authService.resetPassword(payload)

    return response
  } catch (error) {
    let errorMessage = 'Failed to reset password'

    if (error instanceof FirebaseError) {
      switch (error.code) {
        case 'auth/invalid-action-code':
          errorMessage = 'Reset link is expired'
          break
      }
    }

    toast.error(errorMessage)

    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    await authService.logout()

    //Reset the user slice state as well after successfully logout from firebase
    thunkAPI.dispatch(resetUser())
  } catch (error) {
    const errorMessage = 'Failed to logout'

    toast.error(errorMessage)

    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const lastPasswordChange = createAsyncThunk('auth/last-password-change', async (payload: any, thunkAPI) => {
  try {
    return await authService.lastPasswordChange(payload)
  } catch (error) {
    const errorMessage: string = 'Failed to update last password change of user'

    return thunkAPI.rejectWithValue(errorMessage)
  }
})
