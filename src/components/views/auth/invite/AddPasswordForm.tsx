'use client'

//React Imports
import { useState } from 'react'

//MUI Imports
import Typography from '@mui/material/Typography'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'

//Third Party Imports
import { Controller } from 'react-hook-form'

//Component Imports
import CustomTextField from '@core/components/mui/TextField'
import CustomButton from '@core/components/mui/Button'

//Assets Imports
import AuthLogo from '@assets/svgs/AuthLogo'
import Info from '@assets/svgs/Info'

//Types Imports
import type { AddPasswordFormProps } from '@custom-types/pages/auth'

const AddPasswordForm = (props: AddPasswordFormProps) => {
  const { control, errors, onNext } = props

  // Password Icons States
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false)

  // Password Icons Handlers
  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const handleClickShowConfirmPassword = () => setIsConfirmPasswordShown(show => !show)

  return (
    <div className='flex justify-center items-center bs-full !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]'>
      <div className='flex flex-col gap-6 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] mbs-11 sm:mbs-14 md:mbs-0'>
        <div className='my-2'>
          <AuthLogo fill='#000' />
        </div>
        <div className='bg-[#E8EDFF] border border-[#3E6CFF3D] rounded-[10px] py-4 px-3'>
          <div className='flex gap-2 items-start'>
            <Info />
            <p className='text-[14px]'>
              <span className='font-bold'>{`Brian O'Neill `}</span>has invited you to join Primal Plunges
            </p>
          </div>
        </div>
        <div className='flex flex-col gap-1'>
          <Typography variant='h4'>Create Password 🔑</Typography>
          <Typography>Your new password must be different from previously used passwords</Typography>
        </div>
        <div className='flex flex-col gap-6'>
          <Controller
            name='password'
            control={control}
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                label='Create New Password'
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
                label='Confirm New Password'
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
          <CustomButton fullWidth type='button' text='Set Password' onClick={onNext} />
        </div>
      </div>
    </div>
  )
}

export default AddPasswordForm
