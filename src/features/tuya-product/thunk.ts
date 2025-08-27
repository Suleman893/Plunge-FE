//Third Party Imports
import { createAsyncThunk } from '@reduxjs/toolkit'

//API Service Import
import tuyaProductService from '@features/tuya-product/service'

export const fetchAllProducts = createAsyncThunk('tuyaProduct/fetch-all-products', async (payload: any, thunkAPI) => {
  try {
    return await tuyaProductService.fetchAllProducts(payload)
  } catch (error: any) {
    const errorMessage: string = 'Failed to fetch all products'

    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const syncProduct = createAsyncThunk('tuyaProduct/sync-product', async (_, thunkAPI) => {
  try {
    return await tuyaProductService.syncProduct()
  } catch (error: any) {
    const errorMessage: string = 'Failed to sync product'

    return thunkAPI.rejectWithValue(errorMessage)
  }
})
