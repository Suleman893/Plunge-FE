//Third Party Imports
import { toast } from 'react-toastify'
import * as tus from 'tus-js-client'

// import * as UpChunk from '@mux/upchunk'

//Config Imports
import { envConfig } from '@configs/envConfig'

//Helpers and Utils Imports
import { getMuxPlaybackIdFromUrl } from '@helpers/common'
import { ProtectedAPI } from '@utils/apiInterceptor'
import { getFirebasePublicUrl } from '@utils/firebaseBucket'
import { generateQueryParams } from '@utils/common'

//Constants Imports
import httpStatus from '@constants/httpStatus'
import { AUDIO_UPLOAD_CHUNK, FILE_UPLOAD_RETRY_BACKOFF_MS } from '@constants/common'

//Reducers Imports
import { setMusicUploadProgress, resetMusicUploadProgress } from './progress/slice'

//Mux implementation
// const uploadFileInChunks = (
//   action: 'add' | 'edit',
//   file: File,
//   uploadUrl: string,
//   payload: any,
//   dispatch: any,
//   uploadedMusicInfo?: any
// ): Promise<void> => {
//   const { handleClose, addUploadInstance, removeUploadInstance } = payload

//   return new Promise((resolve, reject) => {
//     const upload = UpChunk.createUpload({
//       endpoint: uploadUrl, // The Mux uploadUrl from backend
//       file,
//       chunkSize: UPLOAD_CHUNK
//     })

//     upload.on('progress', event => {
//       dispatch(setMusicUploadProgress({ id: uploadedMusicInfo.id, progress: event.detail }))
//     })
//     addUploadInstance(uploadedMusicInfo?.id, upload)
//     resolve()
//     handleClose()

//     upload.on('success', async () => {
//       dispatch(resetMusicUploadProgress({ id: uploadedMusicInfo.id }))
//       await deleteFileFromIndexedDB(uploadedMusicInfo.id)
//       removeUploadInstance(uploadedMusicInfo.id)

//       // In edit action, remove the previously uploaded asset from MUX after the current upload has succeeded
//       // Wrapped in try-catch to ensure upload flow completes even if deletion fails.
//       if (action === 'edit' && payload?.itemData?.audio) {
//         try {
//           await removeAssetFromMux(payload?.itemData?.audio)
//         } catch (error) {
//           console.error('Failed to remove MUX asset:', error)
//         }
//       }
//     })

//     upload.on('error', async event => {
//       // If action is 'add', delete the newly created record from the database (cleanup on failure)
//       // Wrapped in try-catch to ensure upload flow completes even if deletion fails.
//       // if (action === 'add' && uploadedMusicInfo?.id) {
//       //   try {
//       //     await ProtectedAPI.delete(`/admin/music/delete/${uploadedMusicInfo.id}`)
//       //   } catch (error) {
//       //     console.error('Failed to delete new music record from database', error)
//       //   }
//       // }

//       // dispatch(resetMusicUploadProgress({ id: uploadedMusicInfo.id }))
//       // console.log('The error from mux error', event.detail)

//       console.log('The error from mux music upload', event)
//       reject(new Error('Upload to Mux failed.'))
//     })
//   })
// }

// const uploadFileOnUrl = (file: File, url: string) => {
//   axios.put(url, file)
// }

const fetchAllMusics = async (payload: Record<string, string | number | boolean | null | undefined>) => {
  const query = generateQueryParams(payload)
  const res = await ProtectedAPI.get(`/admin/music/list?${query}`)

  if (res.data.status === httpStatus.OK) {
    return res.data.data
  }
}

const fetchAllPlaylist = async () => {
  const res = await ProtectedAPI.get(`/admin/music/playlist/list`)

  if (res.data.status === httpStatus.OK) {
    return res.data.data
  }
}

const fetchAllLicenseTypes = async () => {
  const res = await ProtectedAPI.get(`/admin/music/license-type/list`)

  if (res.data.status === httpStatus.OK) {
    return res.data.data
  }
}

const uploadAudio = async (file: File) => {
  const res = await ProtectedAPI.post('/admin/music/upload-audio', {
    originalFileName: file?.name,
    originalFileSize: file?.size,
    originalFileType: file?.type
  })

  return res.data.data
}

const addMusic = async (payload: any) => {
  const { data } = payload
  const res = await ProtectedAPI.post('/admin/music/create', data)

  if (res.data.status === httpStatus.CREATED) {
    return res.data.data
  }
}

const fetchDashboardStats = async () => {
  const res = await ProtectedAPI.get('/admin/music/stats')

  if (res.data.status === httpStatus.OK) {
    return res.data.data
  }
}

