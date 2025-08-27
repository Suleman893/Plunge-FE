export type PasswordMethod = 'default' | 'custom'

export interface AddNewRoleProps {
  itemData?: any
  isEdit?: boolean
  onBtnClick: () => void
}

export interface AddNewUserProps {
  onBtnClick: () => void
}

export interface ResetPasswordProps {
  itemData: any
  onBtnClick: () => void
}

export interface EditUserDetailProps {
  itemData: any
  onBtnClick: () => void
}

export interface EditProfileProps {
  onBtnClick: () => void
  itemData: any
}

export interface Module {
  id: number
  name: string
}

export interface AllModulesProps {
  allModules: Module[]
  selectedIds: number[]
  isLoading: boolean
  onToggleAll: () => void
  onToggleModule: (id: number) => void
  error?: string
}

export interface UserFiltersProps {
  page: number
  setPage: (page: number) => void
  filters: any
  setFilters: (arg: any) => void
}
