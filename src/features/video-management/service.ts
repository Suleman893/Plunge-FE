//Third Party Imports
import { toast } from 'react-toastify'
import * as tus from 'tus-js-client'

// import * as UpChunk from '@mux/upchunk'

//Config Imports
import { envConfig } from '@configs/envConfig'

//Helper and Utils Imports
import { getMuxPlaybackIdFromUrl } from '@helpers/common'
import { ProtectedAPI } from '@utils/apiInterceptor'
import { generateQueryParams } from '@utils/common'
import { getFirebasePublicUrl } from '@utils/firebaseBucket'

//Constants Imports
import httpStatus from '@constants/httpStatus'
import { UPLOAD_CHUNK, FILE_UPLOAD_RETRY_BACKOFF_MS } from '@constants/common'

//Reducers Imports
import { setVideoUploadProgress, resetVideoUploadProgress } from './progress/slice'

//Mux implementation
// const uploadFileInChunks = (
//   action: 'add' | 'edit',
//   file: File,
//   uploadUrl: string,
//   payload: any,
//   dispatch: any,
//   uploadedVideoInfo?: any
// ): Promise<void> => {
//   const { handleClose, addUploadInstance, removeUploadInstance } = payload

//   return new Promise((resolve, reject) => {
//     const upload = UpChunk.createUpload({
//       endpoint: uploadUrl, // The Mux uploadUrl from backend
//       file,
//       chunkSize: UPLOAD_CHUNK
//     })

//     upload.on('progress', event => {
//       dispatch(setVideoUploadProgress({ id: uploadedVideoInfo.id, progress: event.detail }))
//     })
//     addUploadInstance(uploadedVideoInfo.id, upload)
//     resolve()
//     handleClose()

//     upload.on('success', async () => {
//       dispatch(resetVideoUploadProgress({ id: uploadedVideoInfo.id }))
//       await deleteFileFromIndexedDB(uploadedVideoInfo.id)
//       removeUploadInstance(uploadedVideoInfo.id)

//       // In edit action, attempt to remove the previously uploaded MUX video asset after a successful upload.
//       // Wrapped in try-catch to avoid breaking the upload flow if deletion fails.
//       if (action === 'edit' && payload?.itemData?.video) {
//         try {
//           await removeAssetFromMux(payload.itemData.video)
//         } catch (error) {
//           console.error('Failed to remove previous MUX video asset:', error)
//         }
//       }

//       // resolve()
//     })

//     upload.on('error', async event => {
//       // try {
//       //   // If action is 'add', delete the newly created record from the database (cleanup on failure)
//       //   // Wrapped in try-catch to avoid breaking the upload flow if deletion fails.
//       //   if (action === 'add' && uploadedVideoInfo?.id) {
//       //     try {
//       //       await ProtectedAPI.delete(`/admin/video/delete/${uploadedVideoInfo.id}`)
//       //     } catch (err) {
//       //       console.log('The error', err)
//       //     }
//       //   }
//       // } catch (error) {
//       //   console.error('Failed to delete video from database', error)
//       // }

//       // dispatch(resetUploadProgress({ id: uploadedVideoInfo.id }))
//       // await deleteFileFromIndexedDB(uploadedVideoInfo.id)

//       console.log('The error from mux video upload', event)
//       reject(new Error('Upload to Mux failed.'))
//     })
//   })
// }

//Tus (Not final) Implementation
// const uploadFileInChunks = (
//   action: 'add' | 'edit',
//   file: File,
//   uploadUrl: string,
//   payload: any,
//   dispatch: any,
//   uploadedVideoInfo?: any
// ): Promise<void> => {
//   const { handleClose, itemData } = payload

//   console.log('The uploadUrl', uploadUrl)

//   return new Promise((resolve, reject) => {
//     const tusUpload = new Upload(file, {
//       endpoint: uploadUrl.trim(),

//       chunkSize: 5 * 1024 * 1024,
//       metadata: {
//         filename: file.name,
//         filetype: file.type
//       },
//       headers: {
//         'Content-Type': file.type //Sometimes needed for Mux (defensive)
//       },
//       onError(error) {
//         console.error('tus-js upload failed:', error)
//         reject(new Error('Upload to Mux failed.'))
//       },

//       onProgress(bytesUploaded, bytesTotal) {
//         const percentage = Math.floor((bytesUploaded / bytesTotal) * 100)

