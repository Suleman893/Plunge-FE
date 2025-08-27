//Third Party Imports
import { toast } from 'react-toastify'
import * as tus from 'tus-js-client'

// import * as UpChunk from '@mux/upchunk'

//Helper and Utils Imports
import { ProtectedAPI } from '@utils/apiInterceptor'
import { generateQueryParams } from '@utils/common'
import { getFirebasePublicUrl } from '@utils/firebaseBucket'
import { getMuxPlaybackIdFromUrl } from '@helpers/common'

//Reducers Imports
import { setPlungeModelUploadProgress, resetPlungeModelUploadProgressByKey } from './progress/slice'

//Config Imports
import { envConfig } from '@configs/envConfig'

//Constants Imports
import httpStatus from '@constants/httpStatus'
import { UPLOAD_CHUNK, FILE_UPLOAD_RETRY_BACKOFF_MS } from '@constants/common'

const addPlungeModel = async (payload: any) => {
  const { data } = payload

  const res = await ProtectedAPI.post('/admin/product-model/create', data)

  if (res.data.status === httpStatus.CREATED) {
    return res.data.data
  }
}

// const uploadFileOnUrl = (file: File, url: string) => {
//   axios.put(url, file)
// }

const uploadVideos = async ({
  pairingVideo,
  setupVideo,
  troubleShootVideo
}: {
  pairingVideo?: File
  setupVideo?: File
  troubleShootVideo?: File
}) => {
  const payloadBody: Record<string, any> = {}

  if (setupVideo instanceof File) {
    payloadBody.setupVideo = {
      originalFileName: setupVideo.name,
      originalFileSize: setupVideo.size,
      originalFileType: setupVideo.type
    }
  }

  if (pairingVideo instanceof File) {
    payloadBody.pairingVideo = {
      originalFileName: pairingVideo.name,
      originalFileSize: pairingVideo.size,
      originalFileType: pairingVideo.type
    }
  }

  if (troubleShootVideo instanceof File) {
    payloadBody.troubleShootVideo = {
      originalFileName: troubleShootVideo.name,
      originalFileSize: troubleShootVideo.size,
      originalFileType: troubleShootVideo.type
    }
  }

  const res = await ProtectedAPI.post('/admin/product-model/upload-videos', payloadBody)

  return res.data.data
}

// const uploadFileInChunks = (
//   action: 'add' | 'edit',
//   file: File,
//   uploadUrl: string,
//   key: 'setupVideo' | 'pairingVideo' | 'troubleShootVideo',
//   payload: any,
//   dispatch: any,
//   uploadedPlungeModelInfo?: any

//   // onSingleUploadSuccess?: (key: 'setupVideo' | 'pairingVideo' | 'troubleShootVideo') => void
// ): Promise<void> => {
//   return new Promise((resolve, reject) => {
//     const { router, addUploadInstance, removeUploadInstance } = payload

//     const upload = UpChunk.createUpload({
//       endpoint: uploadUrl, // The Mux uploadUrl from backend
//       file,
//       chunkSize: UPLOAD_CHUNK
//     })

//     upload.on('progress', event => {
//       dispatch(
//         setPlungeModelUploadProgress({
//           id: uploadedPlungeModelInfo?.id,
//           key,
//           progress: event.detail
//         } as any)
//       )
//     })

//     addUploadInstance(`${uploadedPlungeModelInfo?.id}_${key}`, upload)
//     resolve()
//     router?.push('/plunge-models')

//     upload.on('success', async () => {
//       // if (action === 'add' && onSingleUploadSuccess) {
//       //   await onSingleUploadSuccess(key)
//       // } else {
//       // In edit action, attempt to remove the previously uploaded MUX asset for the specified video type.
//       // Wrapped in try-catch to ensure upload flow is not interrupted by deletion errors.
//       try {
//         if (key === 'pairingVideo') {
//           resetPlungeModelUploadProgressByKey({
//             id: uploadedPlungeModelInfo?.id,
//             key: 'pairingVideo'
//           })
//           await deleteFileFromIndexedDB(`${uploadedPlungeModelInfo?.id}_${key}`)
//           removeUploadInstance(`${uploadedPlungeModelInfo?.id}_${key}`)

