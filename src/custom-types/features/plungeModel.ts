export interface PlungeModel {
  id: number
  thumbnail?: string
  name: string
  modelId: string
  tuyaProduct: any
  status?: string
  pairingVideoUploadId?: string | null
  setupVideoUploadId?: string | null
  troubleShootVideoUploadId?: string | null
  isUsedInSession: boolean
}

export interface PlungeModelState {
  allPlungeModels: any
  isAllPlungeModelLoading: boolean

  //Add Plunge
  isAddPlungeModelLoading: boolean

  //Update Status
  isPlungeStatusUpdateLoading: boolean
  isPlungeStatusUpdateSuccess: boolean

  //Delete
  isPlungeDeleteLoading: boolean
  isPlungeDeleteSuccess: boolean

  //Dashboard Stats
  isDashboardStatsLoading: boolean
  dashboardStats: any

  //Edit Plunge
  isEditPlungeModelLoading: boolean

  //Plunge Model Info
  plungeModelInfo: any

  //Mux Video Meta
  isMuxVideoMetaLoading: boolean
}

export interface PlungeModelProgressState {
  uploadProgressList: any
}
