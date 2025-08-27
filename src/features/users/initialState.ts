//Types Import
import type { UsersState } from '@custom-types/features/users'

export const initialState: UsersState = {
  isAllUsersLoading: false,
  allUsers: null,

  //Add User
  isAddUserLoading: false,
  isAddUserSuccess: false,

  //Invitation Screen (From email)
  isEmailExpiryLoading: false,
  isEmailVerified: false,
  isInviteLoading: false,
  isActivateInvitedUserLoading: false,
  isResendInviteLoading: false,

  //Update User Status
  isUserStatusUpdateLoading: false,
  isUserStatusUpdateSuccess: false,

  //Delete User
  isUserDeleteLoading: false,
  isUserDeleteSuccess: false,

  //Edit User Details
  isEditUserDetailLoading: false,
  isEditUserDetailSuccess: false,

  //Reset Password and Send Email
  isResetPasswordLoading: false
}
