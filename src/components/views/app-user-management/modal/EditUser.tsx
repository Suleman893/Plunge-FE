'use client'

//React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'

//Third Party Imports
import { Controller, useForm } from 'react-hook-form'
import dayjs from 'dayjs'
import { useDispatch, useSelector } from 'react-redux'
import { zodResolver } from '@hookform/resolvers/zod'

//Component Imports
import CustomTextField from '@core/components/mui/TextField'
import BorderButton from '@components/buttons/BorderButton'
import CustomButton from '@core/components/mui/Button'
import CustomAvatar from '@core/components/mui/Avatar'
import CustomAutocomplete from '@core/components/mui/Autocomplete'
import CustomDatePicker from '@core/components/mui/DatePicker'

//Types Imports
import type { EditUserDetailProps } from '@custom-types/pages/settings/userSetting'

//Redux Imports
import type { RootState } from '@features/store'
import { editUser } from '@features/app-user/thunk'

//Schema Imports
import type { EditUserFormValues } from '@schemas/appUserManagement'
import { editUserSchema } from '@schemas/appUserManagement'

//Utils Imports
import { getFullName } from '@utils/common'

//Static Data Imports
import { genderOptions } from '@data/app-user-management'

const EditUser = (props: EditUserDetailProps) => {
  const { onBtnClick, itemData } = props

  //Hooks Imports
  const dispatch = useDispatch()

  const { isEditUserLoading } = useSelector((state: RootState) => state.appUserManagement)

  //States Imports
  const [imagePreview, setImagePreview] = useState<string>('')

  useEffect(() => {
    setImagePreview(itemData?.photo || undefined)
  }, [itemData?.id])

  //Form Hook
  const {
    control,
    formState: { errors, isDirty },
    handleSubmit,
    setValue
  } = useForm<EditUserFormValues>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      photo: itemData?.photo || null,
      dob: itemData?.dob || '',
      gender: itemData?.gender || ''
    }
  })

  const onSubmit = async (data: EditUserFormValues) => {
    const payloadData = {
      uid: itemData?.uid,
      itemData,
      data,
      onBtnClick
    }

    dispatch(editUser(payloadData) as any)
  }

  //Handle Reset Photo
  const handleResetPhoto = () => {
    setImagePreview('')
    setValue('photo', null, { shouldDirty: true })
  }

  return (
    <>
      <div className='flex max-sm:flex-col items-center gap-6'>
        <CustomAvatar variant='rounded' alt='user' size={80} src={imagePreview} />
        <div className='flex flex-grow flex-col gap-4'>
          <div className='flex flex-col sm:flex-row gap-4'>
            <BorderButton text='Reset Picture' disabled={!itemData?.photo} handleClick={handleResetPhoto} />
          </div>
          <Typography className='text-sm text-textDisabled'>Allowed JPG or PNG. Max size of 2MB</Typography>
        </div>
      </div>
      <div className='mt-5'>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete='off' noValidate>
          <Grid container spacing={6}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                disabled={true}
                fullWidth
                label='Full Name'
                value={getFullName(itemData?.firstName, itemData?.lastName)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField disabled={true} fullWidth label='Email Address' value={itemData?.email} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='dob'
                control={control}
                render={({ field }) => (
                  <CustomDatePicker
                    {...field}
                    label='Date of Birth'
                    format='DD-MM-YYYY'
                    maxDate={dayjs().subtract(1, 'day')}
                    onChange={date => {
                      field.onChange(dayjs(date).format('YYYY-MM-DD'))
                    }}
                    disablePast={false}
                    value={dayjs(field.value).isValid() ? dayjs(field.value) : null}
                    error={!!errors.dob}
                    helperText={errors.dob?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='gender'
                control={control}
                render={({ field }) => {
                  const selectedOption = genderOptions.find(option => option.value === field.value) || null

                  return (
                    <CustomAutocomplete
                      className='mt-1'
                      {...field}
                      value={selectedOption}
                      disableClearable={false}
                      fullWidth
                      id='select-sex-type'
                      options={genderOptions}
                      onChange={(_, newValue) => {
                        field.onChange(newValue?.value || '')
                      }}
                      renderInput={params => (
                        <CustomTextField
                          {...params}
                          placeholder='Select Sex'
                          label='Sex'
                          error={!!errors.gender}
                          helperText={errors.gender?.message || ' '}
                        />
                      )}
                    />
                  )
                }}
              />
            </Grid>

            <Grid size={{ xs: 12 }} className='flex gap-4 flex-wrap justify-end'>
              <BorderButton
                text='Cancel'
                handleClick={() => {
                  onBtnClick()
                }}
              />
              <CustomButton type='submit' text='Save Changes' disabled={!isDirty} loading={isEditUserLoading} />
            </Grid>
          </Grid>
        </form>
      </div>
    </>
  )
}

export default EditUser
