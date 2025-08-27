//Third Party Imports
import { createAsyncThunk } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

//API Service Import
import roleService from '@features/role/service'

//Constants Imports
import httpStatus from '@constants/httpStatus'

export const addRole = createAsyncThunk('role/add', async (payload: any, thunkAPI) => {
  try {
    return await roleService.addRole(payload)
  } catch (error: any) {
    let errorMessage: string = 'Failed to add role'

    if (error.status === httpStatus.CONFLICT) {
      errorMessage = 'Role with this name already exist'
    }

    toast.error(errorMessage)

    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const fetchRoles = createAsyncThunk('role/fetchAllRoles', async (_, thunkAPI) => {
  try {
    return await roleService.fetchRoles()
  } catch (error) {
    const errorMessage = 'Failed to fetch all roles'

    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const fetchRoleInfo = createAsyncThunk('role/fetchRoleInfo', async (payload: any, thunkAPI) => {
  try {
    return await roleService.fetchRoleInfo(payload)
  } catch (error) {
    const errorMessage = 'Failed to fetch role info'

    return thunkAPI.rejectWithValue(errorMessage)
  }
})

export const editRole = createAsyncThunk('role/edit', async (payload: any, thunkAPI) => {
  try {
    return await roleService.editRole(payload)
  } catch (error: any) {
    let errorMessage: string = 'Failed to update role'

    if (error.status === httpStatus.CONFLICT) {
      errorMessage = 'Role with this name already exist'
    }

    toast.error(errorMessage)

    return thunkAPI.rejectWithValue(errorMessage)
  }
})
