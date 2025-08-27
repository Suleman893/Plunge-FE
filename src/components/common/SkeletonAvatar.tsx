'use client'

//React Imports
import { forwardRef, useState, useEffect } from 'react'

//MUI Imports
import Avatar from '@mui/material/Avatar'
import Skeleton from 'react-loading-skeleton'
import { styled } from '@mui/material/styles'

//Types Imports
import type { AvatarProps } from '@mui/material/Avatar'

export type SkeletonAvatarProps = AvatarProps & {
  color?: string
  skin?: 'filled' | 'light' | 'light-static'
  size: number
}

const StyledAvatar = styled(Avatar)<SkeletonAvatarProps>(({ skin, color, size }) => ({
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
}))

const SkeletonAvatar = forwardRef<HTMLDivElement, SkeletonAvatarProps>((props, ref) => {
  const { color, skin = 'filled', src, size, ...rest } = props
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (!src) return setIsLoaded(true)

    const img = new Image()

    img.src = src

    if (img.complete) {
      setIsLoaded(true)
    } else {
      img.onload = () => setIsLoaded(true)
      img.onerror = () => setIsLoaded(true)
    }
  }, [src])

  if (!isLoaded) {
    return (
      <Avatar
        sx={{
          width: size,
          height: size,
          fontSize: size / 2.5,
          bgcolor: 'transparent',
          display: 'inline-flex'
        }}
      >
        <Skeleton circle width={size} height={size} />
      </Avatar>
    )
  }

  return (
    <StyledAvatar
      {...rest}
      ref={ref}
      src={src}
      color={color}
      skin={skin}
      size={size}
      slotProps={{
        img: {
          loading: 'lazy'
        }
      }}
    />
  )
})

export default SkeletonAvatar
