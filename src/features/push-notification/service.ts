//Third Party Imports
import { toast } from 'react-toastify'

//Utils Imports
import { ProtectedAPI } from '@utils/apiInterceptor'
import { generateQueryParams } from '@utils/common'

//Constants Imports
import httpStatus from '@constants/httpStatus'

const createNotification = async (payload: any) => {
  const { data, handleClose, reset } = payload

  const res = await ProtectedAPI.post('/admin/notification/create', data)

  if (res.data.status === httpStatus.CREATED) {
    handleClose()
    reset()

    return toast.success('Notification created successfully')
  }
}

const fetchAllNotifications = async (payload: Record<string, string | number | boolean | null | undefined>) => {
  const query = generateQueryParams(payload)
  const res = await ProtectedAPI.get(`/admin/notification/list?${query}`)

  if (res.data.status === httpStatus.OK) {
    return res.data.data
  }
}

const deleteNotification = async (payload: any) => {
  const { id, closeModal } = payload

  const res = await ProtectedAPI.delete(`/admin/notification/delete/${id}`)

  if (res.data.status === httpStatus.OK) {
    closeModal()

    return toast.success(`Notification deleted successfully`)
  }
}

const editNotification = async (payload: any) => {
  const { id, data, handleClose, reset } = payload

  const res = await ProtectedAPI.put(`/admin/notification/update/${id}`, data)

  if (res.data.status === httpStatus.OK) {
    handleClose()
    reset && reset()

    return toast.success('Notification updated successfully')
  }
}

const notificationService = {
  createNotification,
  fetchAllNotifications,
  deleteNotification,
  editNotification
}

export default notificationService
