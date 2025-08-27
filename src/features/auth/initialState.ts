//Types Import
import type { AuthState } from '@custom-types/features/auth'

export const initialState: AuthState = {
  firebaseUser: {
    uid: null,
    accessToken: null,
    refreshToken: null
  },

  //Register
  isRegisterLoading: false,

  //Login
  isLoginLoading: false,

  //Forgot Password
  isForgotPassLoading: false,

  //Reset Password
  isResetPassLoading: false,
  isResetPassSuccess: false,

  //Logout Password
  isLogoutLoading: false,

  //Email Verification
  isEmailVerificationLoading: false
}
