//Third Party Imports
import { toast } from 'react-toastify'

//Utils Imports
import { ProtectedAPI } from '@utils/apiInterceptor'

//Constants Imports
import httpStatus from '@constants/httpStatus'

const addRole = async (payload: any) => {
  const { data, onBtnClick } = payload
  const res = await ProtectedAPI.post('/admin/role/create', data)

  if (res.data.status === httpStatus.OK) {
    onBtnClick()

    return toast.success('Role added successfully')
  }
}

const fetchRoles = async () => {
  const res = await ProtectedAPI.get('/admin/role/list')

  if (res.data.status === httpStatus.OK) {
    return res.data.data
  }
}

const fetchRoleInfo = async (payload: any) => {
  const { id } = payload
  const res = await ProtectedAPI.get(`/admin/role/info/${id}`)

  if (res.data.status === httpStatus.OK) {
    return res.data.data
  }
}

const editRole = async (payload: any) => {
  const { id, data, onBtnClick } = payload
  const res = await ProtectedAPI.put(`/admin/role/update/${id}`, data)

  if (res.data.status === httpStatus.OK) {
    onBtnClick()

    return toast.success('Role updated successfully')
  }
}

const roleService = {
  fetchRoleInfo,
  addRole,
  fetchRoles,
  editRole
}

export default roleService
