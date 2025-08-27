export interface Module {
  id: number
  name: string
  createdAt: string
}

export interface ModuleState {
  allModules: Module[]
  isAllModulesLoading: boolean
}
