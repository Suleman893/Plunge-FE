//Third party imports
import { createSlice } from '@reduxjs/toolkit'

//Initial States Imports
import { initialState } from './initialState'

export const videoProgressSlice = createSlice({
  name: 'videoProgress',
  initialState,
  reducers: {
    setVideoUploadProgress: (state, action) => {
      const { id, progress, isPaused = false } = action.payload
      const existing = state.uploadProgressList.find((item: any) => item.id === id)

      if (existing) {
        existing.progress = progress
        existing.isPaused = isPaused
      } else {
        state.uploadProgressList.push(action.payload)
      }

      localStorage.removeItem('pausedVideoIds')
    },
    markAllVideoUploadsPaused: state => {
      state.uploadProgressList.forEach((item: any) => {
        item.isPaused = true
      })
    },
    resetVideoUploadProgress: (state, action) => {
      const { id } = action.payload

      state.uploadProgressList = state.uploadProgressList.filter((item: any) => item.id !== id)
    }
  }
})

export const { setVideoUploadProgress, resetVideoUploadProgress, markAllVideoUploadsPaused } =
  videoProgressSlice.actions
export default videoProgressSlice.reducer
