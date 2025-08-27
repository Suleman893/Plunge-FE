import type { AppUserManagementState } from '@custom-types/features/appUserManagement'

export const initialState: AppUserManagementState = {
  allAppUsers: null,
  isAllAppUserLoading: false,

  //Basic Stats
  isBasicStatsLoading: false,
  basicStats: null,

  //Recent Stats
  isRecentStatsLoading: false,
  recentStats: null,

  //Edit User Detail
  isEditUserLoading: false,
  isEditUserSuccess: false,

  //Update User Status
  isAppUserStatusUpdateLoading: false,
  isAppUserStatusUpdateSuccess: false,

  //Reset Password and Send Email
  isResetPasswordLoading: false,

  //App User Info
  appUserUID: null, //To persist app user uid in local storage to fetch app user detail information
  appUserId: null, //To persist app user user id in local storage to fetch app user detail information
  appUserInfo: {
    id: null,
    uid: null,
    firstName: '',
    lastName: '',
    email: '',
    status: '',
    createdAt: ''
  },
  isFetchUserInfoLoading: false,

  //Associated Plunges
  isAllAssociatedPlungesLoading: false,
  allAssociatedPlunges: null,

  //Associated Plunges
  isAllLoggedSessionLoading: false,
  allLoggedSession: null,

  //Tuya Device Detail
  isDeviceDetailLoading: false,
  deviceDetail: null
}
