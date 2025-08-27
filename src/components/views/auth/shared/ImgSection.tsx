'use client'

//MUI Imports
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'

//Third Party Imports
import classnames from 'classnames'

// Component Imports
import Illustration from '@components/views/auth/shared/Illustration'
import MaskImg from '@components/views/auth/shared/Mask'

//Hooks Imports
import { useImageVariant } from '@core/hooks/useImageVariant'
import { useSettings } from '@core/hooks/useSettings'

const ImgSection = () => {
  const theme = useTheme()
  const { settings } = useSettings()

  // Vars
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const authBackground = useImageVariant('light', '/images/auth/mask.png', '/images/auth/mask.png')
  const IllustrationImg = useImageVariant('light', '/images/auth/auth.png', '/images/auth/auth.png')

  return (
    <div
      className={classnames(
        'flex bs-full items-center justify-center flex-1 min-bs-[100dvh] p-2 relative max-md:hidden',
        {
          'border-ie': settings.skin === 'bordered'
        }
      )}
    >
      <Illustration src={IllustrationImg} alt='auth' />
      {!hidden && (
        <MaskImg
          alt='mask'
          src={authBackground}
          className={classnames({ 'scale-x-[-1]': theme.direction === 'rtl' })}
        />
      )}
    </div>
  )
}

export default ImgSection
