//Third Party Imports
import { toast } from 'react-toastify'

//Helpers and Utils Imports
import { ProtectedAPI } from '@utils/apiInterceptor'
import { generateQueryParams } from '@utils/common'

//Constants Imports
import httpStatus from '@constants/httpStatus'

const fetchAllAppUsers = async (payload: Record<string, string | number | boolean | null | undefined>) => {
  const query = generateQueryParams(payload)
  const res = await ProtectedAPI.get(`/admin/app-user/list?${query}`)

  if (res.data.status === httpStatus.OK) {
    return res.data.data
  }
}

const fetchRecentStats = async () => {
  const res = await ProtectedAPI.get('/admin/app-user/recent-stats')

  if (res.data.status === httpStatus.OK) {
    return res.data.data
  }
}

const fetchBasicStats = async () => {
  const res = await ProtectedAPI.get('/admin/app-user/basic-stats')

  if (res.data.status === httpStatus.OK) {
    return res.data.data
  }
}

const editUser = async (payload: any) => {
  const { uid, data, onBtnClick } = payload

  const res = await ProtectedAPI.put(`/admin/app-user/update-info/${uid}`, data)

  if (res.data.status === httpStatus.OK) {
    onBtnClick()

    return toast.success('User detail updated')
  }
}

const updateStatus = async (payload: any) => {
  const { uid, data, closeModal } = payload

  const res = await ProtectedAPI.put(`/admin/app-user/update-status/${uid}`, data)

  if (res.data.status === httpStatus.OK) {
    closeModal()

    return toast.success(`User status updated successfully`)
  }
}

const resetPassword = async (payload: any) => {
  const { uid, data, onBtnClick } = payload

  const res = await ProtectedAPI.put(`/admin/app-user/reset-password/${uid}`, data)

  if (res.data.status === httpStatus.OK) {
    onBtnClick()

    return toast.success('Password reset successfully')
  }
}

const fetchUserInfo = async (payload: any) => {
  const { uid } = payload

  const res = await ProtectedAPI.get(`/admin/app-user/info/${uid}`)

  if (res.data.status === httpStatus.OK) {
    return res.data.data
  }
}

const fetchAssociatedPlunges = async (payload: any) => {
  const { userId, ...queryPayload } = payload

  const query = generateQueryParams(queryPayload)
  const res = await ProtectedAPI.get(`/admin/app-user/product-model/${userId}?${query}`)

  if (res.data.status === httpStatus.OK) {
    return res.data.data
  }
}

const fetchLoggedSessions = async (payload: any) => {
  const { userId, ...queryPayload } = payload
  const query = generateQueryParams(queryPayload)

  const res = await ProtectedAPI.get(`/admin/app-user/user-session/${userId}?${query}`)

  if (res.data.status === httpStatus.OK) {
    return res.data.data
  }
}

const fetchDeviceDetail = async (payload: any) => {
  const { deviceId } = payload

  const res = await ProtectedAPI.get(`/admin/app-user/device/${deviceId}`)

  if (res.data.status === httpStatus.OK) {
    return res.data.data
  }
}

const lastPasswordChange = async (payload: any) => {
  const { uid } = payload

  return await ProtectedAPI.put(`/admin/app-user/update-last-password-change/${uid}`)
}

const appUserManagementService = {
  fetchAllAppUsers,
  fetchRecentStats,
  fetchBasicStats,
  editUser,
  updateStatus,
  resetPassword,
  lastPasswordChange,
  fetchUserInfo,
  fetchAssociatedPlunges,
  fetchLoggedSessions,
  fetchDeviceDetail
}

export default appUserManagementService
