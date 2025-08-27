//Helpers and Utils Imports
import { ProtectedAPI } from '@utils/apiInterceptor'

//Constants Imports
import httpStatus from '@constants/httpStatus'

const fetchRecentStats = async () => {
  const res = await ProtectedAPI.get('/admin/dashboard/recent-users-stats')

  if (res.data.status === httpStatus.OK) {
    return res.data.data
  }
}

const fetchBasicStats = async () => {
  const res = await ProtectedAPI.get('/admin/dashboard/basic-stats')

  if (res.data.status === httpStatus.OK) {
    return res.data.data
  }
}

const fetchPopularVideos = async () => {
  const res = await ProtectedAPI.get('/admin/dashboard/popular-videos')

  if (res.data.status === httpStatus.OK) {
    return res.data.data
  }
}

const dashboardService = {
  fetchRecentStats,
  fetchBasicStats,
  fetchPopularVideos
}

export default dashboardService
