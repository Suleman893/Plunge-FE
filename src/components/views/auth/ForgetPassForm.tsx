'use client'

//MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

//Third Party Imports
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDispatch, useSelector } from 'react-redux'

//Component Imports
import CustomTextField from '@core/components/mui/TextField'
import Link from '@components/Link'
import CustomButton from '@core/components/mui/Button'
import DirectionalIcon from '@components/DirectionalIcon'

//Schema and Type Import
import { forgotPassSchema, type ForgotPassFormValues } from '@schemas/auth'

//Constants Imports
import { forgotPassDefault } from '@constants/formDefault/auth'

//Redux Imports
import type { RootState } from '@features/store'
import { forgotPassword } from '@features/auth/thunk'

//Assets Imports
import AuthLogo from '@assets/svgs/AuthLogo'

const ForgotPassForm = () => {
  const dispatch = useDispatch()

  const { isForgotPassLoading } = useSelector((state: RootState) => state.auth)

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<ForgotPassFormValues>({
    resolver: zodResolver(forgotPassSchema),
    defaultValues: forgotPassDefault
  })

  const onSubmit = async (data: ForgotPassFormValues) => {
    dispatch(forgotPassword(data) as any)
  }

  return (
    <div className='flex justify-center items-center bs-full !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]'>
      <div className='flex flex-col gap-6 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] mbs-11 sm:mbs-14 md:mbs-0'>
        <div className='my-4'>
          <AuthLogo fill='#000' />
        </div>
        <div className='flex flex-col gap-1'>
          <Typography variant='h4'>Forgot Password 🔒</Typography>
          <Typography>Enter your email and we&#39;ll send you instructions to reset your password</Typography>
        </div>
        <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
          <Controller
            name='email'
            control={control}
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                label='Email Address'
                placeholder='Enter your email address'
                onChange={e => field.onChange(e.target.value)}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            )}
          />
          <CustomButton
            fullWidth
            variant='contained'
            type='submit'
            text='Send Reset Link'
            loading={isForgotPassLoading}
          />
          <Box className='flex justify-center items-center'>
            <Link href='/login' className='flex items-center gap-1.5'>
              <DirectionalIcon
                ltrIconClass='tabler-chevron-left'
                rtlIconClass='tabler-chevron-right'
                className='text-xl'
              />
              <span>Back to login</span>
            </Link>
          </Box>
        </form>
      </div>
    </div>
  )
}

export default ForgotPassForm
