//React Imports
import type { ReactElement } from 'react'

//Third Party Imports
import type { SxProps, Theme } from '@mui/material/styles'

export interface CardContentWrapperProps {
  title: string
  content: ReactElement
  sx?: SxProps<Theme>
}

export interface BorderButtonProps {
  loading?: boolean
  handleClick?: () => void
  text: string
  disabled?: boolean
}

export interface CircleDotProps {
  filledColor: string
}

export interface SelectCountryProps {
  value: any
  onChange: (value: any | null) => void
  error?: boolean
  helperText?: string
}

export interface SelectRoleProps {
  value: any
  onChange: (value: any | null) => void
  error?: boolean
  helperText?: string
}

export interface SelectStateProps {
  countryCode: any
  value: any
  onChange: (value: any | null) => void
  error?: boolean
  helperText?: string
}

export interface SkeletonImgProps {
  src: string | undefined
  alt?: string
  width?: string | number
  height?: string | number
  className?: string
}
