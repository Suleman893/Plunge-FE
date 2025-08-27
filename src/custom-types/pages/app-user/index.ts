export type PasswordMethod = 'default' | 'custom'

export interface UserManagementFilterProps {
  page: number
  setPage: (page: number) => void
  filters: any
  setFilters: (arg: any) => void
}

export interface ResetPasswordProps {
  itemData: any
  onBtnClick: () => void
}

export interface SessionDetailsProps {
  itemData: any
}

export interface AssociatedPlungeFiltersProps {
  page: number
  setPage: (page: number) => void
  filters: any
  setFilters: (arg: any) => void
}

export interface UserSessionFiltersProps {
  page: number
  setPage: (page: number) => void
  filters: any
  setFilters: (arg: any) => void
}
