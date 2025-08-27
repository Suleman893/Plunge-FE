'use client'

//React Imports
import { useEffect } from 'react'

// MUI Import
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import RadioGroup from '@mui/material/RadioGroup'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import Grid from '@mui/material/Grid2'

//Third Party Imports
import { useDispatch, useSelector } from 'react-redux'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import dayjs from 'dayjs'
import { toast } from 'react-toastify'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

// Component Imports
import CustomAutocomplete from '@core/components/mui/Autocomplete'
import CustomTextField from '@core/components/mui/TextField'
import BorderButton from '@components/buttons/BorderButton'
import CustomButton from '@core/components/mui/Button'
import CustomDatePicker from '@core/components/mui/DatePicker'
import CustomTimePicker from '@core/components/mui/TimePicker'

//Types Imports
import type { AddEditNotificationProps } from '@custom-types/pages/push-notifications'

//Schema Imports
import { type AddNotificationFormValues, addNotificationSchema } from '@schemas/pushNotification'

//Redux Imports
import { createNotification, editNotification } from '@features/push-notification/thunk'
import type { RootState } from '@features/store'

//Constants Imports
import { addNotificationDefault } from '@/constants/formDefault/pushNotification'

//Data Import
import { notificationTypes } from '@data/push-notifications'

const AddEditNotification = (props: AddEditNotificationProps) => {
  const { isEdit, handleClose, defaultData } = props

  //Hooks

  const dispatch = useDispatch()

  const { isCreateNotificationLoading, isEditNotificationLoading } = useSelector(
    (state: RootState) => state.pushNotification
  )

  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isDirty }
  } = useForm<AddNotificationFormValues>({
    resolver: zodResolver(addNotificationSchema),
    defaultValues: addNotificationDefault
  })

  //Edit
  useEffect(() => {
    if (isEdit && defaultData) {
      reset({
        message: defaultData?.message || '',
        notificationType: defaultData?.notificationType?.name || '',
        status: defaultData?.status || 'sent',
        date: defaultData?.date || '',
        time: defaultData?.time || ''
      })
    }
  }, [isEdit, defaultData, reset])

  //Watchers
  //Watch for length in message
  const messageValue = watch('message')

  //Dynamic render date/time fields
  const statusValue = watch('status')

  //To handled minimum time
  const selectedDate = watch('date')

  const onSubmit = async (data: AddNotificationFormValues) => {
    const now = dayjs()

    if (data.status === 'schedule') {
      //Rechecking date and time before submitting
      const scheduledDateTime = dayjs(`${data.date} ${data.time}`, 'YYYY-MM-DD HH:mm')

      if (!scheduledDateTime.isValid() || scheduledDateTime.isBefore(now)) {
        return toast.error('Invalid date or time selected')
      }

      data.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    } else {
      //Add current date and time for Sent
      data.date = now.format('YYYY-MM-DD')
      data.time = now.format('HH:mm')
    }

    const payloadData = {
      data,
      reset,
      handleClose,
      ...(isEdit && defaultData?.id ? { id: defaultData.id } : {})
    }

    dispatch((isEdit ? editNotification : createNotification)(payloadData) as any)
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
        <Box>
          <p className='text-sm mb-1'>Notification Type</p>
          <Controller
            name='notificationType'
            control={control}
            render={({ field }) => (
              <CustomAutocomplete
                disableClearable={false}
                fullWidth
                id='select-notification-types'
                options={notificationTypes}
                value={notificationTypes.find(type => type.value === field.value) || null}
                onChange={(_, newValue) => {
                  field.onChange(newValue?.value || '')
                }}
                renderInput={params => (
                  <CustomTextField
                    {...params}
                    placeholder='Select Notification Type'
                    error={!!errors.notificationType}
                    helperText={errors.notificationType?.message || ' '}
                  />
                )}
              />
            )}
          />
        </Box>
        <Box>
          <Controller
            name='message'
            control={control}
            render={({ field }) => (
              <CustomTextField
                {...field}
                multiline
                rows={4}
                fullWidth
                label='Enter Message'
                variant='outlined'
                placeholder='Type your message'
                error={!!errors.message}
                helperText={errors.message?.message}
                slotProps={{
                  htmlInput: {
                    maxLength: 120
                  }
                }}
              />
            )}
          />
          <p className='text-sm text-end mt-1 text-gray-400'>{messageValue?.length}/120</p>
        </Box>
        <Divider />

        <Controller
          name='status'
          control={control}
          render={({ field }) => (
            <FormControl>
              <FormLabel id='status' className='text-textPrimary mb-2 text-sm'>
                Sending Type
              </FormLabel>
              <RadioGroup row {...field}>
                <FormControlLabel value='sent' control={<Radio />} label='Send Now' />
                <FormControlLabel value='schedule' control={<Radio />} label='Schedule' />
              </RadioGroup>
            </FormControl>
          )}
        />

        {statusValue === 'schedule' && (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='date'
                control={control}
                render={({ field }) => (
                  <CustomDatePicker
                    {...field}
                    label='Select Date'
                    format='DD MMM, YYYY'
                    onChange={date => {
                      field.onChange(dayjs(date).format('YYYY-MM-DD'))
                      setValue('time', '')
                    }}
                    value={dayjs(field.value).isValid() ? dayjs(field.value) : null}
                    error={!!errors.date}
                    helperText={errors.date?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='time'
                control={control}
                render={({ field }) => {
                  const isToday = selectedDate === dayjs().format('YYYY-MM-DD')
                  const minTime = isToday ? dayjs().add(1, 'hour').startOf('hour') : undefined

                  return (
                    <CustomTimePicker
                      {...field}
                      label='Select Time'
                      onChange={time => field.onChange(dayjs(time).format('HH:mm'))}
                      value={dayjs(field.value, 'HH:mm').isValid() ? dayjs(field.value, 'HH:mm') : null}
                      error={!!errors.time}
                      helperText={errors.time?.message}
                      minTime={minTime}
                    />
                  )
                }}
              />
            </Grid>
          </Grid>
        )}
        <div className='flex items-center gap-4'>
          <CustomButton
            type='submit'
            fullWidth
            text={statusValue === 'schedule' ? 'Schedule Now' : 'Send Now'}
            loading={isCreateNotificationLoading || isEditNotificationLoading}
            disabled={isEdit && !isDirty}
          />
          <BorderButton
            text='Cancel'
            handleClick={() => {
              handleClose()
              reset()
            }}
          />
        </div>
      </form>
    </LocalizationProvider>
  )
}

export default AddEditNotification
