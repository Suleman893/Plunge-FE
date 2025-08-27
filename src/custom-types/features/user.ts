export interface User {
  id: string | null
  uid?: string | null
  firstName: string | null
  lastName: string | null
  email: string | null
  userType: string | null
  role: string | null | any
  photo: string | null
  phone: string | null
  country: string | null
  state: string | null
  status?: string | null
  createdAt?: string | null
}

export interface UserState {
  userInfo: User
  isInfoLoading: boolean
  isInfoSuccess: boolean

  //Edit Profile
  isEditProfileLoading: boolean

  //Change Password
  isChangePassLoading: boolean
}
