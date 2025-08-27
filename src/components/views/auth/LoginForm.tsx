'use client'

// React Imports
import { useState, useEffect } from 'react'

// Next Imports
import { useRouter } from 'next/navigation'

//MUI Imports
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'

//Third Party Imports
import { useDispatch, useSelector } from 'react-redux'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import Link from '@components/Link'
import CustomButton from '@core/components/mui/Button'

//Schema Imports
import { loginSchema, type LoginFormValues } from '@schemas/auth'

//Constants Imports
import { loginDefault } from '@constants/formDefault/auth'

//Assets Imports
import AuthLogo from '@assets/svgs/AuthLogo'

//Redux Imports
import type { RootState } from '@features/store'
import { login } from '@features/auth/thunk'

const LoginForm = () => {
  const dispatch = useDispatch()
  const router = useRouter()

  const { isLoginLoading } = useSelector((state: RootState) => state.auth)

  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: loginDefault
  })

  //RememberMe
  useEffect(() => {
    const savedEmail = localStorage.getItem('email')
    const savedPassword = localStorage.getItem('password')

    if (savedEmail && savedPassword) {
      setRememberMe(true)
      setValue('email', JSON.parse(savedEmail))
      setValue('password', JSON.parse(savedPassword))
    }
  }, [])

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)
  const handleRememberMe = () => setRememberMe(!rememberMe)

  const onSubmit = async (data: LoginFormValues) => {
    if (rememberMe) {
      localStorage.setItem('email', JSON.stringify(data.email))
      localStorage.setItem('password', JSON.stringify(data.password))
    } else {
      localStorage.removeItem('email')
      localStorage.removeItem('password')
    }

    await dispatch(login({ data, router }) as any)
  }

  return (
    <div className='flex justify-center items-center bs-full !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]'>
      <div className='flex flex-col gap-6 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] mbs-11 sm:mbs-14 md:mbs-0'>
        <div className='my-4'>
          <AuthLogo fill='#000' />
        </div>
        <div className='flex flex-col gap-1'>
          <Typography variant='h4'>{`Welcome Back! 👋🏻`}</Typography>
          <Typography>Please sign-in to your account and start the adventure.</Typography>
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
                label='Email Address'
                placeholder='Enter your email address'
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
                id='outlined-adornment-password'
                type={isPasswordShown ? 'text' : 'password'}
                onChange={e => {
                  field.onChange(e.target.value)
                }}
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
          <div className='flex justify-between items-center gap-x-3 gap-y-1 flex-wrap'>
            <FormControlLabel
              control={<Checkbox checked={rememberMe} onChange={handleRememberMe} name='rememberMe' />}
              label='Remember Me'
              slotProps={{
                typography: { className: 'text-secondary' }
              }}
            />
            <Typography className='text-end' color='primary.main' component={Link} href='/forgot-password'>
              Forgot password?
            </Typography>
          </div>
          <CustomButton fullWidth variant='contained' type='submit' text='LOG IN' loading={isLoginLoading} />
        </form>
      </div>
    </div>
  )
}

export default LoginForm
