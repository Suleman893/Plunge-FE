'use client'

//React Imports
import { useEffect } from 'react'

//MUI Imports
import Grid from '@mui/material/Grid2'
import InputAdornment from '@mui/material/InputAdornment'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider'

//Third Party Imports
import { Controller } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'

//Types Imports
import type { AddMusicDetailsProps } from '@custom-types/pages/music-management'

//Component Imports
import CustomTextField from '@core/components/mui/TextField'
import CustomAutocomplete from '@core/components/mui/Autocomplete'

//Redux Imports
import { fetchAllLicenseTypes, fetchAllPlaylist } from '@features/music-management/thunk'
import type { RootState } from '@features/store'

const AddMusicDetails = (props: AddMusicDetailsProps) => {
  const {
    control,
    errors,
    setSelectedForPreview,
    setMusicThumbnail,
    thumbnailError,
    setThumbnailError,
    thumbnailName,
    setThumbnailName,
    itemData
  } = props

  //Hook
  const dispatch = useDispatch()
  const { allPlaylist, allLicenseTypes } = useSelector((state: RootState) => state.musicManagement)

  //Fetch Playlist + License Types
  useEffect(() => {
    dispatch(fetchAllPlaylist() as any)
    dispatch(fetchAllLicenseTypes() as any)
  }, [])

  return (
    <form>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <Typography className='font-medium' color='text.primary'>
            Music Details
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name='name'
            control={control}
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                label='Music Title'
                placeholder='Enter Music Title'
                onChange={e => {
                  field.onChange(e.target.value)
                }}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name='artistName'
            control={control}
            render={({ field }) => (
              <CustomTextField
                {...field}
                disabled={itemData?.isUsedInSession}
                fullWidth
                label='Artist Name'
                placeholder='Enter Artist Name'
                onChange={e => {
                  field.onChange(e.target.value)
                }}
                error={!!errors.artistName}
                helperText={errors?.artistName?.message}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Controller
            name='playlistId'
            control={control}
            render={({ field }) => (
              <CustomAutocomplete
                disabled={itemData?.isUsedInSession}
                disableClearable={false}
                fullWidth
                id='select-playlist'
                options={allPlaylist || []}
                value={allPlaylist?.find((playlist: any) => playlist?.id === field.value) || null}
                onChange={(_, newValue) => {
                  field.onChange(newValue?.id || null)
                  setSelectedForPreview((prev: any) => ({
                    ...prev,
                    playlist: newValue?.name || ''
                  }))
                }}
                getOptionLabel={option => option?.name || ''}
                renderOption={(props, option) => (
                  <li {...props} key={option?.name}>
                    <span>{option?.name}</span>
                  </li>
                )}
                renderInput={params => (
                  <CustomTextField
                    {...params}
                    placeholder='Select Playlist'
                    label='Associated Playlist'
                    error={!!errors.playlistId}
                    helperText={errors.playlistId?.message}
                  />
                )}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <div className='flex items-center gap-4'>
            <CustomTextField
              label='Music Thumbnail '
              placeholder='No file chosen'
              value={thumbnailName}
              error={!!thumbnailError}
              helperText={thumbnailError || ' '}
              className='flex-auto'
              slotProps={{
                input: {
                  readOnly: true,
                  endAdornment: thumbnailName ? (
                    <InputAdornment position='end'>
                      <IconButton
                        size='small'
                        edge='end'
                        onClick={() => {
                          setMusicThumbnail(null)
                          setThumbnailName('')
                          setThumbnailError('')
                        }}
                      >
                        <i className='tabler-x' />
                      </IconButton>
                    </InputAdornment>
                  ) : null
                }
              }}
            />
            <Button component='label' variant='tonal' htmlFor='contained-button-file' className='min-is-fit'>
              Choose
              <input
                hidden
                id='contained-button-file'
                type='file'
                accept='image/png, image/jpeg, image/jpg, image/webp'
                onChange={e => {
                  const file = e.target.files?.[0]

                  if (file) {
                    setThumbnailName(file?.name)
                    setMusicThumbnail(file)
                    setThumbnailError('')
                  }
                }}
              />
            </Button>
          </div>
          <Divider sx={{ mt: '25px', mb: '3px' }} />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Controller
            name='licenseTypeId'
            control={control}
            render={({ field }) => (
              <CustomAutocomplete
                disableClearable={false}
                fullWidth
                id='select-license'
                options={allLicenseTypes || []}
                value={allLicenseTypes.find((license: any) => license?.id === field.value) || null}
                onChange={(_, newValue) => {
                  field.onChange(newValue?.id || null)
                  setSelectedForPreview((prev: any) => ({
                    ...prev,
                    licenseType: newValue?.name || ''
                  }))
                }}
                getOptionLabel={option => option?.name || ''}
                renderOption={(props, option) => (
                  <li {...props} key={option?.name}>
                    <span>{option?.name}</span>
                  </li>
                )}
                renderInput={params => (
                  <CustomTextField
                    {...params}
                    placeholder='Select Licence Type'
                    label='Select Licence Type'
                    error={!!errors.licenseTypeId}
                    helperText={errors.licenseTypeId?.message}
                  />
                )}
              />
            )}
          />
        </Grid>
      </Grid>
    </form>
  )
}

export default AddMusicDetails
