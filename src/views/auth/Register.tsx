'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
// import Button from '@mui/material/Button'
// import CircularProgress from '@mui/material/CircularProgress'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'

//Third party
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDispatch, useSelector } from 'react-redux'

//Assets Import
import AuthLogo from '@assets/svgs/AuthLogo'

//Schema Imports
import { registerSchema, type RegisterFormValues } from '@schemas/auth'

//Component Imports
import Link from '@components/Link'
import CustomTextField from '@core/components/mui/TextField'
import CustomButton from '@core/components/mui/Button'

//Constants Import
import { registerDefault } from '@constants/formDefault/auth'

//Redux Imports
import { register } from '@features/auth/thunk'
import type { RootState } from '@features/store'

const Register = () => {
  const dispatch = useDispatch()

  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const { isRegisterLoading } = useSelector((state: RootState) => state.auth)

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: registerDefault
  })

  const onSubmit = async (data: RegisterFormValues) => {
    dispatch(register(data) as any)
  }

  return (
    <div className='flex flex-col justify-center items-center min-bs-[100dvh] p-6'>
      <Card className='flex flex-col md:w-1/2'>
        <CardContent className='sm:!p-12'>
          <div className='flex justify-center mb-4'>
            <AuthLogo fill='#000000' />
          </div>
          <div className='flex flex-col gap-1 mbe-6'>
            <Typography variant='h4'>Adventure starts here 🚀</Typography>
            <Typography>Make your app management easy and fun!</Typography>
          </div>
          <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
            <Controller
              name='email'
              control={control}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  type='email'
                  label='Email'
                  placeholder='Enter your email'
                  onChange={e => {
                    field.onChange(e.target.value)
                  }}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              )}
            />
            <Controller
              name='password'
              control={control}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='Password'
                  placeholder='············'
                  type={isPasswordShown ? 'text' : 'password'}
                  onChange={e => {
                    field.onChange(e.target.value)
                  }}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onClick={handleClickShowPassword}
                            onMouseDown={e => e.preventDefault()}
                          >
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

            {/* <Button fullWidth variant='contained' type='submit' disabled={isRegisterLoading}>
              {isRegisterLoading ? <CircularProgress color='inherit' size={23} /> : 'Register user'}
            </Button> */}
            <CustomButton
              size='small'
              fullWidth
              variant='contained'
              type='submit'
              text='Register user'
              loading={isRegisterLoading}
            />
            <div className='flex justify-center items-center flex-wrap gap-2'>
              <Typography>Already have an account?</Typography>
              <Typography color='primary.main' component={Link} href='/login'>
                Sign in instead
              </Typography>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default Register
