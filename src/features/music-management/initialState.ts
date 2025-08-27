import type { MusicManagementState } from '@custom-types/features/musicManagement'

export const initialState: MusicManagementState = {
  allMusics: null,
  isAllMusicLoading: false,

  //Add Music
  isAddMusicLoading: false,
  isAddMusicSuccess: false,

  //All Playlist
  allPlayListLoading: false,
  allPlaylist: [],

  //All License Types
  allLicenseTypesLoading: false,
  allLicenseTypes: [],

  //Dashboard Stats
  isDashboardStatsLoading: false,
  dashboardStats: null,

  //Update User Status
  isMusicStatusUpdateLoading: false,
  isMusicStatusUpdateSuccess: false,

  //Delete Music
  isMusicDeleteLoading: false,
  isMusicDeleteSuccess: false,

  //Edit Music
  isEditMusicLoading: false,
  isEditMusicSuccess: false,

  //Mux Audio Meta
  isMuxAudioMetaLoading: false
}
