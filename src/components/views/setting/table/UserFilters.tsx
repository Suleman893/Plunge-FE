//React Imports
import { useState, useEffect, useRef, useCallback } from 'react'

//Third Party Imports
import debounce from 'lodash/debounce'
import { useSelector, useDispatch } from 'react-redux'

//Components Imports
import CustomTextField from '@core/components/mui/TextField'
import CustomAutocomplete from '@core/components/mui/Autocomplete'
import Modal from '@components/modal'
import AddNewUser from '../modal/AddNewUser'
import CustomButton from '@core/components/mui/Button'

//Types Imports
import type { UserFiltersProps } from '@custom-types/pages/settings/userSetting'

//Redux Imports
import { fetchAllUsers } from '@features/users/thunk'
import type { RootState } from '@features/store'

//Helpers and Utils Imports
import { snakeToPascalConverter } from '@helpers/common'

//Constants Import
import { PAGE_SIZE, SORT_BY } from '@constants/common'

//Data Imports
import { userStatus } from '@data/settings'

const UserFilters = (props: UserFiltersProps) => {
  const dispatch = useDispatch()

  const { page, setPage, filters, setFilters } = props

  //All roles for Role Dropdown
  const { allRoles } = useSelector((state: RootState) => state.role)

  //States
  const [openModal, setOpenModal] = useState<boolean>(false)

  // Ref to track the last entered name and email
  const lastNameOrEmailRef = useRef('')

  // Debounce function accepts nameOrEmail parameter
  const debouncedNameOrEmailFetch = useCallback(
    debounce((nameOrEmail: any) => {
      dispatch(
        fetchAllUsers({
          page,
          elements: PAGE_SIZE,
          sortBy: SORT_BY,
          roleId: filters?.roleId,
          status: filters?.status,
          nameOrEmail
        }) as any
      )
    }, 500),
    [page, filters.deviceType, filters.deviceStatus]
  )

  // Debounced API call for nameOrEmail (only when text has changed)
  useEffect(() => {
    if (filters.nameOrEmail !== lastNameOrEmailRef.current) {
      lastNameOrEmailRef.current = filters.nameOrEmail
      setPage(1)
      debouncedNameOrEmailFetch(filters.nameOrEmail)
    }
  }, [filters.nameOrEmail])

  return (
    <>
      <div className='flex items-center w-1/2 max-sm:flex-col max-sm:w-full gap-4'>
        <div className='w-1/3 max-sm:w-full'>
          <CustomAutocomplete
            disableClearable={false}
            fullWidth
            id='select-role'
            options={allRoles}
            value={allRoles.find((role: any) => role.id === filters.roleId) || null}
            onChange={(_, value) => {
              setFilters((prev: any) => ({ ...prev, roleId: value?.id || null }))
              setPage(1)
            }}
            getOptionLabel={option => snakeToPascalConverter(option?.name) || ''}
            renderOption={(props, option) => (
              <li {...props} key={option?.id}>
                <span>{snakeToPascalConverter(option?.name)}</span>
              </li>
            )}
            renderInput={params => <CustomTextField {...params} placeholder='Filter By Role' />}
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

      <div className='flex justify-end items-center max-sm:flex-col gap-4  max-sm:w-full'>
        <CustomTextField
          id='search-user'
          placeholder='Search by name, email address'
          value={filters.nameOrEmail}
          className='max-sm:is-full md:min-is-[280px]'
          onChange={e => setFilters((prev: any) => ({ ...prev, nameOrEmail: e.target.value }))}
        />
        <CustomButton
          variant='tonal'
          text='Add New User'
          startIcon={<i className='tabler-plus' />}
          className='max-sm:is-full'
          handleClick={() => setOpenModal(true)}
        />
      </div>
      <Modal
        isTitleCenter={true}
        title='Add New User'
        description={null}
        open={openModal}
        handleClose={() => setOpenModal(false)}
        content={<AddNewUser onBtnClick={() => setOpenModal(false)} />}
      />
    </>
  )
}

export default UserFilters
