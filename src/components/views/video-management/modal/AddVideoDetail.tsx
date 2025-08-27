'use client'

//React Imports
import { useEffect } from 'react'

//Third-Party Imports
import { Controller } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import dayjs from 'dayjs'

//MUI Imports
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'

//Component Imports
import CustomTextField from '@core/components/mui/TextField'
import CustomAutocomplete from '@core/components/mui/Autocomplete'
import CustomDateTimePicker from '@core/components/mui/DateTimePicker'

//Redux Imports
import { fetchAllVideoTypes, fetchAllPlaylist, fetchAllInstructor } from '@features/video-management/thunk'
import type { RootState } from '@features/store'

//Types Imports
import type { AddVideoDetailsProps } from '@custom-types/pages/video-management'

//Data Imports
import { allLengthTypes, allMoods } from '@data/video-management'

//Utilities and Helpers Imports
import { getLengthTypeFromDuration, hhmmssToSeconds, snakeToPascalConverter } from '@helpers/common'

const AddVideoDetails = (props: AddVideoDetailsProps) => {
  const {
    control,
    errors,
    isEdit,
    itemData,
    selectedForPreview,
    setSelectedForPreview,
    setVideoThumbnail,
    thumbnailError,
    setThumbnailError,
    thumbnailName,
    setThumbnailName,
    setValue
  } = props

  //Hook
  const dispatch = useDispatch()
  const { allPlaylist, allVideoTypes, allInstructor } = useSelector((state: RootState) => state.videoManagement)

  //Fetch Playlist + Video Types
  useEffect(() => {
    dispatch(fetchAllInstructor() as any)
    dispatch(fetchAllPlaylist() as any)
    dispatch(fetchAllVideoTypes() as any)
  }, [])

  //Edit
  useEffect(() => {
    if (!selectedForPreview?.playlist) {
      const alreadySelectedPlaylist = allPlaylist.find((itm: any) => itm?.id == itemData?.playlist?.id)

      setSelectedForPreview((prev: any) => ({
        ...prev,
        playlist: alreadySelectedPlaylist?.name
      }))
    }

    if (!selectedForPreview?.videoType) {
      const alreadySelectedVideo = allVideoTypes.find((itm: any) => itm?.id == itemData?.videoType?.id)

      setSelectedForPreview((prev: any) => {
        return {
          ...prev,
          videoType: alreadySelectedVideo?.name
        }
      })
    }
  }, [isEdit, allPlaylist, allVideoTypes])

  return (
    <form>
      <Grid container rowSpacing={5} columnSpacing={5}>
        <Grid size={{ xs: 12 }}>
          <Typography className='font-medium' color='text.primary'>
            Video Details
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
                label='Title'
                placeholder='Enter Video Title'
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
            name='videoInstructorId'
            control={control}
            render={({ field }) => (
              <CustomAutocomplete
                disabled={itemData?.isUsedInSession}
                disableClearable={false}
                fullWidth
                id='select-instructor'
                options={allInstructor || []}
                value={allInstructor?.find((instructor: any) => instructor?.id === field.value) || null}
                onChange={(_, newValue) => {
                  field.onChange(newValue?.id || null)
                  setSelectedForPreview((prev: any) => ({
                    ...prev,
                    instructor: newValue?.name || ''
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
                    placeholder='Select Instructor'
                    label='Instructor'
                    error={!!errors.videoInstructorId}
                    helperText={errors.videoInstructorId?.message}
                  />
                )}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Controller
            name='mood'
            control={control}
            render={({ field }) => (
              <CustomAutocomplete
                disableClearable={false}
                fullWidth
                id='select-mood'
                options={allMoods || []}
                value={allMoods?.find((mood: any) => mood?.value === field?.value) || null}
                onChange={(_, newValue) => {
                  field.onChange(newValue?.value || '')
                }}
                getOptionLabel={option => option?.label || ''}
                renderOption={(props, option) => (
                  <li {...props} key={option?.label}>
                    <span>{option?.label}</span>
                  </li>
                )}
                renderInput={params => (
                  <CustomTextField
                    {...params}
                    placeholder='Select Mood'
                    label='Mood'
                    error={!!errors.mood}
                    helperText={errors.mood?.message}
                  />
                )}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 6 }}>
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
                    label='Default Playlist'
                    error={!!errors.playlistId}
                    helperText={errors.playlistId?.message}
                  />
                )}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 6 }}>
          <Controller
            name='videoTypeId'
            control={control}
            render={({ field }) => (
              <CustomAutocomplete
                disableClearable={false}
                fullWidth
                id='select-video-type'
                options={allVideoTypes || []}
                value={allVideoTypes?.find((videoType: any) => videoType?.id === field.value) || null}
                onChange={(_, newValue) => {
                  field.onChange(newValue?.id || null)
                  setSelectedForPreview((prev: any) => ({
                    ...prev,
                    videoType: newValue?.name || ''
                  }))
                }}
                getOptionLabel={option => snakeToPascalConverter(option?.name) || ''}
                renderOption={(props, option) => (
                  <li {...props} key={option?.name}>
                    <span>{snakeToPascalConverter(option?.name)}</span>
                  </li>
                )}
                renderInput={params => (
                  <CustomTextField
                    {...params}
                    placeholder='Select Video Type'
                    label='Video Type'
                    error={!!errors.videoTypeId}
                    helperText={errors.videoTypeId?.message}
                  />
                )}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Controller
            name='lengthType'
            control={control}
            render={({ field }) => (
              <CustomAutocomplete
                disabled={itemData?.isUsedInSession}
                disableClearable={false}
                fullWidth
                id='select-length-type'
                options={allLengthTypes || []}
                value={allLengthTypes?.find((lengthType: any) => lengthType?.value === field.value) || null}
                onChange={(_, newValue) => {
                  field.onChange(newValue?.value || '')
                }}
                getOptionLabel={option => option?.label || ''}
                renderOption={(props, option) => (
                  <li {...props} key={option?.label}>
                    <span>{option?.label}</span>
                  </li>
                )}
                renderInput={params => (
                  <CustomTextField
                    {...params}
                    placeholder='Select Length Type'
                    label='Length Type'
                    error={!!errors.lengthType}
                    helperText={errors.lengthType?.message}
                  />
                )}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Divider sx={{ mt: '3px', mb: '3px' }} />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Controller
            name='preTimerDuration'
            control={control}
            render={({ field }) => (
              <CustomDateTimePicker
                {...field}
                format='HH:mm:ss'
                label='Pre-Timer Duration'
                onChange={time => {
                  field.onChange(time)
                  setSelectedForPreview((prev: any) => ({
                    ...prev,
                    preTimerDuration: time
                  }))
                }}
                value={dayjs(field.value, 'HH:mm:ss').isValid() ? dayjs(field.value, 'HH:mm:ss') : null}
                onCloseReset={() => field.onChange('00:00:00')}
                error={!!errors.preTimerDuration}
                helperText={errors.preTimerDuration?.message}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Controller
            name='plungeDuration'
            control={control}
            render={({ field }) => (
              <>
                <CustomDateTimePicker
                  {...field}
                  disabled={itemData?.isUsedInSession}
                  format='HH:mm:ss'
                  label='Plunge Duration'
                  onChange={time => {
                    field.onChange(time)

                    setSelectedForPreview((prev: any) => ({
                      ...prev,
                      plungeDuration: time
                    }))

                    const timeInSec = hhmmssToSeconds(time)

                    //For lengthType field
                    const lengthType = getLengthTypeFromDuration(timeInSec)

                    setValue('lengthType', lengthType)
                  }}
                  value={dayjs(field.value, 'HH:mm:ss').isValid() ? dayjs(field.value, 'HH:mm:ss') : null}
                  onCloseReset={() => field.onChange('00:00:00')}
                  error={!!errors.plungeDuration}
                  helperText={errors.plungeDuration?.message}
                />
                <span style={{ color: '#888', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                  Pre-timer duration will be deducted from this
                </span>
              </>
            )}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <div className='flex items-center gap-4'>
            <CustomTextField
              label='Video Thumbnail '
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
                          setVideoThumbnail(null)
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
                    setVideoThumbnail(file)
                    setThumbnailError('')
                  }
                }}
              />
            </Button>
          </div>
        </Grid>
      </Grid>
    </form>
  )
}

export default AddVideoDetails
