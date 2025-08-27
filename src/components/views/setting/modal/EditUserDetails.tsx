'use client'

//React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'

//Third Party Imports
import { useDispatch, useSelector } from 'react-redux'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import BorderButton from '@components/buttons/BorderButton'
import CustomButton from '@core/components/mui/Button'
import SelectCountry from '@components/common/SelectCountry'
import SelectRole from '@components/common/SelectRole'
import CustomAvatar from '@core/components/mui/Avatar'
import SelectState from '@components/common/SelectState'

//Types Imports
import type { EditUserDetailProps } from '@custom-types/pages/settings/userSetting'

//Schema Imports
import { editUserDetailSchema, type EditUserDetailFormValues } from '@schemas/users'

//Data Imports
import countries from '@data/common/countries'

//Redux Imports
import { editUserDetail } from '@features/users/thunk'
import type { RootState } from '@features/store'

//Constants Imports
import { USER_PIC_MAX_SIZE, USER_PIC_TYPE } from '@constants/common'

const EditUserDetails = (props: EditUserDetailProps) => {
  const { onBtnClick, itemData } = props

  //Redux
  const dispatch = useDispatch()
  const { isEditUserDetailLoading } = useSelector((state: RootState) => state.users)

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isDirty }
  } = useForm<EditUserDetailFormValues>({
    resolver: zodResolver(editUserDetailSchema),
    defaultValues: {
      firstName: itemData?.firstName,
      lastName: itemData?.lastName || '',
      photo: itemData?.photo || null,
      phone: itemData?.phone || '',
      country: itemData?.country || '',
      state: itemData?.state || '',
      roleId: itemData?.role?.id || null
    }
  })

  //States
  const [imagePreview, setImagePreview] = useState<string | null>(getValues('photo'))
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [countryCode, setCountryCode] = useState<string | null>(null)

  useEffect(() => {
    if (itemData?.country) {
      const matchedCountry = countries.find(c => c?.name === itemData?.country)

      if (matchedCountry) {
        setCountryCode(matchedCountry.code)
      }
    }
  }, [itemData?.country])

  const onSubmit = async (data: EditUserDetailFormValues) => {
    const payloadData = {
      uid: itemData?.uid,
      itemData,
      data,
      onBtnClick,
      selectedFile
    }

    dispatch(editUserDetail(payloadData) as any)
  }

  const handleResetPhoto = () => {
    setSelectedFile(null)
    setImagePreview('')
    setValue('photo', null, { shouldDirty: true })
  }

  const handleUploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (!file) return

    const isValidType = USER_PIC_TYPE.includes(file.type)
    const isFileSizeExceed = file.size >= USER_PIC_MAX_SIZE

    if (isFileSizeExceed) {
      return toast.info('Max 2MB file allowed')
    }

    if (!isValidType) {
      return toast.info('Only PNG and JPG file allowed')
    }

    setSelectedFile(file)
    setImagePreview(URL.createObjectURL(file))
    setValue('photo', null, { shouldDirty: true })
  }

  return (
    <>
      <div className='flex max-sm:flex-col items-center gap-6'>
        <CustomAvatar variant='rounded' alt='' src={imagePreview || undefined} size={80} />
        <div className='flex flex-grow flex-col gap-4'>
          <div className='flex flex-col sm:flex-row gap-4'>
            <CustomButton
              component='label'
              variant='tonal'
              text='Upload Picture'
              htmlFor='account-settings-upload-image'
            >
              <input
                hidden
                type='file'
                accept='image/png, image/jpeg'
                id='account-settings-upload-image'
                onChange={handleUploadPhoto}
              />
            </CustomButton>
            <BorderButton text='Reset' handleClick={handleResetPhoto} />
          </div>
          <Typography className='text-sm text-textDisabled'>Allowed JPG or PNG. Max size of 2MB</Typography>
        </div>
      </div>
      <div className='mt-5'>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete='off' noValidate>
          <Grid container spacing={6}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='firstName'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='First Name'
                    placeholder='First name'
                    onChange={field.onChange}
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
                    placeholder='Last Name'
                    onChange={field.onChange}
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField value={itemData?.email} disabled={true} fullWidth type='email' label='Email' />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='phone'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Phone Number'
                    placeholder='+1 (234) 567-8901'
                    onChange={field.onChange}
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='country'
                control={control}
                render={({ field, fieldState }) => (
                  <SelectCountry
                    value={countries.find(option => option.name === field.value) || null}
                    onChange={selected => {
                      field.onChange(selected?.name ?? '')
                      setCountryCode(selected?.code)
                    }}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='state'
                control={control}
                render={({ field, fieldState }) => (
                  <SelectState
                    countryCode={countryCode}
                    value={field.value}
                    onChange={field.onChange}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
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

            <Grid size={{ xs: 12 }} className='flex gap-4 flex-wrap justify-end'>
              <BorderButton
                text='Cancel'
                handleClick={() => {
                  onBtnClick()
                }}
              />
              <CustomButton
                text='Save Changes'
                type='submit'
                disabled={!(isDirty || selectedFile)}
                loading={isEditUserDetailLoading}
              />
            </Grid>
          </Grid>
        </form>
      </div>
    </>
  )
}

export default EditUserDetails
