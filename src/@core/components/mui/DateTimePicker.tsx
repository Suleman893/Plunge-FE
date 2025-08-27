//React Import
import { useState } from 'react'

// MUI Imports
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DateTimePicker, type DateTimePickerProps } from '@mui/x-date-pickers/DateTimePicker'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'

//Third Party Import
import dayjs, { type Dayjs } from 'dayjs'

interface CustomTimePickerProps extends Omit<DateTimePickerProps<any>, 'value' | 'onChange'> {
  value?: string | Dayjs | null
  onChange?: (value: string) => void
  label?: string
  error?: boolean
  helperText?: string
  format?: string
  readOnly?: boolean
  onCloseReset?: () => void
  disabled?: boolean
}

const CustomDateTimePicker = (props: CustomTimePickerProps) => {
  const [open, setOpen] = useState(false)

  const {
    value,
    onChange,
    label = 'Select Time',
    error = false,
    helperText = '',
    format = 'HH:mm:ss',
    onCloseReset,
    disabled = false,
    ...rest
  } = props

  const handleChange = (time: Dayjs | null) => {
    if (time && onChange) {
      onChange(time.format(format))
    }
  }

  const handleClose = () => {
    setOpen(false)

    if (!value && onCloseReset) {
      onCloseReset()
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <FormControl fullWidth>
        <FormLabel
          sx={{
            mb: 1,
            color: error ? 'error.main' : disabled ? 'rgba(0, 0, 0, 0.38)' : '#2F2B3DE6',
            fontSize: '14px'
          }}
        >
          {label}
        </FormLabel>
        <DateTimePicker
          disabled={disabled}
          ampm={false}
          views={['hours', 'minutes', 'seconds']}
          value={value ? dayjs(value) : null}
          onChange={handleChange}
          format={format}
          open={open}
          onOpen={() => {
            if (!disabled) setOpen(true) //Prevent opening if disabled
          }}
          onClose={handleClose}
          timeSteps={{ minutes: 1, seconds: 1 }}
          slots={{
            openPickerIcon: () => <i className={`tabler-chevron-${open ? 'up' : 'down'}`} />
          }}
          slotProps={{
            textField: {
              placeholder: '',
              size: 'small',
              readOnly: true,
              error,
              helperText,
              disabled,
              onClick: () => {
                if (!disabled) setOpen(true) //Prevent interaction if disabled
              },
              FormHelperTextProps: {
                sx: {
                  marginLeft: 0
                }
              },
              InputProps: {
                sx: {
                  backgroundColor: disabled ? 'rgb(47 43 61 / 0.06)' : 'transparent'
                }
              }
            },
            layout: {
              sx: {
                '& .MuiPickersLayout-contentWrapper > div:first-of-type': {
                  display: 'none' // Hide the calendar part
                },
                '& .MuiPickersLayout-actionBar': {
                  pt: 0
                }
              }
            },
            actionBar: {
              // actions: ['cancel', 'accept']
              actions: ['accept']
            }
          }}
          {...rest}
        />
      </FormControl>
    </LocalizationProvider>
  )
}

export default CustomDateTimePicker
