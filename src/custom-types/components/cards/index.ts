//React Imports
import type { ReactElement } from 'react'

export interface BasicInfoProps {
  title: string
  stats: string | number
  avatarIcon: ReactElement
  avatarColor?: string
  bgColor?: string | null
  boxShadow?: string
  border?: string
  isLoading?: boolean
  height?: string
}

export interface RoleInfoProps {
  data: any
  loading?: boolean
}

export interface SectionInfoProps {
  title: string
  description?: string
}

export interface MonthlyReportProps {
  data?: any
  isLoading?: boolean
}