//         console.log(`Uploaded ${percentage}%`)
//         dispatch(setVideoUploadProgress({ id: uploadedVideoInfo.id, progress: percentage }))
//       },

//       onSuccess: async () => {
//         console.log('Upload finished:', tusUpload.url)
//         dispatch(resetVideoUploadProgress({ id: uploadedVideoInfo.id }))
//         await deleteFileFromIndexedDB(uploadedVideoInfo.id)

//         // If edit, remove old asset
//         if (action === 'edit' && itemData?.video) {
//           try {
//             await removeAssetFromMux(itemData.video)
//           } catch (err) {
//             console.error('Failed to remove old Mux asset:', err)
//           }
//         }

//         resolve()
//         handleClose()
//       }
//     })

//     tusUpload.findPreviousUploads().then(previousUploads => {
//       if (previousUploads.length > 0) {
//         tusUpload.resumeFromPreviousUpload(previousUploads[0])
//       }

//       tusUpload.start()
//     })
//   })
// }

//Uppy Implementation
// const uploadFileInChunks = (
//   action: 'add' | 'edit',
//   file: File,
//   uploadUrl: string,
//   payload: any,
//   dispatch: any,
//   uploadedVideoInfo?: any
// ): Promise<void> => {
//   const { handleClose } = payload

//   console.log('The uploadUrl in uppy', uploadUrl)

//   return new Promise((resolve, reject) => {
//     const uppy = new Uppy({
//       autoProceed: true,
//       restrictions: { maxNumberOfFiles: 1 }
//     })

//     uppy.use(Tus, {
//       endpoint: uploadUrl,
//       retryDelays: [0, 1000, 3000, 5000],
//       storeFingerprintForResuming: true,
//       metadata: {
//         filename: file.name,
//         filetype: file.type
//       },
//       headers: {
//         'Content-Type': file.type
//       }
//     })

//     uppy.addFile({
//       name: file.name,
//       type: file.type,
//       data: file
//     })

//     uppy.on('upload-success', (file, response) => {
//       console.log('Upload complete:', response.uploadURL)
//       resolve()
//       handleClose()
//     })

//     uppy.on('upload-progress', (file, progress) => {
//       console.log(`Upload Progress: ${progress}%`)

//       // Dispatch to Redux or update UI as needed
//       dispatch(
//         setVideoUploadProgress({
//           id: uploadedVideoInfo?.id,
//           progress: 1
//         })
//       )
//     })

//     uppy.on('error', error => {
//       console.error('Upload failed in the upchunk:', error)
//       reject(error)
//     })
//   })
// }

// const uploadFileOnUrl = (file: File, url: string) => {
//   axios.put(url, file)
// }

const fetchAllInstructor = async () => {
  const res = await ProtectedAPI.get(`/admin/video/video-instructor/list`)

  if (res.data.status === httpStatus.OK) {
    return res.data.data
  }
}

const fetchAllVideos = async (payload: Record<string, string | number | boolean | null | undefined>) => {
  const query = generateQueryParams(payload)
  const res = await ProtectedAPI.get(`/admin/video/list?${query}`)

  if (res.data.status === httpStatus.OK) {
    return res.data.data
  }
}

const fetchAllFollowupVideos = async (payload: Record<string, string | number | boolean | null | undefined>) => {
  const query = generateQueryParams(payload)
  const res = await ProtectedAPI.get(`/admin/video/follow-up/list?${query}`)

  if (res.data.status === httpStatus.OK) {
    return res.data.data
  }
}

const fetchAllPlaylist = async () => {
  const res = await ProtectedAPI.get(`/admin/video/playlist/list`)

  if (res.data.status === httpStatus.OK) {
    return res.data.data
  }
}

const fetchAllVideoTypes = async () => {
  const res = await ProtectedAPI.get(`/admin/video/video-type/list`)

  if (res.data.status === httpStatus.OK) {
    return res.data.data
  }
}

const uploadVideo = async (file: File) => {
  const res = await ProtectedAPI.post('/admin/video/upload-video', {
    originalFileName: file?.name,
    originalFileSize: file?.size,
    originalFileType: file?.type
  })

  return res.data.data
}

