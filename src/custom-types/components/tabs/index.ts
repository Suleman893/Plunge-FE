// React Imports
import type { ReactElement, ReactNode } from 'react'

export interface TabOption {
  id: number
  label: string
  value: string
  defaultIcon: ReactElement
  activeIcon: ReactElement
  iconPosition?: 'start' | 'end' | 'top' | 'bottom'
  disabled: boolean
}

export interface TabsViewProps {
  initialActive: string
  viewList: Record<string, ReactNode>
  options: TabOption[]
}
