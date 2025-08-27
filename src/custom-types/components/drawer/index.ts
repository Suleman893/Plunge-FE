//React Imports
import type { ReactElement } from 'react'

export interface DrawerHeaderProps {
  title: string
  handleClose: () => void
}

export interface SideDrawerProps {
  title: string
  open: boolean
  handleClose: () => void
  form: ReactElement
}
