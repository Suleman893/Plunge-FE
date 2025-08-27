export interface UsersState {
  isAllUsersLoading: boolean
  allUsers: any

  //Invitation Screen (From email)
  isEmailExpiryLoading: boolean
  isEmailVerified: boolean
  isInviteLoading: boolean
  isActivateInvitedUserLoading: boolean
  isResendInviteLoading: boolean

  //Add User
  isAddUserLoading: boolean
  isAddUserSuccess: boolean

  //Update User Status
  isUserStatusUpdateLoading: boolean
  isUserStatusUpdateSuccess: boolean

  //Delete User
  isUserDeleteLoading: boolean
  isUserDeleteSuccess: boolean

  //Edit User Details
  isEditUserDetailLoading: boolean
  isEditUserDetailSuccess: boolean

  //Reset Password and Send Email
  isResetPasswordLoading: boolean
}
