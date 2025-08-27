//Third party imports
import { createSlice } from '@reduxjs/toolkit'

//Initial States Imports
import { initialState } from './initialState'

export const plungeModelProgressSlice = createSlice({
  name: 'plungeModelProgress',
  initialState,
  reducers: {
    setPlungeModelUploadProgress: (state, action) => {
      const { id, key, progress, isPaused = false } = action.payload
      const existing = state.uploadProgressList.find((item: any) => item.id === id)

      if (existing) {
        existing.progress[key] = { progress, isPaused }
      } else {
        state.uploadProgressList.push({
          id,
          progress: {
            [key]: { progress, isPaused }
          }
        })
      }

      const pausedPlungeIds = new Set(JSON.parse(localStorage.getItem('pausedPlungeModelIds') || '[]'))

      if (isPaused) {
        pausedPlungeIds.add(id)
      } else {
        pausedPlungeIds.delete(id)
      }

      localStorage.setItem('pausedPlungeModelIds', JSON.stringify([...pausedPlungeIds]))
    },
    resetPlungeModelUploadProgressById: (state, action) => {
      const { id } = action.payload

      if (id) {
        state.uploadProgressList = state.uploadProgressList.filter((item: any) => item.id !== id)
      }
    },

    resetPlungeModelUploadProgressByKey: (state, action) => {
      const { id, key } = action.payload

      const itemIndex = state.uploadProgressList.findIndex((item: any) => item.id === id)

      if (itemIndex !== -1) {
        const progressItem = state.uploadProgressList[itemIndex]

        if (progressItem.progress?.[key]) {
          delete progressItem.progress[key]
        }

        // If no other keys remain in progress object, remove the entire item
        const remainingKeys = Object.keys(progressItem.progress)

        if (remainingKeys.length === 0) {
          state.uploadProgressList.splice(itemIndex, 1)
        }
      }
    }
  }
})

export const { setPlungeModelUploadProgress, resetPlungeModelUploadProgressById, resetPlungeModelUploadProgressByKey } =
  plungeModelProgressSlice.actions
export default plungeModelProgressSlice.reducer
