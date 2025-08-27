//Third Party Imports
import { createAsyncThunk } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import { nanoid } from 'nanoid'

//Service Import
import videoManagementService from '@features/video-management/service'

//Utils and Helpers Imports
import { deleteFileFromBucket, uploadFileAndGetURL } from '@utils/firebaseBucket'
import { muxUploadId } from '@helpers/common'

//Constants Imports
import httpStatus from '@constants/httpStatus'
import { VIDEO_THUMBNAIL_PIC_TYPE, VIDEO_THUMBNAIL_SIZE } from '@constants/common'

export const fetchAllInstructor = createAsyncThunk('videoManagement/fetch-all-instructor', async (_, thunkAPI) => {
  try {
    return await videoManagementService.fetchAllInstructor()
  } catch (error: any) {
    const errorMessage: string = 'Failed to fetch all instructors'

    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const fetchAllPlaylist = createAsyncThunk('videoManagement/fetch-all-playlist', async (_, thunkAPI) => {
  try {
    return await videoManagementService.fetchAllPlaylist()
  } catch (error: any) {
    const errorMessage: string = 'Failed to fetch all video playlist'

    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const fetchAllVideoTypes = createAsyncThunk('videoManagement/fetch-all-video-types', async (_, thunkAPI) => {
  try {
    return await videoManagementService.fetchAllVideoTypes()
  } catch (error: any) {
    const errorMessage: string = 'Failed to fetch all video types'

    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const addVideo = createAsyncThunk('videoManagement/add', async (payload: any, thunkAPI) => {
  try {
    const { data, videoThumbnail, fileVideo, followUpVideoIds = [] } = payload

    data.followUpVideoIds = followUpVideoIds

    //Image name in firebase
    const imgFileName = `${nanoid()}-${videoThumbnail?.name}`

    // const imgFileName = `${videoThumbnail.name}`

    const photoUrl = await uploadFileAndGetURL(
      videoThumbnail,
      `video/${imgFileName}`,
      VIDEO_THUMBNAIL_PIC_TYPE,
      VIDEO_THUMBNAIL_SIZE
    )

    data.thumbnail = photoUrl

    const uniqueUploadId = muxUploadId()

    if (data?.thumbnail && uniqueUploadId) {
      // uploadIdAndUrl = await videoManagementService.uploadVideo(fileVideo)
      data.videoUploadId = uniqueUploadId
    }

    let uploadedVideoInfo

    if (data?.videoUploadId) {
      uploadedVideoInfo = await videoManagementService.addVideo(payload)
    }

    if (uniqueUploadId) {
      // await saveFileToIndexedDB(String(uploadedVideoInfo?.id), uploadIdAndUrl?.uploadUrl, 'video', fileVideo, undefined)
      toast.success('Video added successfully')

      //Upload file on URL
      await videoManagementService
        .uploadFileInChunks('add', fileVideo, payload, thunkAPI.dispatch, uploadedVideoInfo)
        .catch(err => {
          console.error('Background upload failed silently:', err)
        })
    }
  } catch (error: any) {
    console.log('The error', error)
    let errorMessage: string = 'Failed to add video'

    if (error.status === httpStatus.CONFLICT) {
      errorMessage = 'Video already exist in playlist'
    }

    toast.error(errorMessage)

    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const editVideo = createAsyncThunk('videoManagement/edit', async (payload: any, thunkAPI) => {
  try {
    const { data, itemData, videoThumbnail, fileVideo, followUpVideoIds = [] } = payload

    data.followUpVideoIds = followUpVideoIds

    if (videoThumbnail) {
      //Image name in firebase
      const imgFileName = `${nanoid()}-${videoThumbnail.name}`

      //const imgFileName = `{videoThumbnail.name}`

      const photoUrl = await uploadFileAndGetURL(
        videoThumbnail,
        `video/${imgFileName}`,
        VIDEO_THUMBNAIL_PIC_TYPE,
        VIDEO_THUMBNAIL_SIZE
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

    if (fileVideo) {
      uniqueUploadId = muxUploadId()
      payload.data.videoUploadId = uniqueUploadId
    }

    const updatedUploadedVideoInfo = await videoManagementService.editVideo(payload, fileVideo)

    if (fileVideo && uniqueUploadId) {
      // await saveFileToIndexedDB(String(itemData?.id), uploadIdAndUrl?.uploadUrl, 'video', fileVideo, itemData?.video)
      toast.success('Video updated successfully')

      //Upload file in chunks to mux
      await videoManagementService.uploadFileInChunks(
        'edit',
        fileVideo,
        payload,
        thunkAPI.dispatch,
        updatedUploadedVideoInfo
      )
    }
  } catch (error: any) {
    console.log('The error', error)
    let errorMessage: string = 'Failed to update video'

    if (error.status === httpStatus.CONFLICT) {
      errorMessage = 'Video already exist in playlist'
    }

    toast.error(errorMessage)

    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const fetchAllVideos = createAsyncThunk('videoManagement/fetch-all-videos', async (payload: any, thunkAPI) => {
  try {
    return await videoManagementService.fetchAllVideos(payload)
  } catch (error: any) {
    const errorMessage: string = 'Failed to fetch all videos'

    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const fetchAllVideosOptions = createAsyncThunk(
  'videoManagement/fetch-all-followup',
  async (payload: any, thunkAPI) => {
    try {
      return await videoManagementService.fetchAllFollowupVideos(payload)
    } catch (error: any) {
      const errorMessage: string = 'Failed to fetch all videos'

      return thunkAPI.rejectWithValue(errorMessage)
    }
  }
)

export const fetchDashboardStats = createAsyncThunk('videoManagement/fetch-dashboard-stats', async (_, thunkAPI) => {
  try {
    return await videoManagementService.fetchDashboardStats()
  } catch (error: any) {
    const errorMessage: string = 'Failed to fetch dashboard stats'

    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const updateStatus = createAsyncThunk('videoManagement/update-status', async (payload: any, thunkAPI) => {
  try {
    return await videoManagementService.updateStatus(payload)
  } catch (error: any) {
    const errorMessage: string = 'Failed to update status'

    toast.error(errorMessage)

    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const deleteVideo = createAsyncThunk('videoManagement/delete-video', async (payload: any, thunkAPI) => {
  try {
    const { itemData } = payload

    //Remove video from indexedDB
    // try {
    //   await deleteFileFromIndexedDB(itemData.id)
    // } catch (err) {
    //   console.error(`Failed to delete from IndexedDB for video ID ${itemData.id}:`, err)
    // }

    //Remove photo from firebase
    await deleteFileFromBucket(itemData?.thumbnail)

    return await videoManagementService.deleteVideo(payload)
  } catch (error: any) {
    console.log('The error', error)
    const errorMessage: string = 'Failed to delete video'

    toast.error(errorMessage)

    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const fetchMuxVideoMeta = createAsyncThunk(
  'videoManagement/fetch-mux-video-meta',
  async (payload: any, thunkAPI) => {
    try {
      return await videoManagementService.fetchMuxVideoMeta(payload)
    } catch (error: any) {
      const errorMessage: string = `Failed to fetch video meta from mux`

      return thunkAPI.rejectWithValue(errorMessage)
    }
  }
)
