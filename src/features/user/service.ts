//Third Party Imports
import { toast } from 'react-toastify'
import { reauthenticateWithCredential, EmailAuthProvider, updatePassword } from 'firebase/auth'

//Utils Imports
import { ProtectedAPI } from '@utils/apiInterceptor'

//Constants Imports
import httpStatus from '@constants/httpStatus'

const loggedInUser = async (payload: any) => {
  const { uid } = payload
  const res = await ProtectedAPI.get(`/admin/info/${uid}`)

  if (res.data.status === httpStatus.OK) {
    return res.data.data
  }
}

const editProfile = async (payload: any) => {
  const { uid, data, onBtnClick } = payload

  const res = await ProtectedAPI.put(`/admin/update-info/${uid}`, data)

  if (res.data.status === httpStatus.OK) {
    onBtnClick()
    toast.success('Profile updated')

    return res.data.data
  }
}

const changePassword = async (payload: any) => {
  const { signedInUser, currentPassword, newPassword } = payload

  const credential = EmailAuthProvider.credential(signedInUser.email, currentPassword)

  await reauthenticateWithCredential(signedInUser, credential)
  await updatePassword(signedInUser, newPassword)

  const newIdToken = await signedInUser.getIdToken(true)

  toast.success('Password updated successfully')

  return newIdToken
}

const lastPasswordChange = async (payload: any) => {
  const { uid } = payload

  return await ProtectedAPI.put(`/admin/update-last-password-change/${uid}`)
}

const userService = {
  loggedInUser,
  editProfile,
  changePassword,
  lastPasswordChange
}

export default userService
