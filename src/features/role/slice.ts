//Third party imports
import { createSlice } from '@reduxjs/toolkit'

//Thunks Imports
import { addRole, fetchRoles, fetchRoleInfo, editRole } from './thunk'

//Initial States Imports
import { initialState } from './initialState'

//Reset Action Import
import { resetStore } from '../resetStore'

export const roleSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(resetStore, () => initialState)
      .addCase(addRole.pending, state => {
        state.isAddRoleLoading = true
      })
      .addCase(addRole.fulfilled, state => {
        state.isAddRoleLoading = false
        state.isAddRoleSuccess = !state.isAddRoleSuccess
      })
      .addCase(addRole.rejected, state => {
        state.isAddRoleLoading = false
      })
      .addCase(fetchRoles.pending, state => {
        state.isAllRolesLoading = true
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.isAllRolesLoading = false
        state.allRoles = action.payload
      })
      .addCase(fetchRoles.rejected, state => {
        state.isAllRolesLoading = false
      })
      .addCase(fetchRoleInfo.pending, state => {
        state.isRoleInfoLoading = true
      })
      .addCase(fetchRoleInfo.fulfilled, (state, action) => {
        state.isRoleInfoLoading = false
        state.roleInfo = action.payload
      })
      .addCase(fetchRoleInfo.rejected, state => {
        state.isRoleInfoLoading = false
      })
      .addCase(editRole.pending, state => {
        state.isEditRoleLoading = true
      })
      .addCase(editRole.fulfilled, state => {
        state.isEditRoleLoading = false
        state.isEditRoleSuccess = !state.isEditRoleSuccess
      })
      .addCase(editRole.rejected, state => {
        state.isEditRoleLoading = false
      })
  }
})

export default roleSlice.reducer
