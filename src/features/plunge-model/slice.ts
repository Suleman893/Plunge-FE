//Third party imports
import { createSlice } from '@reduxjs/toolkit'

//Thunks Imports
import {
  addPlungeModel,
  fetchAllPlungeModels,
  updatePlungeStatus,
  deletePlungeModel,
  fetchDashboardStats,
  editPlungeModel,
  fetchMuxVideoMeta
} from './thunk'

//Initial States Imports
import { initialState } from './initialState'

//Reset Action Import
import { resetStore } from '@features/resetStore'

export const plungeModelSlice = createSlice({
  name: 'plungeModel',
  initialState,
  reducers: {
    storePlungeInfo: (state, action) => {
      state.plungeModelInfo = action.payload
    }
  },
  extraReducers: builder => {
    builder
      .addCase(resetStore, () => initialState)
      .addCase(addPlungeModel.pending, state => {
        state.isAddPlungeModelLoading = true
      })
      .addCase(addPlungeModel.fulfilled, state => {
        state.isAddPlungeModelLoading = false
      })
      .addCase(addPlungeModel.rejected, state => {
        state.isAddPlungeModelLoading = false
      })
      .addCase(fetchAllPlungeModels.pending, state => {
        state.isAllPlungeModelLoading = true
      })
      .addCase(fetchAllPlungeModels.fulfilled, (state, action) => {
        state.isAllPlungeModelLoading = false
        state.allPlungeModels = action.payload
      })
      .addCase(fetchAllPlungeModels.rejected, state => {
        state.isAllPlungeModelLoading = false
      })
      .addCase(updatePlungeStatus.pending, state => {
        state.isPlungeStatusUpdateLoading = true
      })
      .addCase(updatePlungeStatus.fulfilled, state => {
        state.isPlungeStatusUpdateLoading = false
        state.isPlungeStatusUpdateSuccess = !state.isPlungeStatusUpdateSuccess
      })
      .addCase(updatePlungeStatus.rejected, state => {
        state.isPlungeStatusUpdateLoading = false
      })
      .addCase(deletePlungeModel.pending, state => {
        state.isPlungeDeleteLoading = true
      })
      .addCase(deletePlungeModel.fulfilled, state => {
        state.isPlungeDeleteLoading = false
        state.isPlungeDeleteSuccess = !state.isPlungeDeleteSuccess
      })
      .addCase(deletePlungeModel.rejected, state => {
        state.isPlungeDeleteLoading = false
      })
      .addCase(fetchDashboardStats.pending, state => {
        state.isDashboardStatsLoading = true
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.isDashboardStatsLoading = false
        state.dashboardStats = action.payload
      })
      .addCase(fetchDashboardStats.rejected, state => {
        state.isDashboardStatsLoading = false
      })
      .addCase(editPlungeModel.pending, state => {
        state.isEditPlungeModelLoading = true
      })
      .addCase(editPlungeModel.fulfilled, (state, action) => {
        state.isEditPlungeModelLoading = false
        state.plungeModelInfo = action.payload
      })
      .addCase(editPlungeModel.rejected, state => {
        state.isEditPlungeModelLoading = false
      })
      .addCase(fetchMuxVideoMeta.pending, state => {
        state.isMuxVideoMetaLoading = true
      })
      .addCase(fetchMuxVideoMeta.fulfilled, state => {
        state.isMuxVideoMetaLoading = false
      })
      .addCase(fetchMuxVideoMeta.rejected, state => {
        state.isMuxVideoMetaLoading = false
      })
  }
})

export const { storePlungeInfo } = plungeModelSlice.actions
export default plungeModelSlice.reducer
