export type AddEditPageParams = {
  mode: 'add' | 'edit'
}

export type AddEditPlungeSectionProps = {
  mode: 'add' | 'edit'
  loading?: boolean
  reset?: () => void
  disabled?: any
}

export interface AddEditPlungeModelProps {
  control?: any
  errors?: any
}

export interface PlungeModelFiltersProps {
  page: number
  setPage: (page: number) => void
  filters: any
  setFilters: (arg: any) => void
}
