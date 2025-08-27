//React Imports
import { useEffect, useRef, useCallback } from 'react'

//Third Party Imports
import debounce from 'lodash/debounce'
import { useDispatch } from 'react-redux'

//Components Imports
import CustomTextField from '@core/components/mui/TextField'
import CustomAutocomplete from '@core/components/mui/Autocomplete'

//Redux Import
import { fetchAllAppUsers } from '@features/app-user/thunk'

//Custom Type Import
import type { UserManagementFilterProps } from '@custom-types/pages/app-user'

//Constants Imports
import { PAGE_SIZE, SORT_BY } from '@constants/common'

//Helpers Imports
import { snakeToPascalConverter } from '@helpers/common'

//Static Data Imports
import { userStatus } from '@data/settings'
import { sortByOptions } from '@data/app-user-management'

const UserManagementFilters = (props: UserManagementFilterProps) => {
  const { page, setPage, filters, setFilters } = props

  //Hooks
  const dispatch = useDispatch()

  //Ref to track the last entered name and email
  const lastNameOrEmailRef = useRef('')

  //Debounce function accepts nameOrEmail parameter
  const debouncedNameOrEmailFetch = useCallback(
    debounce((nameOrEmail: any) => {
      dispatch(
        fetchAllAppUsers({
          page,
          elements: PAGE_SIZE,
          sortBy: filters?.sortBy || SORT_BY,
          status: filters?.status,
          nameOrEmail
        }) as any
      )
    }, 500),
    [page, filters.status, filters?.sortBy]
  )

  // Debounced API call for nameAndEmail (only when text has changed)
  useEffect(() => {
    if (filters.nameOrEmail !== lastNameOrEmailRef.current) {
      lastNameOrEmailRef.current = filters.nameOrEmail
      setPage(1)
      debouncedNameOrEmailFetch(filters.nameOrEmail)
    }
  }, [filters.nameOrEmail])

  useEffect

  return (
    <>
      <div className='flex items-center w-1/2 max-sm:flex-col max-sm:w-full gap-4'>
        <div className='w-1/3 max-sm:w-full'>
          <CustomAutocomplete
            disableClearable={false}
            fullWidth
            id='select-sort-by'
            options={sortByOptions}
            value={sortByOptions.find((sortBy: any) => sortBy.value === filters.sortBy) || null}
            renderInput={params => <CustomTextField {...params} placeholder='Sort By' />}
            onChange={(_, value) => {
              setFilters((prev: any) => ({
                ...prev,
                sortBy: value?.value || null
              }))
              setPage(1)
            }}
            getOptionLabel={option => snakeToPascalConverter(option?.label) || ''}
            renderOption={(props, option) => (
              <li {...props} key={option?.value}>
                <span>{snakeToPascalConverter(option?.label)}</span>
              </li>
            )}
          />
        </div>
        <div className='w-1/3 max-sm:w-full'>
          <CustomAutocomplete
            disableClearable={false}
            fullWidth
            id='select-status'
            options={userStatus}
            value={userStatus.find(status => status.value === filters.status) || null}
            onChange={(_, value) => {
              setFilters((prev: any) => ({ ...prev, status: value?.value || null }))
              setPage(1)
            }}
            getOptionLabel={option => snakeToPascalConverter(option?.label) || ''}
            renderOption={(props, option) => (
              <li {...props} key={option.value}>
                <span>{snakeToPascalConverter(option.label)}</span>
              </li>
            )}
            renderInput={params => <CustomTextField {...params} placeholder='Filter By Status' />}
          />
        </div>
      </div>
      <div className='flex justify-end items-center w-1/3 max-sm:w-full'>
        <CustomTextField
          fullWidth
          id='search-name-email'
          placeholder='Search By name, email address'
          value={filters.nameOrEmail}
          onChange={e => setFilters((prev: any) => ({ ...prev, nameOrEmail: e.target.value }))}
        />
      </div>
    </>
  )
}

export default UserManagementFilters
