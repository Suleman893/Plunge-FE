//Third party Imports
import { createSlice } from '@reduxjs/toolkit'

//Thunk Imports
import { register, verifyEmail, login, forgotPassword, resetPassword, logout } from '@features/auth/thunk'

//Initial State Import
import { initialState } from './initialState'

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // logout: () => initialState
    // setOAuth: (state, action) => {
    //   const { accessToken, refreshToken } = action.payload
    //   state.firebaseUser = { accessToken, refreshToken }
    // },
    renewAccessToken: (state, action) => {
      const { newAccessToken } = action.payload

      state.firebaseUser.accessToken = newAccessToken
    }
  },
  extraReducers: builder => {
    builder
      .addCase(register.pending, state => {
        state.isRegisterLoading = true
      })
      .addCase(register.fulfilled, state => {
        state.isRegisterLoading = false
      })
      .addCase(register.rejected, state => {
        state.isRegisterLoading = false
      })
      .addCase(login.pending, state => {
        state.isLoginLoading = true
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoginLoading = false

        if (action.payload) {
          state.firebaseUser = {
            uid: action.payload.uid,
            accessToken: action.payload.accessToken,
            refreshToken: action.payload.refreshToken
          }
        }
      })
      .addCase(login.rejected, state => {
        state.isLoginLoading = false
      })
      .addCase(verifyEmail.pending, state => {
        state.isEmailVerificationLoading = true
      })
      .addCase(verifyEmail.fulfilled, state => {
        state.isEmailVerificationLoading = false
      })
      .addCase(verifyEmail.rejected, state => {
        state.isEmailVerificationLoading = false
      })
      .addCase(forgotPassword.pending, state => {
        state.isForgotPassLoading = true
      })
      .addCase(forgotPassword.fulfilled, state => {
        state.isForgotPassLoading = false
      })
      .addCase(forgotPassword.rejected, state => {
        state.isForgotPassLoading = false
      })
      .addCase(resetPassword.pending, state => {
        state.isResetPassLoading = true
      })
      .addCase(resetPassword.fulfilled, state => {
        state.isResetPassLoading = false
        state.isResetPassSuccess = !state.isResetPassSuccess
      })
      .addCase(resetPassword.rejected, state => {
        state.isResetPassLoading = false
      })
      .addCase(logout.pending, state => {
        state.isLoginLoading = true
      })
      .addCase(logout.fulfilled, state => {
        state.isLoginLoading = false
        state.firebaseUser = {
          uid: null,
          accessToken: null,
          refreshToken: null
        }
      })
      .addCase(logout.rejected, state => {
        state.isLoginLoading = false
      })
  }
})

export const { renewAccessToken } = authSlice.actions
export default authSlice.reducer
