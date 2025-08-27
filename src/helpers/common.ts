//Third Party Imports
import { nanoid, customAlphabet } from 'nanoid'
import dayjs from 'dayjs'
import SHA256 from 'crypto-js/sha256'

//Constants Imports
import { ALPHABETS } from '@constants/common'

//Configuration Imports
// import { envConfig } from '@configs/envConfig'

const generateUploadId = customAlphabet(ALPHABETS, 22)

export const muxUploadId = () => generateUploadId()

// Converts snake_case string to Pascal Case with spaces
export const snakeToPascalConverter = (value: string) => {
  if (!value) return ''

  return value
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Returns MUI-compatible chip color based on status value
export const statusColor = (
  module: 'users' | 'plunge-models' | 'push-notifications',
  value: string
): 'success' | 'default' | 'error' | 'warning' => {
  if (module === 'users') {
    switch (value.toLowerCase()) {
      case 'active':
        return 'success'
      case 'pending':
        return 'default'
      case 'inactive':
        return 'error'
      default:
        return 'default'
    }
  }

  if (module === 'plunge-models') {
    switch (value.toLowerCase()) {
      case 'active':
        return 'success'
      case 'inactive':
        return 'default'
      default:
        return 'default'
    }
  }

  if (module === 'push-notifications') {
    switch (value.toLowerCase()) {
      case 'sent':
        return 'success'
      case 'schedule':
        return 'warning'
      default:
        return 'default'
    }
  }

  return 'default'
}

// Maps user status string to corresponding label or fallback
export const userStatusMapping = (status: string): string => {
  const mapping: Record<string, string> = {
    pending: 'pending',
    active: 'active',
    inactive: 'suspended'
  }

  return mapping[status] || '-'
}

// Maps plungeModel status string to corresponding label or fallback
export const plungeModelStatusMapping = (status: string): string => {
  const mapping: Record<string, string> = {
    active: 'active',
    inactive: 'disabled'
  }

  return mapping[status] || '-'
}

export const musicStatusMapping = (status: string): string => {
  const mapping: Record<string, string> = {
    active: 'active',
    inactive: 'archived'
  }

  return mapping[status] || '-'
}

export const videoStatusMapping = (status: string): string => {
  const mapping: Record<string, string> = {
    active: 'active',
    inactive: 'archived'
  }

  return mapping[status] || '-'
}

/**
 * Generates a unique password following specified validation rules:
 * - Length between 8 and 32 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character (e.g. !, @, #, etc.)
 **/
export const generatePassword = (length = 13): string => {
  // Validate password length to ensure it's between 8 and 32 characters
  if (length < 8 || length > 32) {
    throw new Error('Password length must be between 8 and 32 characters')
  }

  const password = nanoid(length)

  //Regex check for each rule
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecialChar = /[\W_]/.test(password)

  if (hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar) {
    return password
  }

  // If the generated password doesn't meet the criteria, regenerate it
  // Keep trying until it meets all criteria
  return generatePassword()
}

export const getAudioDurationLabel = (durationInSeconds: number): string => {
  const durationInMinutes = Math.ceil(durationInSeconds / 60)

  if (durationInMinutes < 2) {
    return `Short (0-2 Mins)`
  } else {
    return `Long ${durationInMinutes} Min`
  }
}

export const getAudioDuration = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const audio = new Audio()

    audio.src = URL.createObjectURL(file)

    audio.addEventListener('loadedmetadata', () => {
      const duration = audio.duration
      const label = getAudioDurationLabel(duration)

      resolve(label)
    })

    audio.addEventListener('error', () => {
      reject('Failed to load audio metadata.')
    })
  })
}

export const getMuxPlaybackIdFromUrl = (url: string | null): string | null => {
  if (url) {
    const match = url.match(/stream\.mux\.com\/([^./]+)/)

    return match ? match[1] : null
  }

  return null
}

export const timeToReadable = (timeStr: string): string => {
  const time = dayjs(timeStr, 'HH:mm:ss')

  if (!time.isValid()) return ''

  const hours = time.hour()
  const minutes = time.minute()
  const seconds = time.second()

  const parts: string[] = []

  if (hours) parts.push(`${hours} Hour${hours === 1 ? '' : 's'}`)
  if (minutes) parts.push(`${minutes} Minute${minutes === 1 ? '' : 's'}`)
  if (seconds) parts.push(`${seconds} Second${seconds === 1 ? '' : 's'}`)

  return parts
    .join(' and ')
    .replace(' and ', ', ')
    .replace(/, ([^,]*)$/, ' and $1')
}

export const fetchPaginatedOptions = async (
  dispatch: any,
  methodToDispatch: any,
  queryParams: any,
  searchQuery: any,
  loadedOptions: any,
  { page }: any
) => {
  try {
    const response = await dispatch(methodToDispatch(queryParams))

    if (response.meta.requestStatus === 'fulfilled') {
      const result: any = {
        options: response.payload.items,
        hasMore: response.payload.pagination.isMore
      }

      //Include the `additional` property only if there are more items to load
      if (response?.payload?.pagination?.isMore) {
        result.additional = { page: page + 1 }
      }

      return result
    } else {
      return { options: loadedOptions, hasMore: false }
    }
  } catch (err) {
    return { options: loadedOptions, hasMore: false }
  }
}

