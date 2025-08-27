export interface Role {
  id: number
  name: string
  createdAt: string
}

export interface RoleState {
  allRoles: Role[]
  isAllRolesLoading: boolean

  //Role Detail Info
  roleInfo: Role | null
  isRoleInfoLoading: boolean

  //Add Role
  isAddRoleLoading: boolean
  isAddRoleSuccess: boolean

  //Edit Role
  isEditRoleLoading: boolean
  isEditRoleSuccess: boolean
}
