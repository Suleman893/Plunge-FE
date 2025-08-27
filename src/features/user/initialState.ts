//Types Import
import type { UserState } from '@custom-types/features/user'

export const initialState: UserState = {
  userInfo: {
    id: null,
    firstName: null,
    lastName: null,
    email: null,
    userType: null,
    role: null,
    photo: null,
    phone: null,
    country: null,
    state: null
  },

  isInfoLoading: false,

  isInfoSuccess: false,

  //Edit Profile
  isEditProfileLoading: false,

  //Change Password
  isChangePassLoading: false
}