export const hashUID = (uid: string): string => {
  return SHA256(uid).toString()
}

export const formatViewCount = (count?: number | null): string => {
  const views = typeof count === 'number' && count >= 0 ? count : 0

  const formattedCount = views >= 1000 ? `${(views / 1000).toFixed(views % 1000 === 0 ? 0 : 1)}K` : `${views}`

  const viewLabel = views === 1 ? 'view' : 'views'

  return `${formattedCount} ${viewLabel}`
}

export const formatPrevMonthPercentage = (value?: number) => {
  const val = value || 0
  const displayValue = val >= 1000 ? `${(val / 1000).toFixed(0)}K` : val

  return `${val > 0 ? '+' : ''}${displayValue}%`
}

export const getVideoDurationFromFile = (file: File): Promise<number> => {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const video = document.createElement('video')

    video.preload = 'metadata'
    video.src = url

    video.onloadedmetadata = () => {
      URL.revokeObjectURL(url)
      resolve(video.duration) // in seconds
    }

    video.onerror = () => {
      reject(new Error('Failed to load video metadata'))
    }
  })
}

export const secondsToHHMMSS = (durationInSeconds: number): string => {
  const totalSeconds = Math.round(durationInSeconds)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  const hh = hours.toString().padStart(2, '0')
  const mm = minutes.toString().padStart(2, '0')
  const ss = seconds.toString().padStart(2, '0')

  return `${hh}:${mm}:${ss}`
}

export const getLengthTypeFromDuration = (durationInSec: number): 'short' | 'moderate' | 'long' => {
  if (durationInSec <= 120) return 'short' // 0–2 min
  if (durationInSec <= 300) return 'moderate' // 3–5 min

  return 'long' // >5 min
}

export const hhmmssToSeconds = (time: string): number => {
  const [hh = '0', mm = '0', ss = '0'] = time.split(':')

  return +hh * 3600 + +mm * 60 + +ss
}

const getFileExtension = (filename: string): string => {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2).toLowerCase()
}

export const isValidMusicFile = (file: File): boolean => {
  const AUDIO_TYPE: Record<string, string[]> = {
    'audio/mpeg': ['.mp3'],
    'audio/wav': ['.wav'],
    'audio/aac': ['.aac'],
    'audio/mp4': ['.m4a'],
    'audio/x-m4a': ['.m4a']
  }

  const ext = getFileExtension(file.name)
  const allowed = Object.entries(AUDIO_TYPE)

  return allowed.some(([mime, exts]) => {
    return (file.type === mime || file.type === '') && exts.includes(`.${ext}`)
  })
}

export const isValidVideoFile = (file: File): boolean => {
  const VIDEO_TYPE: Record<string, string[]> = {
    'video/mp4': ['.mp4'],
    'video/webm': ['.webm'],
    'video/ogg': ['.ogv']
  }

  const ext = getFileExtension(file.name)
  const allowed = Object.entries(VIDEO_TYPE)

  return allowed.some(([mime, exts]) => {
    return (file.type === mime || file.type === '') && exts.includes(`.${ext}`)
  })
}

export const findTusUploadMetadataByUploadId = (
  uploadId: string
): {
  metadata: {
    filename: string
    filetype: string
    lastmodified?: string
    size?: string
  }
  size: number
  uploadUrl: string
  creationTime: string
} | null => {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)

    if (!key) continue

    if (key.startsWith('tus::tus-') && key.includes(uploadId)) {
      const value = localStorage.getItem(key)

      try {
        const parsed = value ? JSON.parse(value) : null

        if (parsed && parsed.metadata && parsed.uploadUrl) {
          return parsed
        }
      } catch (err) {
        console.warn('Failed to parse tus metadata from localStorage:', err)
      }
    }
  }

  return null
}

// export const getAssetMetadata = async (url: string): Promise<any> => {
//   const playbackId = getMuxPlaybackIdFromUrl(url)

//   try {
//     // Step 1: Get Playback Info
//     const playbackResp = await axios.get(`${MUX_BASEURL}/playback-ids/${playbackId}`, {
//       auth: {
//         username: envConfig.MUX_TOKEN_ID || '',
//         password: envConfig.MUX_TOKEN_SECRET || ''
//       }
//     })

//     const assetId = playbackResp.data?.data?.object?.id

//     // Step 2: Get Asset Info
//     const assetResp = await axios.get(`${MUX_BASEURL}/assets/${assetId}`, {
//       auth: {
//         username: envConfig.MUX_TOKEN_ID || '',
//         password: envConfig.MUX_TOKEN_SECRET || ''
//       }
//     })

//     const assetData = assetResp.data?.data

//     // Parse passthrough from string to object

//     const parsedPassthrough = JSON.parse(assetData?.passthrough)

//     return {
//       name: parsedPassthrough?.originalFileName || '',
//       size: parsedPassthrough?.originalFileSize || '-',
//       type: 'video/mp4',
//       url: url
//     }
//   } catch (error) {
//     console.error('Error fetching video metadata:', error)
//     throw error
//   }
// }
