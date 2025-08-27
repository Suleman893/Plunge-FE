//Third party imports
import { createSlice } from '@reduxjs/toolkit'

//Initial State Imports
import { initialState } from './initialState'

//Reset Action Import
import { resetStore } from '../resetStore'
import { fetchAllProducts, syncProduct } from './thunk'

export const tuyaProductSlice = createSlice({
  name: 'tuyaProduct',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(resetStore, () => initialState)
      .addCase(fetchAllProducts.pending, state => {
        state.isAllProductsLoading = true
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.isAllProductsLoading = false
        state.allProducts = action.payload
      })
      .addCase(fetchAllProducts.rejected, state => {
        state.isAllProductsLoading = false
      })
      .addCase(syncProduct.pending, state => {
        state.isSyncProductLoading = true
      })
      .addCase(syncProduct.fulfilled, state => {
        state.isSyncProductLoading = false
      })
      .addCase(syncProduct.rejected, state => {
        state.isSyncProductLoading = false
      })
  }
})

export default tuyaProductSlice.reducer
