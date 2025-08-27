'use client'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'

//Third Party Imports
import { useDispatch, useSelector } from 'react-redux'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

//Components Imports
import CustomTextField from '@core/components/mui/TextField'
import BorderButton from '@components/buttons/BorderButton'
import SelectRole from '@components/common/SelectRole'
import CustomButton from '@core/components/mui/Button'

//Types Imports
import type { AddNewUserProps } from '@custom-types/pages/settings/userSetting'

//Constants Imports
import { addUserDefault } from '@constants/formDefault/users'

//Schema Imports
import { addUserSchema, type AddUserFormValues } from '@schemas/users'

//Redux Imports
import { addUser } from '@features/users/thunk'
import type { RootState } from '@features/store'

const AddNewUser = (props: AddNewUserProps) => {
  const { onBtnClick } = props

  const dispatch = useDispatch()

  const { isAddUserLoading } = useSelector((state: RootState) => state.users)

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<AddUserFormValues>({
    resolver: zodResolver(addUserSchema),
    defaultValues: addUserDefault
  })

  const onSubmit = async (data: AddUserFormValues) => {
    const payloadData = {
      data,
      onBtnClick
    }

    dispatch(addUser(payloadData) as any)
  }

  return (
    <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
      <div className='flex flex-col items-center gap-6'>
        <div className='flex flex-col gap-5'>
          <Grid container spacing={5}>
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
                    label={
                      <>
                        Last Name <span className='text-textDisabled'>(optional)</span>
                      </>
                    }
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
            <Grid size={{ xs: 12 }}>
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
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Controller
                name='roleId'
                control={control}
                render={({ field, fieldState }) => (
                  <SelectRole
                    value={field.value}
                    onChange={field.onChange}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
          <Typography variant='body2' className='text-xs'>
            The user will receive an email invitation, where they can set their name and password
          </Typography>
        </div>
        <div className='flex gap-4'>
          <BorderButton handleClick={onBtnClick} text='Cancel' />
          <CustomButton type='submit' variant='contained' text='Add User' loading={isAddUserLoading} />
        </div>
      </div>
    </form>
  )
}

export default AddNewUser
