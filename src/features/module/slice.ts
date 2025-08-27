//Third party imports
import { createSlice } from '@reduxjs/toolkit'

//Thunks Imports
import { fetchAllModules } from './thunk'

//Initial States Imports
import { initialState } from './initialState'

//Reset Action Import
import { resetStore } from '../resetStore'

export const moduleSlice = createSlice({
  name: 'module',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(resetStore, () => initialState)
      .addCase(fetchAllModules.pending, state => {
        state.isAllModulesLoading = true
      })
      .addCase(fetchAllModules.fulfilled, (state, action) => {
        state.isAllModulesLoading = false
        state.allModules = action.payload
      })
      .addCase(fetchAllModules.rejected, state => {
        state.isAllModulesLoading = false
      })
  }
})

export default moduleSlice.reducer
