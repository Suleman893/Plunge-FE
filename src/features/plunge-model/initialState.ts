import type { PlungeModelState } from '@custom-types/features/plungeModel'

export const initialState: PlungeModelState = {
  allPlungeModels: null,
  isAllPlungeModelLoading: false,

  //Add Plunge
  isAddPlungeModelLoading: false,

  //Update Status
  isPlungeStatusUpdateLoading: false,
  isPlungeStatusUpdateSuccess: false,

  //Delete
  isPlungeDeleteLoading: false,
  isPlungeDeleteSuccess: false,

  //Dashboard Stats
  isDashboardStatsLoading: false,
  dashboardStats: null,

  //Edit Plunge
  isEditPlungeModelLoading: false,

  //Plunge Info
  plungeModelInfo: {
    tuyaId: null,
    name: '',
    modelId: '',
    thumbnail: '',
    pairingVideo: '',
    setupVideo: ''
  },

  //Mux Video Meta
  isMuxVideoMetaLoading: false
}
