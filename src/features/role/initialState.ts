//Types Import
import type { RoleState } from '@custom-types/features/role'

export const initialState: RoleState = {
  allRoles: [],
  isAllRolesLoading: false,

  //Role Detail Info
  roleInfo: null,
  isRoleInfoLoading: false,

  //Add Role
  isAddRoleSuccess: false,
  isAddRoleLoading: false,

  //Edit Role
  isEditRoleLoading: false,
  isEditRoleSuccess: false
}
