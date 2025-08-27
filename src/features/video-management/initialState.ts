import type { VideoManagementState } from '@custom-types/features/videoManagement'

export const initialState: VideoManagementState = {
  allVideos: null,
  isAllVideoLoading: false,

  //Videos Options
  allVideosOptions: null,
  isAllVideosOptionsLoading: false,

  //Add Video
  isAddVideoLoading: false,
  isAddVideoSuccess: false,

  //All Playlist
  allPlayListLoading: false,
  allPlaylist: [],

  //All Instructor
  allInstructorLoading: false,
  allInstructor: [],

  //All License Types
  allVideoTypesLoading: false,
  allVideoTypes: [],

  //Dashboard Stats
  isDashboardStatsLoading: false,
  dashboardStats: null,

  //Update Video Status
  isVideoStatusUpdateLoading: false,
  isVideoStatusUpdateSuccess: false,

  //Delete Video
  isVideoDeleteLoading: false,
  isVideoDeleteSuccess: false,

  //Edit Video
  isEditVideoLoading: false,
  isEditVideoSuccess: false,

  //Mux Video Meta
  isMuxVideoMetaLoading: false
}
