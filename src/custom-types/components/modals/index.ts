// React Imports
import type { ReactNode, ReactElement } from 'react'

export interface StepItem {
  number: string
  title: string
}

export interface StepperRenderProps {
  activeStep: number
  steps: StepItem[]
}

export interface ModalProps {
  isCloseIcon?: boolean
  maxWidth?: 'sm' | 'md'
  scroll?: 'paper' | 'body'
  isTitleCenter?: boolean
  title: string
  description?: ReactNode
  open: boolean
  handleClose: () => void
  content: ReactElement
  isXPaddingDisabled?: boolean
}

export interface ModalConfig extends Omit<ModalProps, 'open' | 'handleClose'> {
  content: ReactElement
}

export interface ActionModalProps {
  actionType: ActionType
  onRightBtnClick: () => void
  onLeftBtnClick?: () => void
}

export interface ActionModalData {
  title: string
  description: ReactNode
  actionType: ActionType
}

export type ActionType = 'Delete' | 'Activate' | 'Disable' | 'Suspend' | 'Archive'
