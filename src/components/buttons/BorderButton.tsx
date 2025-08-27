//MUI Imports
import Button from '@mui/material/Button'
import { darken } from '@mui/material/styles'

//Types Imports
import type { BorderButtonProps } from '@custom-types/components/common'

const BorderButton = (props: BorderButtonProps) => {
  const { loading, text, handleClick, disabled } = props

  return (
    <Button
      disabled={loading || disabled}
      onClick={handleClick}
      variant='outlined'
      color='inherit'
      sx={theme => {
        const bg = theme.palette.customColors.secondaryBtnBgColor

        return {
          color: theme.palette.customColors.secondaryBtnColor,
          backgroundColor: bg,
          border: `1px solid ${theme.palette.customColors.secondaryBtnBorderColor}`,
          '&:hover': {
            backgroundColor: darken(bg, 0.1),
            borderColor: darken(theme.palette.customColors.secondaryBtnBorderColor, 0.1),
            color: theme.palette.customColors.secondaryBtnColor
          }
        }
      }}
    >
      {text}
    </Button>
  )
}

export default BorderButton