//           if (action === 'edit') {
//             await removeAssetFromMux(payload.itemData.pairingVideo)
//           }
//         } else if (key === 'setupVideo') {
//           resetPlungeModelUploadProgressByKey({
//             id: uploadedPlungeModelInfo?.id,
//             key: 'setupVideo'
//           })
//           await deleteFileFromIndexedDB(`${uploadedPlungeModelInfo?.id}_${key}`)
//           removeUploadInstance(`${uploadedPlungeModelInfo?.id}_${key}`)

//           if (action === 'edit') {
//             await removeAssetFromMux(payload.itemData.setupVideo)
//           }
//         } else if (key === 'troubleShootVideo') {
//           resetPlungeModelUploadProgressByKey({
//             id: uploadedPlungeModelInfo?.id,
//             key: 'troubleShootVideo'
//           })
//           await deleteFileFromIndexedDB(`${uploadedPlungeModelInfo?.id}_${key}`)
//           removeUploadInstance(`${uploadedPlungeModelInfo?.id}_${key}`)

//           if (action === 'edit') {
//             await removeAssetFromMux(payload.itemData.troubleShootVideo)
//           }
//         }
//       } catch (error) {
//         console.error('Failed to remove previous MUX asset:', error)
//       }
//     })

//     upload.on('error', async event => {
//       // If action is 'add', delete the newly created record from the database (cleanup on failure)
//       // Wrapped in try-catch to ensure upload flow is not interrupted by deletion errors.
//       // if (action === 'add' && uploadedPlungeModelInfo?.id) {
//       //   try {
//       //     await ProtectedAPI.delete(`/admin/product-model/delete/${uploadedPlungeModelInfo.id}`)
//       //   } catch (error) {
//       //     console.error('Failed to delete video from database', error)
//       //   }
//       // }

//       // dispatch(resetPlungeModelUploadProgress({ id: uploadedPlungeModelInfo.id }))

//       console.log('The error from mux plunge model upload', event)
//       reject(new Error('Upload to Mux failed.'))
//     })
//   })
// }

const createAssetUsingUrl = async (videoUploadId: any, uploadUrl: string, file: File): Promise<any> => {
  const uploadId = uploadUrl.split('/').pop()

  if (!uploadId) {
    throw new Error('Invalid upload URL, cannot extract uploadId.')
  }

  const fileUrl = getFirebasePublicUrl(uploadId)

  try {
    await ProtectedAPI.post('/admin/product-model/create-asset', {
      fileUrl,
      metadata: {
        originalFileName: file.name,
        originalFileSize: file.size,
        originalFileType: file.type,
        uploadId: videoUploadId
      }
    })
  } catch (err) {
    console.error('Failed to push file to Mux from Firebase:', err)
    throw err
  }
}

const fetchAllPlungeModels = async (payload: Record<string, string | number | boolean | null | undefined>) => {
  const query = generateQueryParams(payload)
  const res = await ProtectedAPI.get(`/admin/product-model/list?${query}`)

  if (res.data.status === httpStatus.OK) {
    return res.data.data
  }
}

const updatePlungeStatus = async (payload: any) => {
  const { id, data, setOpenModal } = payload

  const res = await ProtectedAPI.put(`/admin/product-model/update-status/${id}`, data)

  if (res.data.status === httpStatus.OK) {
    toast.success(`Status updated successfully`)

    return setOpenModal(false)
  }
}

const deletePlungeModel = async (payload: any) => {
  const { selectedItem, setOpenModal } = payload

  const { id } = selectedItem

  const res = await ProtectedAPI.delete(`/admin/product-model/delete/${id}`)

  if (res.data.status === httpStatus.OK) {
    toast.success(`Plunge model deleted successfully`)

    return setOpenModal(false)
  }
}

