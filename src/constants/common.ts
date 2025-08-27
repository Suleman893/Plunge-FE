//Pagination
export const PAGE_SIZE = 10
export const SORT_BY = 'DESC'

//MUX Upload Chunk Size
// export const UPLOAD_CHUNK = 102400 // 100MB

//Upload Chunk Size
export const UPLOAD_CHUNK = 20 * 1024 * 1024 // 20 MB
export const AUDIO_UPLOAD_CHUNK = 1 * 1024 * 1024 // 1 MB

// File Upload Retry Backoff Times (in milliseconds):
export const FILE_UPLOAD_RETRY_BACKOFF_MS = [
  0, // Immediately
  1000, // 1 second
  2000, // 2 seconds
  3000, // 3 seconds
  5000, // 5 seconds
  10000, // 10 seconds
  15000, // 15 seconds
  30000, // 30 seconds
  60000 // 60 seconds
]

//Nano ID Alphabet
export const ALPHABETS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

//File Upload
//*****Used in Plunge Model*****
export const PLUNGE_MODEL_PIC_TYPE = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']

export const PLUNGE_MODEL_VID_TYPE = ['video/mp4', 'video/webm', 'video/ogg']

//For React Dropzone package
export const PLUNGE_MODEL_IMG_TYPE = {
  'image/png': ['.png'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/webp': ['.webp']
} as const

export const PLUNGE_MODEL_VIDEO_TYPE = {
  'video/mp4': ['.mp4'],
  'video/webm': ['.webm'],
  'video/ogg': ['.ogv']
} as const

export const MUSIC_AUDIO_TYPE = {
  'audio/mpeg': ['.mp3'],
  'audio/wav': ['.wav'],
  'audio/aac': ['.aac'],
  'audio/mp4': ['.m4a'],
  'audio/x-m4a': ['.m4a']
} as const

export const VIDEO_TYPE = {
  'video/mp4': ['.mp4'],
  'video/webm': ['.webm'],
  'video/ogg': ['.ogv']
} as const

export const PLUNGE_MODEL_IMG_MAX_SIZE = 2 * 1024 * 1024 // 2MB

// export const PLUNGE_MODEL_VIDEO_MAX_SIZE = 100 * 1024 * 1024 // 100MB

//MUSIC
// export const MUSIC_MAX_SIZE = 30 * 1024 * 1024 // 30MB

//MUSIC/VIDEO Thumbnails
export const MUSIC_THUMBNAIL_PIC_TYPE = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']

export const MUSIC_THUMBNAIL_SIZE = 2 * 1024 * 1024 // 2MB

export const VIDEO_THUMBNAIL_SIZE = 2 * 1024 * 1024 // 2MB

export const VIDEO_THUMBNAIL_PIC_TYPE = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']

//*****User Module*****
export const USER_PIC_MAX_SIZE = 2 * 1024 * 1024 //2 MB

export const USER_PIC_TYPE = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
