//React Import
import { useState } from 'react'

//MUI Imports
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker, type DatePickerProps } from '@mui/x-date-pickers/DatePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { type Dayjs } from 'dayjs'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'

interface CustomDatePickerProps extends Omit<DatePickerProps<any>, 'value' | 'onChange'> {
  value?: string | Dayjs | null
  onChange?: (value: string) => void
  label?: string
  error?: boolean
  helperText?: string
  disablePast?: boolean
  format?: string
  readOnly?: boolean
}

const CustomDatePicker = (props: CustomDatePickerProps) => {
  const [open, setOpen] = useState(false)

  const {
    value,
    onChange,
    label = 'Select Date',
    error = false,
    helperText = '',
    disablePast = true,
    format = 'DD/MM/YYYY',
    ...rest
  } = props

  const handleChange = (date: Dayjs | null) => {
    if (!onChange) return
    onChange(date ? date.format() : '')
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <FormControl fullWidth>
        <FormLabel sx={{ mb: 1, color: error ? 'error.main' : '#2F2B3DE6', fontSize: '14px' }}>{label}</FormLabel>
        <DatePicker
          value={value ? dayjs(value) : null}
          onChange={handleChange}
          format={format}
          disablePast={disablePast}
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          slots={{
            openPickerIcon: () => <i className={`tabler-chevron-${open ? 'up' : 'down'}`} />
          }}
          slotProps={{
            textField: {
              size: 'small',
              readOnly: true,
              error,
              helperText,
              onClick: () => setOpen(true),
              inputProps: {
                placeholder: dayjs().format(format)
              },
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

export default CustomDatePicker