const updateStatus = async (payload: any) => {
  const { id, data, closeModal } = payload

  const res = await ProtectedAPI.put(`/admin/music/update-status/${id}`, data)

  if (res.data.status === httpStatus.OK) {
    closeModal()

    return toast.success(`Music status updated successfully`)
  }
}

const deleteMusic = async (payload: any) => {
  const { itemData, closeModal } = payload
  const id = itemData?.id

  const res = await ProtectedAPI.delete(`/admin/music/delete/${id}`)

  if (res.data.status === httpStatus.OK) {
    closeModal()

    return toast.success(`Music deleted successfully`)
  }
}

const editMusic = async (payload: any, fileAudio: any) => {
  const { id, data, handleClose } = payload
  const res = await ProtectedAPI.put(`/admin/music/update-info/${id}`, data)

  if (res.data.status === httpStatus.OK) {
    if (!fileAudio) {
      toast.success('Music updated successfully')
      handleClose()
    }

    return res.data.data
  }
}

const fetchMuxAudioMeta = async (payload: any) => {
  const { id } = payload
  const res = await ProtectedAPI.get(`/admin/music/metadata/${id}`)

  if (res.data.status === httpStatus.OK) {
    return res.data.data
  }
}

const removeAssetFromMux = async (payload: string | null) => {
  const playbackUrl = payload
  const playbackId = getMuxPlaybackIdFromUrl(playbackUrl)

  const res = await ProtectedAPI.delete(`/admin/music/asset/delete/${playbackId}`)

  if (res.data.status === httpStatus.OK) {
    return true
  }
}

const createAssetUsingUrl = async (uploadedMusicInfo: any, uploadUrl: string, file: File): Promise<any> => {
  const uploadId = uploadUrl.split('/').pop()

  if (!uploadId) {
    throw new Error('Invalid upload URL, cannot extract uploadId.')
  }

  const fileUrl = getFirebasePublicUrl(uploadId)

  try {
    await ProtectedAPI.post('/admin/music/create-asset', {
      fileUrl,
      metadata: {
        originalFileName: file.name,
        originalFileSize: file.size,
        originalFileType: file.type,
        uploadId: uploadedMusicInfo.audioUploadId
      }
    })
  } catch (err) {
    console.error('Failed to push file to Mux from Firebase:', err)
    throw err
  }
}

const uploadFileInChunks = (
  action: 'add' | 'edit',
  file: File,

  // uploadUrl: string,
  payload: any,
  dispatch: any,
  uploadedMusicInfo?: any
): Promise<void> => {
  return new Promise(resolve => {
    const { handleClose, addUploadInstance, removeUploadInstance } = payload

    const upload = new tus.Upload(file, {
      endpoint: `${envConfig.API_URL}/upload/tus`,
      chunkSize: AUDIO_UPLOAD_CHUNK,
      retryDelays: FILE_UPLOAD_RETRY_BACKOFF_MS,
      metadata: {
        filename: file.name,
        filetype: file.type,
        lastmodified: file.lastModified.toString(),
        size: file.size.toString()
      },
      removeFingerprintOnSuccess: true,
      fingerprint: async file => {
        return ['tus', uploadedMusicInfo.audioUploadId, file.name, file.type, file.size, file.lastModified].join('-')
      },
      onError: function (error: any) {
        console.error('Upload failed:', error)
        resolve()

        // reject(error)
      },
      onProgress: function (bytesUploaded, bytesTotal) {
        const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2)

        dispatch(setMusicUploadProgress({ id: uploadedMusicInfo.id, progress: Number(percentage), isPaused: false }))
      },

      onSuccess: async function () {
        try {
          dispatch(resetMusicUploadProgress({ id: uploadedMusicInfo?.id }))

          if (upload.url) {
            await createAssetUsingUrl(uploadedMusicInfo, upload.url, file)
          }

          if (action === 'edit' && payload?.itemData?.audio) {
            await removeAssetFromMux(payload.itemData.audio)
          }

          removeUploadInstance(uploadedMusicInfo?.id, uploadedMusicInfo?.audioUploadId)
        } catch (error) {
          console.error('Failed to remove previous MUX audio asset:', error)
        }
      }
    })

    addUploadInstance(uploadedMusicInfo?.id, uploadedMusicInfo?.audioUploadId, upload)
    upload.start()
    handleClose()
    resolve()
  })
}

const musicManagementService = {
  fetchAllMusics,
  fetchAllPlaylist,
  fetchAllLicenseTypes,
  uploadAudio,
  addMusic,
  fetchDashboardStats,
  updateStatus,
  deleteMusic,
  editMusic,
  fetchMuxAudioMeta,
  removeAssetFromMux,
  uploadFileInChunks,
  createAssetUsingUrl
}

export default musicManagementService
