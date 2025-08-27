export interface Music {
  id: number
  name: string
  count: number | string
  artistName: string
  playlist: any
  licenseType: any
  thumbnail: string
  status: string
  audio: string | null
  audioUploadId: string | null
  isUsedInSession?: boolean
}

export interface MusicManagementState {
  allMusics: any
  isAllMusicLoading: boolean

  //Add Music
  isAddMusicLoading: boolean
  isAddMusicSuccess: boolean

  //Update User Status
  isMusicStatusUpdateLoading: boolean
  isMusicStatusUpdateSuccess: boolean

  //All Playlist
  allPlayListLoading: boolean
  allPlaylist: Array<{ id: number; name: string }>

  //All License Types
  allLicenseTypesLoading: boolean
  allLicenseTypes: Array<{ id: number; name: string }>

  //Dashboard Stats
  isDashboardStatsLoading: boolean
  dashboardStats: any

  //Delete Music
  isMusicDeleteLoading: boolean
  isMusicDeleteSuccess: boolean

  //Edit Music
  isEditMusicLoading: boolean
  isEditMusicSuccess: boolean

  //Mux Audio Meta
  isMuxAudioMetaLoading: boolean
}

export interface MusicProgressState {
  uploadProgressList: any
}
