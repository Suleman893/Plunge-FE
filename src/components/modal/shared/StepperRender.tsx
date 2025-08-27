'use client'

//React Imports
import { useMemo } from 'react'

//MUI Imports
import { useTheme, styled } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import Step from '@mui/material/Step'
import MuiStepper from '@mui/material/Stepper'
import StepLabel from '@mui/material/StepLabel'
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector'
import type { StepperProps } from '@mui/material/Stepper'

//Component Imports
import StepperCustomDot from '@components/stepper-dot'

//Types Imports
import type { StepperRenderProps } from '@custom-types/components/modals'

//Styled Connector
const CustomStepConnector = styled(StepConnector)(() => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: '#3E6CFF29'
    }
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: '#3E6CFF29'
    }
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: '#3E6CFF29',
    borderRadius: 1
  }
}))

//Styled Stepper
const Stepper = styled(MuiStepper)<StepperProps>(({ theme }) => ({
  justifyContent: 'center',
  '& .MuiStep-root': {
    '&:first-of-type': {
      paddingInlineStart: 0
    },
    '&:last-of-type': {
      paddingInlineEnd: 0
    },
    [theme.breakpoints.down('md')]: {
      paddingInline: 0
    }
  }
}))

const StepperRender = (props: StepperRenderProps) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const orientation = useMemo(() => (isMobile ? 'vertical' : 'horizontal'), [isMobile])

  const { activeStep, steps = [] } = props

  return (
    <Stepper
      activeStep={activeStep}
      orientation={orientation}
      connector={!isMobile ? <CustomStepConnector /> : undefined}
    >
      {steps.map((step, index) => (
        <Step key={index}>
          <StepLabel
            sx={{
              '& .MuiStepLabel-label': {
                color: '#000',
                fontWeight: 400
              },
              '&.Mui-completed .MuiStepLabel-label': {
                color: '#000'
              },
              '&.Mui-active .MuiStepLabel-label': {
                color: '#000'
              }
            }}
            slots={{ stepIcon: StepperCustomDot }}
          >
            <div className='flex gap-2'>
              <p>{step.number}</p>
              <p>{step.title}</p>
            </div>
          </StepLabel>
        </Step>
      ))}
    </Stepper>
  )
}

export default StepperRender
