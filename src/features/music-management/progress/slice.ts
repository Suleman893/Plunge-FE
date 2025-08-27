//Third party imports
import { createSlice } from '@reduxjs/toolkit'

//Initial States Imports
import { initialState } from './initialState'

export const musicProgressSlice = createSlice({
  name: 'musicProgress',
  initialState,
  reducers: {
    setMusicUploadProgress: (state, action) => {
      const { id, isPaused = false } = action.payload
      const existing = state.uploadProgressList.find((item: any) => item.id === id)

      if (existing) {
        existing.progress = action.payload.progress
        existing.isPaused = isPaused
      } else {
        state.uploadProgressList.push(action.payload)
      }

      localStorage.removeItem('pausedMusicIds')
    },
    markAllMusicUploadsPaused: state => {
      state.uploadProgressList.forEach((item: any) => {
        item.isPaused = true
      })
    },
    resetMusicUploadProgress: (state, action) => {
      const { id } = action.payload

      state.uploadProgressList = state.uploadProgressList.filter((item: any) => item.id !== id)
    }
  }
})

export const { setMusicUploadProgress, resetMusicUploadProgress } = musicProgressSlice.actions
export default musicProgressSlice.reducer
