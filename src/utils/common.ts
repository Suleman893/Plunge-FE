import dayjs from 'dayjs'

// Truncates text to a specified max length and adds ellipsis if needed
export const truncateText = (text: string, maxLength: number = 20) => {
  if (!text) return '-'

  return text.length > maxLength ? `${text.slice(0, maxLength - 3)}...` : text
}

// Converts a string to lowercase
export const toLowerCase = (text: string) => {
  return text.toLowerCase()
}

// Capitalizes the first letter and makes the rest lowercase
export const capitalizeFirst = (text: string): string => {
  if (!text) return ''

  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

// Converts a file size in bytes to KB or MB with specified precision
// export const getFileSize = (sizeInBytes: number, precision = 1) => {
//   const kb = sizeInBytes / 1024
//   const mb = sizeInBytes / (1024 * 1024)

//   if (mb >= 1) {
//     return {
//       size: Number(mb.toFixed(precision)),
//       unit: 'MB'
//     }
//   } else {
//     return {
//       size: Number(kb.toFixed(precision)),
//       unit: 'KB'
//     }
//   }
// }

export const getFileSize = (sizeInBytes: number, precision = 1) => {
  const kb = sizeInBytes / 1000
  const mb = sizeInBytes / 1_000_000

  if (mb >= 1) {
    return {
      size: Number(mb.toFixed(precision)),
      unit: 'MB'
    }
  } else {
    return {
      size: Number(kb.toFixed(precision)),
      unit: 'KB'
    }
  }
}

// Return full name from first name and last name
export const getFullName = (fName?: string | null, lName?: string | null): string => {
  if (!fName && !lName) return ''

  return `${fName ?? ''} ${lName ?? ''}`.trim()
}

// For MUI Avatars used in header
export const getInitials = (firstName: string | null, lastName?: string | null): string => {
  const fInitial = firstName?.charAt(0) ?? ''
  const lInitial = lastName?.charAt(0) ?? ''

  return (fInitial + lInitial).toUpperCase()
}

// Generates a query string from an object
export const generateQueryParams = (params: Record<string, string | number | boolean | null | undefined>): string => {
  const filteredParams = Object.fromEntries(
    Object.entries(params)
      .filter(([, value]) => value != null && value !== '')
      .map(([key, value]) => [key, String(value)])
  )

  return new URLSearchParams(filteredParams).toString()
}

// Formats a timestamp into 'DD/M/YYYY' default date format using dayjs
export const formatTimestampToDate = (
  value: string | number | Date | null | undefined,
  format?: string | null
): string => {
  if (!value) return '-'

  return dayjs(value).format(format || 'DD/M/YY')
}

// Converts a 24-hour time string (e.g., "14:30") to 12-hour format with AM/PM (e.g., "02:30 PM")
export const formatTimeTo12Hour = (timeString: string): string => {
  if (!timeString) return '-'

  const [hours, minutes] = timeString.split(':')

  const time = dayjs().set('hour', parseInt(hours, 10)).set('minute', parseInt(minutes, 10)).set('second', 0)

  return time.format('hh:mm A')
}

// Returns the current time if selected date is today, otherwise the start of the selected day
export const getMinTimeForDate = (selectedDate?: any): any => {
  const now = dayjs()

  if (!selectedDate) return dayjs().startOf('day')

  const selected = dayjs(selectedDate)

  return selected.isSame(now, 'day') ? now : selected.startOf('day')
}

//To display the timestamp into readable time with AM/PM
export const formatTimeRange = (timeStamp: string | number | Date): string => {
  const formattedTime = dayjs(timeStamp).format('hh:mm A')

  return formattedTime
}
