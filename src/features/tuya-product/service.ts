//Third Party Imports
import { toast } from 'react-toastify'

//Utils Imports
import { ProtectedAPI } from '@utils/apiInterceptor'
import { generateQueryParams } from '@utils/common'

//Constants Imports
import httpStatus from '@constants/httpStatus'

const fetchAllProducts = async (payload: any) => {
  const query = generateQueryParams(payload)

  const res = await ProtectedAPI.get(`/admin/tuya-product/list?${query}`)

  if (res.data.status === httpStatus.OK) {
    return res.data.data
  }
}

const syncProduct = async () => {
  const res = await ProtectedAPI.get('/admin/tuya-product/sync')

  if (res.data.status === httpStatus.OK) {
    return toast.success('Tuya products synced')
  }
}

const tuyaProduct = {
  fetchAllProducts,
  syncProduct
}

export default tuyaProduct
