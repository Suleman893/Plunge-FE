//React Import
import { useState } from 'react'

//MUI Imports
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { TimePicker, type TimePickerProps } from '@mui/x-date-pickers/TimePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { type Dayjs } from 'dayjs'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'

interface CustomTimePickerProps extends Omit<TimePickerProps<any>, 'value' | 'onChange'> {
  value?: string | Dayjs | null
  onChange?: (value: string) => void
  label?: string
  error?: boolean
  helperText?: string
  format?: string
  readOnly?: boolean
}

const CustomTimePicker = (props: CustomTimePickerProps) => {
  const [open, setOpen] = useState(false)

  const { value, onChange, label = 'Select Time', error = false, helperText = '', format = 'hh:mm A', ...rest } = props

  const handleChange = (time: Dayjs | null) => {
    if (!onChange) return
    onChange(time ? time.format() : '')
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <FormControl fullWidth>
        <FormLabel sx={{ mb: 1, color: error ? 'error.main' : '#2F2B3DE6', fontSize: '14px' }}>{label}</FormLabel>
        <TimePicker
          value={value ? dayjs(value) : null}
          onChange={handleChange}
          format={format}
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          slots={{
            openPickerIcon: () => <i className={`tabler-chevron-${open ? 'up' : 'down'}`} />
          }}
          timeSteps={{ minutes: 1 }}
          slotProps={{
            textField: {
              size: 'small',
              readOnly: true,
              error,
              helperText,
              onClick: () => setOpen(true),
              FormHelperTextProps: {
                sx: {
                  marginLeft: 0
                }
              }
            }
          }}
          {...rest}
        />
      </FormControl>
    </LocalizationProvider>
  )
}

export default CustomTimePicker
