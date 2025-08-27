export interface AppUser {
  id: number
  uid: number
  firstName: string
  lastName?: string | null
  email: string
  status: string
  createdAt: string
}

export interface AppUserManagementState {
  allAppUsers: any
  isAllAppUserLoading: boolean

  //Basic Stats
  isBasicStatsLoading: boolean
  basicStats: any

  //Recent Stats
  isRecentStatsLoading: boolean
  recentStats: any

  //Edit User
  isEditUserLoading: boolean
  isEditUserSuccess: boolean

  //Update User Status
  isAppUserStatusUpdateLoading: boolean
  isAppUserStatusUpdateSuccess: boolean

  //Reset Password and Send Email
  isResetPasswordLoading: boolean

  //App User Info
  appUserUID: any //To persist app user uid in local storage to fetch app user detail information
  appUserId: any //To persist app user uid in local storage to fetch app user detail information
  appUserInfo: any
  isFetchUserInfoLoading: boolean

  //Associated Plunges
  isAllAssociatedPlungesLoading: boolean
  allAssociatedPlunges: any

  //Logged Sessions
  isAllLoggedSessionLoading: boolean
  allLoggedSession: any

  //Tuya Device Detail
  isDeviceDetailLoading: boolean
  deviceDetail: any
}
