//MUI Imports
import Button, { type ButtonProps } from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'

//Third-party Imports
import classnames from 'classnames'

interface CustomButtonProps extends Omit<ButtonProps, 'handleClick'> {
  text: string
  handleClick?: () => void
  loading?: boolean
  loaderSize?: number
  htmlFor?: string
  disabled?: boolean
}

const CustomButton = (props: CustomButtonProps) => {
  const {
    size = 'medium',
    variant = 'contained',
    color = 'primary',
    text,
    handleClick,
    loading = false,
    loaderSize = 23,
    disabled,
    children,
    ...rest
  } = props

  return (
    <Button
      variant={variant}
      color={color}
      size={size}
      onClick={handleClick}
      disabled={disabled || loading}
      {...rest}
      sx={{ position: 'relative' }}
    >
      <span className={classnames({ invisible: loading, visible: !loading })}>{text}</span>
      {/* {loading && <CircularProgress color='inherit' size={loaderSize} />} */}
      {loading && (
        <Box
          sx={{
            position: 'absolute',
            top: '55%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <CircularProgress color='inherit' size={loaderSize} />
        </Box>
      )}
      {children}
    </Button>
  )
}

export default CustomButton
