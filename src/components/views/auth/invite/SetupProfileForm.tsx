'use client'

//MUI Imports
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'

//Third Party Imports
import { Controller } from 'react-hook-form'
import { useSelector } from 'react-redux'

//Component Imports
import CustomTextField from '@core/components/mui/TextField'
import CustomButton from '@core/components/mui/Button'

//Assets Imports
import AuthLogo from '@assets/svgs/AuthLogo'

//Types Imports
import type { SetupProfileFormProps } from '@custom-types/pages/auth'

//Redux Imports
import type { RootState } from '@features/store'

const SetupProfileForm = (props: SetupProfileFormProps) => {
  const { control, errors } = props

  const { isActivateInvitedUserLoading } = useSelector((state: RootState) => state.users)

  return (
    <div className='flex justify-center items-center bs-full !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]'>
      <div className='flex flex-col gap-6 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] mbs-11 sm:mbs-14 md:mbs-0'>
        <div className='my-2'>
          <AuthLogo fill='#000' />
        </div>
        <div className='flex flex-col gap-1'>
          <Typography variant='h4'>Set Up Your Profile 👋🏻</Typography>
          <Typography>Your new password must be different from previously used passwords</Typography>
        </div>
        <div className='flex flex-col gap-6'>
          <Grid container spacing={6}>
            <Grid size={{ xs: 12 }}>
              <Controller
                name='email'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    disabled={true}
                    fullWidth
                    label='Email Address'
                    placeholder='uxalyy@gmail.com'
                    onChange={e => {
                      field.onChange(e.target.value)
                    }}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='firstName'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='First Name'
                    placeholder='Enter your first name'
                    onChange={e => {
                      field.onChange(e.target.value)
                    }}
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='lastName'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Last Name'
                    placeholder='Enter your last name'
                    onChange={e => {
                      field.onChange(e.target.value)
                    }}
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
          <CustomButton fullWidth type='submit' text='Set Up Profile' loading={isActivateInvitedUserLoading} />
        </div>
      </div>
    </div>
  )
}

export default SetupProfileForm
