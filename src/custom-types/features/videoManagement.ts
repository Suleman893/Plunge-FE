export interface Video {
  id: number
  name: string
  videoInstructor: any
  thumbnail: string
  status: string
  video: string | null
  videoUploadId: string | null
  videoType: any
  lengthType: any
  mood: string
  preTimerDuration: string
  plungeDuration: string
  count: string | number
  isUsedInSession: boolean
}

export interface VideoManagementState {
  allVideos: any
  isAllVideoLoading: boolean

  //Videos Options
  allVideosOptions: any
  isAllVideosOptionsLoading: boolean

  //Add Video
  isAddVideoLoading: boolean
  isAddVideoSuccess: boolean

  //All Playlist
  allPlayListLoading: boolean
  allPlaylist: Array<{ id: number; name: string }>

  //All Instructor
  allInstructorLoading: boolean
  allInstructor: any

  //All License Types
  allVideoTypesLoading: boolean
  allVideoTypes: Array<{ id: number; name: string }>

  //Dashboard Stats
  isDashboardStatsLoading: boolean
  dashboardStats: any

  //Update Video Status
  isVideoStatusUpdateLoading: boolean
  isVideoStatusUpdateSuccess: boolean

  //Delete Video
  isVideoDeleteLoading: boolean
  isVideoDeleteSuccess: boolean

  //Edit Video
  isEditVideoLoading: boolean
  isEditVideoSuccess: boolean

  //Mux Video Meta
  isMuxVideoMetaLoading: boolean
}

export interface VideoProgressState {
  uploadProgressList: any
}
