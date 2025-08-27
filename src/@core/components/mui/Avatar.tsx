'use client'

// React Imports
import { forwardRef } from 'react'

// MUI Imports
import MuiAvatar from '@mui/material/Avatar'
import { styled } from '@mui/material/styles'
import type { AvatarProps } from '@mui/material/Avatar'

export type CustomAvatarProps = AvatarProps & {
  color?: string
  skin?: 'filled' | 'light' | 'light-static'
  size?: number
}

const Avatar = styled(MuiAvatar)<CustomAvatarProps>(({ skin, color, size }) => {
  return {
    ...(color &&
      skin === 'light' && {
        backgroundColor: color,
        color: `var(--mui-palette-${color}-main)`
      }),
    ...(color &&
      skin === 'light-static' && {
        backgroundColor: color,
        color: `var(--mui-palette-${color}-main)`
      }),
    ...(color &&
      skin === 'filled' && {
        backgroundColor: color,
        color: `var(--mui-palette-${color}-contrastText)`
      }),
    ...(size && {
      height: size,
      width: size
    })
  }
})

const CustomAvatar = forwardRef<HTMLDivElement, CustomAvatarProps>((props: CustomAvatarProps, ref) => {
  // Props
  const { color, skin = 'filled', ...rest } = props

  return <Avatar color={color} skin={skin} ref={ref} {...rest} />
})

export default CustomAvatar
