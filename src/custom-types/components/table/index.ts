// React Imports
import type { ReactNode } from 'react'

//Third Party Imports
import type { ColumnDef } from '@tanstack/react-table'

export interface TableProps<TData> {
  isLoading: boolean
  isPaginated?: boolean
  columns: ColumnDef<TData>[]
  filters: ReactNode
  data: TData[]
  totalElements?: number
  elementsPerPage?: number
  page?: number
  setPage?: (page: number) => void
  card?: any
}

export interface TablePaginationProps {
  totalElements: number
  elementsPerPage: number
  page: number
  setPage: (page: number) => void
}

export interface UploadProgressCellProps {
  type: 'music' | 'video' | 'setup-video' | 'pairing-video' | 'trouble-shoot-video'
  progressItem?: any
  uploadedItem?: any
  setProgress?: any
  resetProgress?: any
  label?: string
}
