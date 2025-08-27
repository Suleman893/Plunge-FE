'use client'

//React Imports
import { useState, useRef, useEffect } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'

//Third Party Imports
import { useDispatch, useSelector } from 'react-redux'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify'

// Component Imports
import SelectCountry from '@components/common/SelectCountry'
import CustomTextField from '@core/components/mui/TextField'
import BorderButton from '@components/buttons/BorderButton'
import CustomButton from '@core/components/mui/Button'
import CustomAvatar from '@core/components/mui/Avatar'
import SelectState from '@components/common/SelectState'

//Types Import
import type { EditProfileProps } from '@custom-types/pages/settings/userSetting'

//Data Imports
import countries from '@data/common/countries'

//Redux Imports
import type { RootState } from '@features/store'
import { editProfile } from '@features/user/thunk'

//Schema Imports
import { editProfileSchema, type EditProfileFormValues } from '@schemas/user'

//Constants Imports
import { USER_PIC_MAX_SIZE, USER_PIC_TYPE } from '@constants/common'

const EditProfile = (props: EditProfileProps) => {
  const { onBtnClick, itemData } = props

  //Redux
  const dispatch = useDispatch()
  const { firebaseUser } = useSelector((state: RootState) => state.auth)
  const { isEditProfileLoading } = useSelector((state: RootState) => state.user)

  //Default Form Values
  const defaultValues: EditProfileFormValues = {
    firstName: itemData?.firstName,
    lastName: itemData?.lastName || '',
    photo: itemData?.photo,
    phone: itemData?.phone || '',
    country: itemData?.country || '',
    state: itemData?.state || ''
  }

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    getValues
  } = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues
  })

  //Ref
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  //States
  const [imagePreview, setImagePreview] = useState(getValues('photo'))
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

  const onSubmit = async (data: EditProfileFormValues) => {
    const payloadData = {
      uid: firebaseUser.uid,
      itemData,
      data,
      onBtnClick,
      selectedFile
    }

    dispatch(editProfile(payloadData) as any)
  }

  const handleResetPhoto = () => {
    setSelectedFile(null)
    setImagePreview('')
    setValue('photo', null, { shouldDirty: true })

    // Reset the file input so selecting the same file again triggers onChange
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
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
        <CustomAvatar variant='rounded' alt='user' src={imagePreview || undefined} size={80} />
        <div className='flex flex-grow flex-col gap-4'>
          <div className='flex flex-col sm:flex-row gap-4'>
            <CustomButton
              component='label'
              variant='tonal'
              text='Upload Picture'
              htmlFor='account-settings-upload-image'
            >
              <input
                ref={fileInputRef}
                hidden
                type='file'
                accept='image/png, image/jpeg'
                id='account-settings-upload-image'
                onChange={handleUploadPhoto}
              />
            </CustomButton>
            <BorderButton text='Reset' handleClick={handleResetPhoto} disabled={imagePreview ? false : true} />
          </div>
          <Typography className='text-sm text-textDisabled'>Allowed JPG or PNG. Max size of 2MB</Typography>
        </div>
      </div>
      <form
        noValidate
        autoComplete='off'
        onSubmit={handleSubmit(onSubmit)}
        className='flex flex-col gap-6 mt-5 items-end'
      >
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
          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomTextField value={itemData?.email} disabled={true} fullWidth type='email' label='Email Address' />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name='phone'
              control={control}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='Phone'
                  placeholder='Enter your phone number'
                  onChange={e => {
                    field.onChange(e.target.value)
                  }}
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
        </Grid>

        <div className='flex gap-4'>
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
            loading={isEditProfileLoading}
          />
        </div>
      </form>
    </>
  )
}

export default EditProfile