const fetchDashboardStats = async () => {
  const res = await ProtectedAPI.get('/admin/product-model/stats')

  if (res.data.status === httpStatus.OK) {
    return res.data.data
  }
}

const editPlungeModel = async (
  payload: any,
  fileSetupVideo: any,
  filePairingVideo: any,
  fileTroubleShootVideo: any
) => {
  const { id, data } = payload
  const res = await ProtectedAPI.put(`/admin/product-model/update/${id}`, data)

  if (res.data.status === httpStatus.OK) {
    if (!fileSetupVideo && !filePairingVideo && !fileTroubleShootVideo) {
      toast.success('Plunge model updated successfully')
      payload?.router?.push('/plunge-models')
    }

    return res.data.data
  }
}

const fetchMuxVideoMeta = async (payload: any) => {
  const { id } = payload
  const res = await ProtectedAPI.get(`/admin/video/metadata/${id}`)

  if (res.data.status === httpStatus.OK) {
    return res.data.data
  }
}

const removeAssetFromMux = async (payload: string | null) => {
  const playbackUrl = payload
  const playbackId = getMuxPlaybackIdFromUrl(playbackUrl)

  const res = await ProtectedAPI.delete(`/admin/product-model/asset/delete/${playbackId}`)

  if (res.data.status === httpStatus.OK) {
    return true
  }
}

export const uploadFileInChunks = (
  action: 'add' | 'edit',
  file: File,
  uploadId: string,
  key: 'setupVideo' | 'pairingVideo' | 'troubleShootVideo',
  payload: any,
  dispatch: any,
  uploadedPlungeModelInfo?: any
): Promise<void> => {
  return new Promise(resolve => {
    const { router, addUploadInstance, removeUploadInstance } = payload

    const upload = new tus.Upload(file, {
      endpoint: `${envConfig.API_URL}/upload/tus`,
      chunkSize: UPLOAD_CHUNK,
      retryDelays: FILE_UPLOAD_RETRY_BACKOFF_MS,
      metadata: {
        filename: file.name,
        filetype: file.type,
        lastmodified: file.lastModified.toString(),
        size: file.size.toString()
      },
      removeFingerprintOnSuccess: true,
      fingerprint: async file => {
        return ['tus', uploadId, file.name, file.type, file.size, file.lastModified].join('-')
      },
      onError: function (error: any) {
        console.error(`Upload failed for ${key}:`, error)
      },
      onProgress: function (bytesUploaded, bytesTotal) {
        const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2)

        dispatch(
          setPlungeModelUploadProgress({
            id: uploadedPlungeModelInfo?.id,
            key,
            progress: Number(percentage)
          })
        )
      },
      onSuccess: async function () {
        dispatch(
          resetPlungeModelUploadProgressByKey({
            id: uploadedPlungeModelInfo?.id,
            key
          })
        )

        if (upload.url) {
          await createAssetUsingUrl(uploadId, upload.url, file)
        }

        removeUploadInstance(uploadedPlungeModelInfo?.id, uploadId)

        if (action === 'edit' && payload?.itemData?.[key]) {
          try {
            await removeAssetFromMux(payload.itemData[key])
          } catch (error) {
            console.error('Failed to remove previous MUX audio asset:', error)
          }
        }
      }
    })

    addUploadInstance(uploadedPlungeModelInfo?.id, uploadId, upload)
    upload.start()
    router?.push('/plunge-models')
    resolve()
  })
}

const plungeService = {
  addPlungeModel,
  fetchAllPlungeModels,
  updatePlungeStatus,
  deletePlungeModel,
  fetchDashboardStats,
  editPlungeModel,
  uploadVideos,
  fetchMuxVideoMeta,
  removeAssetFromMux,
  uploadFileInChunks,
  createAssetUsingUrl
}

export default plungeService
