//Third Party Imports
import { createAsyncThunk } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import { nanoid } from 'nanoid'

//Service Import
import musicManagementService from '@features/music-management/service'

//Helpers and Utils Imports
import { deleteFileFromBucket, uploadFileAndGetURL } from '@utils/firebaseBucket'
import { muxUploadId } from '@helpers/common'

//Constants Imports
import httpStatus from '@constants/httpStatus'
import { MUSIC_THUMBNAIL_PIC_TYPE, MUSIC_THUMBNAIL_SIZE } from '@constants/common'

//Utils Imports
// import { deleteFileFromIndexedDB, saveFileToIndexedDB } from '@utils/indexedDB'

export const fetchAllPlaylist = createAsyncThunk('musicManagement/fetch-all-playlist', async (_, thunkAPI) => {
  try {
    return await musicManagementService.fetchAllPlaylist()
  } catch (error: any) {
    const errorMessage: string = 'Failed to fetch all music playlist'

    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const fetchAllLicenseTypes = createAsyncThunk('musicManagement/fetch-all-license-types', async (_, thunkAPI) => {
  try {
    return await musicManagementService.fetchAllLicenseTypes()
  } catch (error: any) {
    const errorMessage: string = 'Failed to fetch all license types'

    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const addMusic = createAsyncThunk('musicManagement/add', async (payload: any, thunkAPI) => {
  try {
    const { data, musicThumbnail, fileAudio } = payload

    //Image name in firebase
    const imgFileName = `${nanoid()}-${musicThumbnail?.name}`

    // const imgFileName = `${musicThumbnail.name}`

    const photoUrl = await uploadFileAndGetURL(
      musicThumbnail,
      `music/${imgFileName}`,
      MUSIC_THUMBNAIL_PIC_TYPE,
      MUSIC_THUMBNAIL_SIZE
    )

    data.thumbnail = photoUrl

    //Upload id and url to upload file later on to MUX
    // let uploadIdAndUrl

    // if (data?.thumbnail) {
    //   uploadIdAndUrl = await musicManagementService.uploadAudio(fileAudio)

    //   data.audioUploadId = uploadIdAndUrl?.uploadId
    // }

    // let uploadedMusicInfo

    const uniqueUploadId = muxUploadId()

    if (data?.thumbnail && uniqueUploadId) {
      data.audioUploadId = uniqueUploadId
    }

    let uploadedMusicInfo

    if (data?.audioUploadId) {
      uploadedMusicInfo = await musicManagementService.addMusic(payload)
    }

    if (uniqueUploadId) {
      // await saveFileToIndexedDB(String(uploadedMusicInfo?.id), uploadIdAndUrl?.uploadUrl, 'music', fileAudio, undefined)
      toast.success('Music added successfully')

      //Upload file on URL
      await musicManagementService.uploadFileInChunks('add', fileAudio, payload, thunkAPI.dispatch, uploadedMusicInfo)
    }
  } catch (error: any) {
    console.log('The error', error)
    let errorMessage: string = 'Failed to add music'

    if (error.status === httpStatus.CONFLICT) {
      errorMessage = 'Music already exist in playlist'
    }

    toast.error(errorMessage)

    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const editMusic = createAsyncThunk('musicManagement/edit', async (payload: any, thunkAPI) => {
  try {
    const { data, itemData, musicThumbnail, fileAudio } = payload

    if (musicThumbnail) {
      //Image name in firebase
      const imgFileName = `${nanoid()}-${musicThumbnail.name}`

      // const imgFileName = `${musicThumbnail.name}`

      const photoUrl = await uploadFileAndGetURL(
        musicThumbnail,
        `music/${imgFileName}`,
        MUSIC_THUMBNAIL_PIC_TYPE,
        MUSIC_THUMBNAIL_SIZE
      )

      data.thumbnail = photoUrl

      //Remove thumbnail from firebase
      if (itemData?.thumbnail) {
        await deleteFileFromBucket(itemData?.thumbnail)
      }
    }

    //Upload id and url to upload file later on to MUX
    // let uploadIdAndUrl
    let uniqueUploadId

    if (fileAudio) {
      uniqueUploadId = muxUploadId()
      payload.data.audioUploadId = uniqueUploadId
    }

    const updatedUploadedMusicInfo = await musicManagementService.editMusic(payload, fileAudio)

    if (fileAudio && uniqueUploadId) {
      // await saveFileToIndexedDB(String(itemData?.id), uploadIdAndUrl?.uploadUrl, 'music', fileAudio, itemData?.audio)
      toast.success('Music updated successfully')

      //Upload file in chunks to mux
      await musicManagementService.uploadFileInChunks(
        'edit',
        fileAudio,
        payload,
        thunkAPI.dispatch,
        updatedUploadedMusicInfo
      )
    }
  } catch (error: any) {
    console.log('The error', error)
    let errorMessage: string = 'Failed to update music'

    if (error.status === httpStatus.CONFLICT) {
      errorMessage = 'Music already exist in playlist'
    }

    toast.error(errorMessage)

    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const fetchAllMusics = createAsyncThunk('musicManagement/fetch-all-musics', async (payload: any, thunkAPI) => {
  try {
    return await musicManagementService.fetchAllMusics(payload)
  } catch (error: any) {
    const errorMessage: string = 'Failed to fetch all musics'

    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const fetchDashboardStats = createAsyncThunk('musicManagement/fetch-dashboard-stats', async (_, thunkAPI) => {
  try {
    return await musicManagementService.fetchDashboardStats()
  } catch (error: any) {
    const errorMessage: string = 'Failed to fetch dashboard stats'

    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const updateStatus = createAsyncThunk('musicManagement/update-status', async (payload: any, thunkAPI) => {
  try {
    return await musicManagementService.updateStatus(payload)
  } catch (error: any) {
    const errorMessage: string = 'Failed to update status'

    toast.error(errorMessage)

    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const deleteMusic = createAsyncThunk('musicManagement/delete-music', async (payload: any, thunkAPI) => {
  try {
    const { itemData } = payload

    //Remove music from mux
    // if (itemData?.audio) {
    //   await musicManagementService.removeAssetFromMux(itemData?.audio)
    // }

    //Remove video from indexedDB
    // try {
    //   await deleteFileFromIndexedDB(itemData.id)
    // } catch (err) {
    //   console.error(`Failed to delete from IndexedDB for video ID ${itemData.id}:`, err)
    // }

    //Remove photo from firebase
    await deleteFileFromBucket(itemData?.thumbnail)

    return await musicManagementService.deleteMusic(payload)
  } catch (error: any) {
    console.log('The error', error)
    const errorMessage: string = 'Failed to delete music'

    toast.error(errorMessage)

    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const fetchMuxAudioMeta = createAsyncThunk(
  'musicManagement/fetch-mux-audio-meta',
  async (payload: any, thunkAPI) => {
    try {
      return await musicManagementService.fetchMuxAudioMeta(payload)
    } catch (error: any) {
      const errorMessage: string = 'Failed to fetch audio meta from mux'

      return thunkAPI.rejectWithValue(errorMessage)
    }
  }
)
