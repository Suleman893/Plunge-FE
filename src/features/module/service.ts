//Utils Imports
import { ProtectedAPI } from '@utils/apiInterceptor'

//Constants Imports
import httpStatus from '@constants/httpStatus'

const fetchAllModules = async () => {
  const res = await ProtectedAPI.get('/admin/system-module/list')

  if (res.data.status === httpStatus.OK) {
    return res.data.data
  }
}

const moduleService = {
  fetchAllModules
}

export default moduleService
