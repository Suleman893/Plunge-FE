//Third Party Imports
import { createAsyncThunk } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import { nanoid } from 'nanoid'

//Service Import
import plungeModelService from '@features/plunge-model/service'

//Reducers Imports
// import { resetPlungeModelUploadProgressById } from './progress/slice'

//Utils and Helpers Imports
import { uploadFileAndGetURL, deleteFileFromBucket } from '@utils/firebaseBucket'
import { muxUploadId } from '@helpers/common'

// import { saveFileToIndexedDB, deleteFilesFromIndexedDB } from '@utils/indexedDB'

//Constants Imports
import { PLUNGE_MODEL_IMG_MAX_SIZE, PLUNGE_MODEL_PIC_TYPE } from '@constants/common'
import httpStatus from '@constants/httpStatus'

export const addPlungeModel = createAsyncThunk('plungeModel/add', async (payload: any, thunkAPI) => {
  try {
    const { fileImg, fileSetupVideo, filePairingVideo, fileTroubleShootVideo, data } = payload

    const dispatch = thunkAPI.dispatch

    // Generate a unique filename for the image using nanoid to prevent name collisions in Firebase Storage
    const imgFileName = `${nanoid()}-${fileImg.name}`

    // Upload image to Firebase Storage and retrieve its public URL
    const photoUrl = await uploadFileAndGetURL(
      fileImg,
      `plunge-models/${imgFileName}`,
      PLUNGE_MODEL_PIC_TYPE,
      PLUNGE_MODEL_IMG_MAX_SIZE
    )

    // If a setup video file && pairing video file is provided, request a upload URL and ID from MUX
    if (photoUrl && fileSetupVideo && filePairingVideo && fileTroubleShootVideo) {
      data.thumbnail = photoUrl
      data.setupVideoUploadId = muxUploadId()
      data.pairingVideoUploadId = muxUploadId()
      data.troubleShootVideoUploadId = muxUploadId()
    }

    //Add the plunge information on backend, video files will be uploaded to MUX in chunks afterward
    const uploadedPlungeModelInfo = await plungeModelService.addPlungeModel(payload)

    if (
      uploadedPlungeModelInfo?.setupVideoUploadId &&
      uploadedPlungeModelInfo?.pairingVideoUploadId &&
      uploadedPlungeModelInfo?.troubleShootVideoUploadId
    ) {
      // const completed = {
      //   setupVideo: false,
      //   pairingVideo: false,
      //   troubleShootVideo: false
      // }

      // Checks if both setup video, pairing video and trouble shoot video have finished uploading.
      // Once both are done, it performs post-upload actions: closes modal, shows toast, resets progress, and redirects.
      // const checkAllComplete = async () => {
      //   if (completed.setupVideo && completed.pairingVideo && completed.troubleShootVideo) {
      //     dispatch(resetPlungeModelUploadProgressById({ id: uploadedPlungeModelInfo.id }))
      //   }
      // }

      // Called when a single video (either setup or pairing) has successfully uploaded.
      // Marks it as complete and then re-evaluates if all required uploads are finished.
      // const onSingleUploadSuccess = (key: 'setupVideo' | 'pairingVideo' | 'troubleShootVideo') => {
      //   completed[key] = true
      //   checkAllComplete()
      // }

      // console.log('onSingleUploadSuccess', onSingleUploadSuccess)

      //Define all video types, files, and upload URLs in one place
      const videoUploads = [
        {
          key: 'setupVideo',
          file: fileSetupVideo,
          uploadId: data.setupVideoUploadId,
          dbKeySuffix: 'setupVideo'
        },
        {
          key: 'pairingVideo',
          file: filePairingVideo,
          uploadId: data.pairingVideoUploadId,
          dbKeySuffix: 'pairingVideo'
        },
        {
          key: 'troubleShootVideo',
          file: fileTroubleShootVideo,
          uploadId: data.troubleShootVideoUploadId,
          dbKeySuffix: 'troubleShootVideo'
        }
      ] as const

      toast.success('Plunge model added successfully')

      //Start all uploads
      await Promise.all(
        videoUploads.map(item =>
          plungeModelService.uploadFileInChunks(
            'add',
            item.file,
            item.uploadId,
            item.key,
            payload,
            dispatch,
            uploadedPlungeModelInfo
          )
        )
      )

      // await saveFileToIndexedDB(
      //   uploadedPlungeModelInfo?.id + 'setup',
      //   uploadIdsAndUrls?.setupVideoUploadUrl,
      //   'plunge-models',
      //   fileSetupVideo
      // )
      // await saveFileToIndexedDB(
      //   uploadedPlungeModelInfo?.id + 'pairing',
      //   uploadIdsAndUrls?.pairingVideoUploadUrl,
      //   'plunge-models',
      //   filePairingVideo
      // )
      // await saveFileToIndexedDB(
      //   uploadedPlungeModelInfo?.id + 'troubleShoot',
      //   uploadIdsAndUrls?.troubleShootVideo,
      //   'plunge-models',
      //   fileTroubleShootVideo
      // )

      // await Promise.all([
      //   plungeModelService.uploadFileInChunks(
      //     'add',
      //     fileSetupVideo,
      //     uploadIdsAndUrls.setupVideoUploadUrl,
      //     'setupVideo',
      //     payload,
      //     dispatch,
      //     uploadedPlungeModelInfo,
      //     onSingleUploadSuccess
      //   ),
      //   plungeModelService.uploadFileInChunks(
      //     'add',
      //     filePairingVideo,
      //     uploadIdsAndUrls.pairingVideoUploadUrl,
      //     'pairingVideo',
      //     payload,
      //     dispatch,
      //     uploadedPlungeModelInfo,
      //     onSingleUploadSuccess
      //   ),
      //   plungeModelService.uploadFileInChunks(
      //     'add',
      //     fileTroubleShootVideo,
      //     uploadIdsAndUrls.troubleShootVideoUploadUrl,
      //     'troubleShootVideo',
      //     payload,
      //     dispatch,
      //     uploadedPlungeModelInfo,
      //     onSingleUploadSuccess
      //   )
      // ])
    }
  } catch (error: any) {
    console.log('The error', error)
    let errorMessage: string = 'Failed to add plunge model'

    if (error.status === httpStatus.CONFLICT) {
      errorMessage = 'Plunge model already exist'
    }

    if (error.status === httpStatus.BAD_REQUEST) {
      errorMessage = error?.response?.data?.message || 'Plunge model already exist'
    }

    toast.error(errorMessage)

    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const fetchAllPlungeModels = createAsyncThunk(
  'plungeModel/fetch-all-products',
  async (payload: any, thunkAPI) => {
    try {
      return await plungeModelService.fetchAllPlungeModels(payload)
    } catch (error: any) {
      const errorMessage: string = 'Failed to fetch all product models'

      return thunkAPI.rejectWithValue(errorMessage)
    }
  }
)

export const updatePlungeStatus = createAsyncThunk(
  'plungeModel/update-plunge-status',
  async (payload: any, thunkAPI) => {
    try {
      return await plungeModelService.updatePlungeStatus(payload)
    } catch (error: any) {
      const errorMessage: string = 'Failed to update status'

      toast.error(errorMessage)

      return thunkAPI.rejectWithValue(errorMessage)
    }
  }
)

export const deletePlungeModel = createAsyncThunk('plungeModel/delete-plunge-model', async (payload: any, thunkAPI) => {
  try {
    const { selectedItem } = payload

    // if (selectedItem?.pairingVideo && selectedItem?.setupVideo) {
    //   try {
    //     await plungeModelService.removeAssetFromMux(selectedItem?.pairingVideo)
    //     await plungeModelService.removeAssetFromMux(selectedItem?.setupVideo)
    //   } catch (err) {
    //     console.error('Failed to remove Mux assets:', err)
    //   }
    // }

    //Remove video from indexedDB
    // try {
    //   await deleteFilesFromIndexedDB(selectedItem.id)
    // } catch (err) {
    //   console.error(`Failed to delete from IndexedDB for video ID ${selectedItem.id}:`, err)
    // }

    if (selectedItem?.thumbnail) {
      await deleteFileFromBucket(selectedItem?.thumbnail)
    }

    return await plungeModelService.deletePlungeModel(payload)
  } catch (error: any) {
    const errorMessage: string = 'Failed to delete plunge model'

    toast.error(errorMessage)

    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const fetchDashboardStats = createAsyncThunk('plungeModel/fetch-dashboard-stats', async (_, thunkAPI) => {
  try {
    return await plungeModelService.fetchDashboardStats()
  } catch (error: any) {
    const errorMessage: string = 'Failed to fetch dashboard stats'

    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const editPlungeModel = createAsyncThunk('plungeModel/edit', async (payload: any, thunkAPI) => {
  try {
    const { fileImg, fileSetupVideo, filePairingVideo, fileTroubleShootVideo, data } = payload

    const dispatch = thunkAPI.dispatch

    if (fileImg && fileImg instanceof File) {
      await deleteFileFromBucket(data?.thumbnail)

      // Generate a unique filename for the image using nanoid to prevent name collisions in Firebase Storage
      const imgFileName = `${nanoid()}-${fileImg.name}`

      // Upload image to Firebase Storage and retrieve its public URL
      const photoUrl = await uploadFileAndGetURL(
        fileImg,
        `plunge-models/${imgFileName}`,
        PLUNGE_MODEL_PIC_TYPE,
        PLUNGE_MODEL_IMG_MAX_SIZE
      )

      data.thumbnail = photoUrl
    }

    // Store upload IDs, to be used for uploading the video later
    let uploadIds: any = {}

    // If a setup video file is provided
    if (fileSetupVideo && fileSetupVideo instanceof File) {
      const setupVideoUploadId = muxUploadId()

      uploadIds = { ...uploadIds, setupVideoUploadId }
      data.setupVideoUploadId = setupVideoUploadId
    }

    // If a pairing video file is provided
    if (filePairingVideo && filePairingVideo instanceof File) {
      const pairingVideoUploadId = muxUploadId()

      uploadIds = { ...uploadIds, pairingVideoUploadId }
      data.pairingVideoUploadId = pairingVideoUploadId
    }

    // If a trouble shoot video file is provided
    if (fileTroubleShootVideo && fileTroubleShootVideo instanceof File) {
      const troubleShootVideoUploadId = muxUploadId()

      uploadIds = { ...uploadIds, troubleShootVideoUploadId }
      data.troubleShootVideoUploadId = troubleShootVideoUploadId
    }

    //Edit the plunge information on backend, video files will be uploaded later
    const updatedData = await plungeModelService.editPlungeModel(
      payload,
      fileSetupVideo,
      filePairingVideo,
      fileTroubleShootVideo
    )

    // If no new setup or pairing video or trouble shoot video was provided, return the updated data without uploading to MUX
    if (!uploadIds?.setupVideoUploadId && !uploadIds?.pairingVideoUploadId && !uploadIds?.troubleShootVideoUploadId) {
      return updatedData
    }

    // If both setup and pairing videos need to be uploaded to MUX
    // if (
    //   uploadIdsAndUrls?.setupVideoUploadUrl &&
    //   uploadIdsAndUrls?.pairingVideoUploadUrl &&
    //   uploadIdsAndUrls?.troubleShootVideoUploadUrl
    // ) {
    //   const completed = {
    //     setupVideo: false,
    //     pairingVideo: false,
    //     troubleShootVideo: false
    //   }

    // Checks if both setup and pairing videos have finished uploading.
    // Once both are done, it performs post-upload actions: closes modal, shows toast, resets progress, and redirects.
    // const checkAllComplete = async () => {
    //   if (completed.setupVideo && completed.pairingVideo && completed.troubleShootVideo) {
    //     // When both successfully uploaded then only, remove the previously uploaded both files from MUX after the current upload has succeeded
    //     if (
    //       payload?.itemData?.pairingVideo &&
    //       payload?.itemData?.setupVideo &&
    //       payload?.itemData?.troubleShootVideo
    //     ) {
    //       try {
    //         await plungeModelService.removeAssetFromMux(payload?.itemData?.pairingVideo)
    //         await plungeModelService.removeAssetFromMux(payload?.itemData?.setupVideo)
    //         await plungeModelService.removeAssetFromMux(payload?.itemData?.troubleShootVideo)
    //       } catch (error) {
    //         console.error('Failed to remove previous MUX asset:', error)
    //       }
    //     }

    //     dispatch(resetPlungeModelUploadProgress({ id: updatedData.id }))

    //     await deleteFilesFromIndexedDB(updatedData.id)

    //     // return toast.success('Video uploaded successfully')
    //   }
    // }

    // Called when a single video (either setup or pairing) has successfully uploaded.
    // Marks it as complete and then re-evaluates if all required uploads are finished.
    // const onSingleUploadSuccess = async (key: 'setupVideo' | 'pairingVideo' | 'troubleShootVideo') => {
    //   completed[key] = true
    //   await checkAllComplete()
    // }

    //Define all video types, files, and upload URLs in one place
    // const videoUploads = [
    //   {
    //     key: 'setupVideo',
    //     file: fileSetupVideo,
    //     uploadUrl: uploadIdsAndUrls.setupVideoUploadUrl,
    //     dbKeySuffix: 'setupVideo'
    //   },
    //   {
    //     key: 'pairingVideo',
    //     file: filePairingVideo,
    //     uploadUrl: uploadIdsAndUrls.pairingVideoUploadUrl,
    //     dbKeySuffix: 'pairingVideo'
    //   },
    //   {
    //     key: 'troubleShootVideo',
    //     file: fileTroubleShootVideo,
    //     uploadUrl: uploadIdsAndUrls.troubleShootVideoUploadUrl,
    //     dbKeySuffix: 'troubleShootVideo'
    //   }
    // ] as const

    //Save all files to IndexedDB
    // await Promise.all(
    //   videoUploads.map(item =>
    //     saveFileToIndexedDB(`${updatedData?.id}_${item.dbKeySuffix}`, item.uploadUrl, 'plunge-models', item.file)
    //   )
    // )
    // toast.success('Plunge model updated successfully')

    //Start all uploads
    // await Promise.all(
    //   videoUploads.map(item =>
    //     plungeModelService.uploadFileInChunks(
    //       'add',
    //       item.file,
    //       item.uploadUrl,
    //       item.key,
    //       payload,
    //       dispatch,
    //       updatedData,
    //       onSingleUploadSuccess
    //     )
    //   )
    // )

    // await Promise.all([
    //   plungeModelService.uploadFileInChunks(
    //     'edit',
    //     fileSetupVideo,
    //     uploadIdsAndUrls.setupVideoUploadUrl,
    //     'setupVideo',
    //     payload,
    //     dispatch,
    //     updatedData,
    //     onSingleUploadSuccess
    //   ),
    //   plungeModelService.uploadFileInChunks(
    //     'edit',
    //     filePairingVideo,
    //     uploadIdsAndUrls.pairingVideoUploadUrl,
    //     'pairingVideo',
    //     payload,
    //     dispatch,
    //     updatedData,
    //     onSingleUploadSuccess
    //   ),
    //   plungeModelService.uploadFileInChunks(
    //     'edit',
    //     fileTroubleShootVideo,
    //     uploadIdsAndUrls.troubleShootVideoUploadUrl,
    //     'troubleShootVideo',
    //     payload,
    //     dispatch,
    //     updatedData,
    //     onSingleUploadSuccess
    //   )
    // ])
    // } else {
    // If only the setup video needs to be uploaded to MUX
    if (uploadIds?.setupVideoUploadId) {
      //   await saveFileToIndexedDB(
      //   `${updatedData?.id}_setupVideo`,
      //   uploadIdsAndUrls.setupVideoUploadUrl,
      //   'plunge-models',
      //   fileSetupVideo,
      //   payload.itemData.setupVideo
      // )
      await plungeModelService.uploadFileInChunks(
        'edit',
        fileSetupVideo,
        uploadIds.setupVideoUploadId,
        'setupVideo',
        payload,
        dispatch,
        updatedData
      )
    }

    // If only the pairing video needs to be uploaded to MUX
    if (uploadIds?.pairingVideoUploadId) {
      // await saveFileToIndexedDB(
      //   `${updatedData?.id}_pairingVideo`,
      //   uploadIds.pairingVideoUploadId,
      //   'plunge-models',
      //   filePairingVideo,
      //   payload.itemData.pairingVideo
      // )
      await plungeModelService.uploadFileInChunks(
        'edit',
        filePairingVideo,
        uploadIds.pairingVideoUploadId,
        'pairingVideo',
        payload,
        dispatch,
        updatedData
      )
    }

    // If only the trouble shoot video needs to be uploaded to MUX
    if (uploadIds?.troubleShootVideoUploadId) {
      // await saveFileToIndexedDB(
      //   `${updatedData?.id}_troubleShootVideo`,
      //   uploadIdsAndUrls.troubleShootVideoUploadUrl,
      //   'plunge-models',
      //   fileTroubleShootVideo,
      //   payload.itemData.troubleShootVideo
      // )
      await plungeModelService.uploadFileInChunks(
        'edit',
        fileTroubleShootVideo,
        uploadIds.troubleShootVideoUploadId,
        'troubleShootVideo',
        payload,
        dispatch,
        updatedData
      )
    }

    toast.success('Plunge model updated successfully')

    // }
  } catch (error: any) {
    console.log('The error', error)

    const errorMessage: string = 'Failed to update'

    toast.error(errorMessage)

    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const fetchMuxVideoMeta = createAsyncThunk(
  'plungeModel/fetch-mux-video-meta',
  async (payload: any, thunkAPI) => {
    try {
      return await plungeModelService.fetchMuxVideoMeta(payload)
    } catch (error: any) {
      const errorMessage: string = 'Failed to fetch video meta from mux'

      return thunkAPI.rejectWithValue(errorMessage)
    }
  }
)
