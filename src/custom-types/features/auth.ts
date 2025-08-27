export interface FirebaseUser {
  uid: string | null
  accessToken: string | null
  refreshToken: string | null
}

export interface AuthState {
  firebaseUser: FirebaseUser

  //Register
  isRegisterLoading: boolean

  //Login
  isLoginLoading: boolean

  //Forgot Password
  isForgotPassLoading: boolean

  //Reset Password
  isResetPassLoading: boolean
  isResetPassSuccess: boolean

  //Logout Password
  isLogoutLoading: boolean

  //Email Verification
  isEmailVerificationLoading: boolean
}
