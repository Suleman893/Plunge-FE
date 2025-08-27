//Third Party Imports
import { createAsyncThunk } from '@reduxjs/toolkit'

//Service Import
import moduleService from '@features/module/service'

export const fetchAllModules = createAsyncThunk('module/all', async (_, thunkAPI) => {
  try {
    return await moduleService.fetchAllModules()
  } catch (error) {
    const errorMessage = 'Failed to fetch all modules'

    return thunkAPI.rejectWithValue(errorMessage)
  }
})
