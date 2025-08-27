//React Imports
import React from 'react'

//MUI Imports
import { styled } from '@mui/material/styles'

//Types Imports
import type { CircleDotProps } from '@custom-types/components/common'

const CircleDot = (props: CircleDotProps) => {
  const { filledColor } = props

  const Dot = styled('div')({
    width: 25,
    height: 25,
    borderRadius: '50%',
    border: '1.5px solid #EEEEEE',
    backgroundColor: filledColor
  })

  return <Dot />
}

export default CircleDot
