//Third Party Imports
import { toast } from 'react-toastify'
import axios from 'axios'
import type { UserCredential } from 'firebase/auth'
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  verifyPasswordResetCode,
  confirmPasswordReset,
  signOut,
  applyActionCode,
  createUserWithEmailAndPassword,
  sendEmailVerification
} from 'firebase/auth'

import { FirebaseError } from 'firebase/app'

//Utils and Constants Import
import { auth } from '@utils/firebaseConfig'
import { envConfig } from '@/configs/envConfig'

const register = async (payload: any) => {
  const { email, password } = payload

  const res = await createUserWithEmailAndPassword(auth, email, password)
  const user = res.user

  // Send verification email
  await sendEmailVerification(user)

  return toast.success('Email verification sent')
}

const verifyEmail = async (payload: any) => {
  const { oobCode } = payload

  await applyActionCode(auth, oobCode)

  return toast.success('User verified successfully')
}

const login = async (payload: any) => {
  const { data } = payload

  const { email, password } = data
  const res: UserCredential = await signInWithEmailAndPassword(auth, email, password)

  const accessToken = await res.user.getIdToken()

  const refreshToken = res.user.refreshToken

  //Manually handle not verified error, as firebase don't consider as error
  if (!res.user.emailVerified) {
    const error = new FirebaseError('auth/email-not-verified', 'Email not verified')

    throw error
  }

  if (res.user.uid && accessToken && refreshToken) {
    return {
      uid: res.user.uid,
      accessToken,
      refreshToken
    }
  }
}

const forgotPassword = async (payload: any) => {
  const { email } = payload

  await sendPasswordResetEmail(auth, email, {
    url: 'https://plunge-portal.ss1.septemsystems.com/auth?source=web',
    handleCodeInApp: false
  })

  return toast.success('Reset password email sent successfully')
}

const resetPassword = async (payload: any) => {
  const { payloadData } = payload

  const { password, oobCode } = payloadData

  const email = await verifyPasswordResetCode(auth, oobCode)

  await confirmPasswordReset(auth, oobCode, password)

  toast.success('Password reset successfully')

  return { success: true, email }
}

const logout = async () => {
  return await signOut(auth)
}

const lastPasswordChange = async (payload: any) => {
  const { email, source } = payload

  if (source === 'web') {
    return await axios.put(`${envConfig.API_URL}/auth/admin/update-last-password-change/${email}`)
  } else {
    return await axios.put(`${envConfig.API_URL}/auth/customer/update-last-password-change/${email}`)
  }
}

const authService = {
  register,
  verifyEmail,
  login,
  forgotPassword,
  resetPassword,
  logout,
  lastPasswordChange
}

export default authService
