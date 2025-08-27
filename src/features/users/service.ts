//Third Party Imports
import { toast } from 'react-toastify'

//Utils Imports
import { ProtectedAPI } from '@utils/apiInterceptor'

//Constants Imports
import httpStatus from '@constants/httpStatus'

//Utils Imports
import { generateQueryParams } from '@utils/common'

const addUser = async (payload: any) => {
  const { data, onBtnClick } = payload

  const res = await ProtectedAPI.post('/admin/onboard', data)

  if (res.data.status === httpStatus.OK || res.data.status === httpStatus.CREATED) {
    onBtnClick()
    toast.success('Invitation email sent')
  }
}

//Check email expiry, then show the form for profile setup
const checkEmailExpiry = async (payload: any) => {
  const res = await ProtectedAPI.get(`/auth/admin/check-expiry/${payload}`)

  if (res.data.status === httpStatus.OK || res.data.status === httpStatus.CREATED) {
    return true
  }
}

const resendInvite = async (payload: any) => {
  const res = await ProtectedAPI.get(`auth/admin/resend-invite/${payload}`)

  if (res.data.status === httpStatus.OK) {
    return toast.success('Invite email resend successfully')
  }
}

const activateInvitedUser = async (payload: any) => {
  const { uid, router, data } = payload

  const res = await ProtectedAPI.put(`/auth/admin/activate/${uid}`, data)

  if (res.data.status === httpStatus.OK || res.data.status === httpStatus.CREATED) {
    toast.success('Profile activated successfully')
    router.push('/login')
  }
}

const fetchAllUsers = async (payload: Record<string, string | number | boolean | null | undefined>) => {
  const query = generateQueryParams(payload)
  const res = await ProtectedAPI.get(`/admin/list?${query}`)

  if (res.data.status === httpStatus.OK) {
    return res.data.data
  }
}

const updateStatus = async (payload: any) => {
  const { uid, data, closeModal } = payload

  const res = await ProtectedAPI.put(`/admin/update-status/${uid}`, data)

  if (res.data.status === httpStatus.OK) {
    closeModal()

    return toast.success(`User status updated successfully`)
  }
}

const deleteUser = async (payload: any) => {
  const { uid, closeModal } = payload

  const res = await ProtectedAPI.delete(`/admin/delete/${uid}`)

  if (res.data.status === httpStatus.OK) {
    closeModal()

    return toast.success(`User deleted successfully`)
  }
}

const editUserDetail = async (payload: any) => {
  const { uid, data, onBtnClick } = payload

  const res = await ProtectedAPI.put(`/admin/update-info/${uid}`, data)

  if (res.data.status === httpStatus.OK) {
    onBtnClick()

    return toast.success('User details updated')
  }
}

const resetPassword = async (payload: any) => {
  const { uid, data, onBtnClick } = payload

  const res = await ProtectedAPI.put(`/admin/reset-password/${uid}`, data)

  if (res.data.status === httpStatus.OK) {
    onBtnClick()

    return toast.success('Password reset successfully')
  }
}

const usersService = {
  addUser,
  checkEmailExpiry,
  resendInvite,
  activateInvitedUser,
  fetchAllUsers,
  updateStatus,
  deleteUser,
  editUserDetail,
  resetPassword
}

export default usersService
