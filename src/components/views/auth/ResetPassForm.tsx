'use client'

//React Imports
import { useState } from 'react'

//Next Imports
import { useSearchParams } from 'next/navigation'

//MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import Alert from '@mui/material/Alert'

//Third Party Imports
import { useDispatch, useSelector } from 'react-redux'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

//Component Imports
import CustomTextField from '@core/components/mui/TextField'
import DirectionalIcon from '@components/DirectionalIcon'
import Link from '@components/Link'
import CustomButton from '@core/components/mui/Button'

//Schema Imports
import { resetPassSchema, type ResetPassFormValues } from '@schemas/auth'

// Constants Imports
import { resetPassDefault } from '@constants/formDefault/auth'

//Assets Imports
import AuthLogo from '@assets/svgs/AuthLogo'

//Redux Imports
import type { RootState } from '@features/store'
import { resetPassword, lastPasswordChange } from '@features/auth/thunk'

//Types Import
import type { ResetPassFormProps } from '@custom-types/pages/auth'

const ResetPassForm = (props: ResetPassFormProps) => {
  const { oobCode } = props

  const searchParams = useSearchParams()
  const dispatch = useDispatch()

  const rawContinueUrl = searchParams.get('continueUrl')

  let source: string | null = null

  if (rawContinueUrl) {
    try {
      const decoded = decodeURIComponent(rawContinueUrl)
      const nestedParams = new URL(decoded).searchParams

      source = nestedParams.get('source')
    } catch (e) {
      console.error('Invalid continueUrl:', e)
    }
  }

  const { isResetPassLoading, isResetPassSuccess } = useSelector((state: RootState) => state.auth)

  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false)

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const handleClickShowConfirmPassword = () => setIsConfirmPasswordShown(show => !show)

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<ResetPassFormValues>({
    resolver: zodResolver(resetPassSchema),
    defaultValues: resetPassDefault
  })

  const onSubmit = async (data: ResetPassFormValues) => {
    const payloadData = {
      password: data.password,
      oobCode
    }

    const res = await dispatch(resetPassword({ payloadData }) as any)

    if (res?.meta?.requestStatus === 'fulfilled') {
      const email = res?.payload?.email

      if (email) {
        dispatch(
          lastPasswordChange({
            email,
            source
          }) as any
        )
      }
    }
  }

  return (
    <div className='flex justify-center items-center bs-full !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]'>
      <div className='flex flex-col gap-6 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] mbs-11 sm:mbs-14 md:mbs-0'>
        <div className='my-4'>
          <AuthLogo fill='#000' />
        </div>
        <div className='flex flex-col gap-1'>
          <Typography variant='h4'>Reset Password 🔒</Typography>
          <Typography>Your new password must be different from previously used passwords</Typography>
        </div>
        <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
          <Controller
            name='password'
            control={control}
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                label='New Password'
                placeholder='············'
                id='outlined-adornment-password'
                type={isPasswordShown ? 'text' : 'password'}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton edge='end' onClick={handleClickShowPassword} onMouseDown={e => e.preventDefault()}>
                          <i className={isPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }
                }}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            )}
          />
          <Controller
            name='confirmPassword'
            control={control}
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                label='Confirm Password'
                placeholder='············'
                id='outlined-adornment-confirm-password'
                type={isConfirmPasswordShown ? 'text' : 'password'}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          edge='end'
                          onClick={handleClickShowConfirmPassword}
                          onMouseDown={e => e.preventDefault()}
                        >
                          <i className={isConfirmPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }
                }}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
              />
            )}
          />
          <CustomButton
            fullWidth
            type='submit'
            disabled={!oobCode || isResetPassLoading}
            text='Update Password'
            loading={isResetPassLoading}
          />
          {source === 'web' && (
            <Box className='flex justify-center items-center'>
              <Link href='/login' className='flex items-center gap-1.5'>
                <DirectionalIcon
                  ltrIconClass='tabler-chevron-left'
                  rtlIconClass='tabler-chevron-right'
                  className='text-xl '
                />
                <span>Back to login</span>
              </Link>
            </Box>
          )}
          {isResetPassSuccess && source === 'app' && (
            <Box className='flex justify-center items-center'>
              <Alert severity='success'>
                Your password has been reset successfully. Please log in using the mobile app with your new password.
              </Alert>
            </Box>
          )}
        </form>
      </div>
    </div>
  )
}

export default ResetPassForm
