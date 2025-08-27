'use client'

//React Imports
import { useEffect } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'

//Third Party Imports
import { useSelector, useDispatch } from 'react-redux'

//Components Imports
import RoleInfo from '@components/cards/RoleInfo'

// Redux Imports
import { fetchRoles } from '@features/role/thunk'
import type { RootState } from '@features/store'

const AllRoles = () => {
  const dispatch = useDispatch()

  const { allRoles, isAllRolesLoading, isAddRoleSuccess, isEditRoleSuccess } = useSelector(
    (state: RootState) => state.role
  )

  const { isAddUserSuccess, isUserDeleteSuccess, isEditUserDetailSuccess } = useSelector(
    (state: RootState) => state.users
  )

  useEffect(() => {
    dispatch(fetchRoles() as any)
  }, [isAddRoleSuccess, isEditRoleSuccess, isAddUserSuccess, isUserDeleteSuccess, isEditUserDetailSuccess])

  return (
    <Grid container spacing={6}>
      {isAllRolesLoading ? (
        Array.from({ length: 3 }).map((_, index) => <RoleInfo key={index} data={null} loading={isAllRolesLoading} />)
      ) : allRoles.length > 0 ? (
        allRoles.map(itm => <RoleInfo key={itm.id} data={itm} />)
      ) : (
        <p>No role found</p>
      )}
    </Grid>
  )
}

export default AllRoles