const addVideo = async (payload: any) => {
  const { data } = payload

  const res = await ProtectedAPI.post('/admin/video/create', data)

  if (res.data.status === httpStatus.CREATED) {
    return res.data.data
  }
}

const fetchDashboardStats = async () => {
  const res = await ProtectedAPI.get('/admin/video/stats')

  if (res.data.status === httpStatus.OK) {
    return res.data.data
  }
}

const updateStatus = async (payload: any) => {
  const { id, data, closeModal } = payload

  const res = await ProtectedAPI.put(`/admin/video/update-status/${id}`, data)

  if (res.data.status === httpStatus.OK) {
    closeModal()

    return toast.success(`Video status updated successfully`)
  }
}

const deleteVideo = async (payload: any) => {
  const { itemData, closeModal } = payload

  const id = itemData?.id
  const res = await ProtectedAPI.delete(`/admin/video/delete/${id}`)

  if (res.data.status === httpStatus.OK) {
    closeModal()

    return toast.success(`Video deleted successfully`)
  }
}

const fetchMuxVideoMeta = async (payload: any) => {
  const { id } = payload
  const res = await ProtectedAPI.get(`/admin/video/metadata/${id}`)

  if (res.data.status === httpStatus.OK) {
    return res.data.data
  }
}

const editVideo = async (payload: any, fileVideo: any) => {
  const { id, data, handleClose } = payload
  const res = await ProtectedAPI.put(`/admin/video/update-info/${id}`, data)

  if (res.data.status === httpStatus.OK) {
    if (!fileVideo) {
      toast.success('Video updated successfully')
      handleClose()
    }

    return res.data.data
  }
}

const removeAssetFromMux = async (payload: string | null) => {
  const playbackUrl = payload
  const playbackId = getMuxPlaybackIdFromUrl(playbackUrl)

  const res = await ProtectedAPI.delete(`/admin/video/asset/delete/${playbackId}`)

  if (res.data.status === httpStatus.OK) {
    return true
  }
}

const createAssetUsingUrl = async (uploadedVideoInfo: any, uploadUrl: string, file: File): Promise<any> => {
  const uploadId = uploadUrl.split('/').pop()

  if (!uploadId) {
    throw new Error('Invalid upload URL, cannot extract uploadId.')
  }

  const fileUrl = getFirebasePublicUrl(uploadId)

  try {
    await ProtectedAPI.post('/admin/video/create-asset', {
      fileUrl,
      metadata: {
        originalFileName: file.name,
        originalFileSize: file.size,
        originalFileType: file.type,
        uploadId: uploadedVideoInfo.videoUploadId
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
  uploadedVideoInfo?: any
): Promise<void> => {
  return new Promise(resolve => {
    const { handleClose, addUploadInstance, removeUploadInstance } = payload

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
        return ['tus', uploadedVideoInfo.videoUploadId, file.name, file.type, file.size, file.lastModified].join('-')
      },
      onError: function (error: any) {
        console.error('Upload failed:', error)
      },
      onProgress: function (bytesUploaded, bytesTotal) {
        const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2)

        dispatch(setVideoUploadProgress({ id: uploadedVideoInfo.id, progress: Number(percentage), isPaused: false }))
      },
      onSuccess: async function () {
        try {
          dispatch(resetVideoUploadProgress({ id: uploadedVideoInfo?.id }))

          if (upload.url) {
            await createAssetUsingUrl(uploadedVideoInfo, upload.url, file)
          }

          if (action === 'edit' && payload?.itemData?.video) {
            await removeAssetFromMux(payload.itemData.video)
          }

          removeUploadInstance(uploadedVideoInfo?.id, uploadedVideoInfo?.videoUploadId)
        } catch (err) {
          console.log('The error', err)
        }
      }
    })

    addUploadInstance(uploadedVideoInfo?.id, uploadedVideoInfo?.videoUploadId, upload)
    upload.start()
    handleClose()
    resolve()
  })
}

const videoManagementService = {
  fetchAllInstructor,
  fetchAllVideos,
  fetchAllFollowupVideos,
  fetchAllPlaylist,
  fetchAllVideoTypes,
  uploadVideo,
  addVideo,
  fetchDashboardStats,
  updateStatus,
  deleteVideo,
  fetchMuxVideoMeta,
  editVideo,
  removeAssetFromMux,
  createAssetUsingUrl,
  uploadFileInChunks
}

export default videoManagementService
