//React Imports
import { useEffect, useRef, useCallback } from 'react'

//Third Party Imports
import debounce from 'lodash/debounce'
import { useDispatch, useSelector } from 'react-redux'

//MUI Imports
import Typography from '@mui/material/Typography'

//Components Imports
import CustomTextField from '@core/components/mui/TextField'

//Types Imports
import type { UserSessionFiltersProps } from '@custom-types/pages/app-user'

//Redux Imports
import { fetchLoggedSessions } from '@features/app-user/thunk'
import type { RootState } from '@features/store'

//Constants Imports
import { PAGE_SIZE, SORT_BY } from '@constants/common'

const UserLoggedSessionFilters = (props: UserSessionFiltersProps) => {
  const { page, setPage, filters, setFilters } = props

  //Hooks
  const { appUserId } = useSelector((state: RootState) => state.appUserManagement)

  const dispatch = useDispatch()

  //Ref to track last name
  const lastNameRef = useRef('')

  //Debounce function accepts name parameter
  const debouncedNameFetch = useCallback(
    debounce((name: any) => {
      dispatch(
        fetchLoggedSessions({
          userId: appUserId,
          page,
          elements: PAGE_SIZE,
          sortBy: SORT_BY,
          name
        }) as any
      )
    }, 500),
    [page]
  )

  useEffect(() => {
    if (filters.name !== lastNameRef.current) {
      lastNameRef.current = filters.lastNameRef
      setPage(1)
      debouncedNameFetch(filters.name)
    }
  }, [filters.name])

  return (
    <>
      <div className='flex justify-between items-center gap-4 max-sm:flex-col'>
        <div className='flex flex-col gap-1'>
          <Typography variant='h4'>User Logged Sessions</Typography>
          <p>This is the list of sessions that user logged from their mobile application</p>
        </div>
      </div>
      <div className='w-1/3 max-sm:w-full'>
        <CustomTextField
          fullWidth
          id='search-name'
          placeholder='Search Display Name'
          value={filters.name}
          onChange={e => setFilters((prev: any) => ({ ...prev, name: e.target.value }))}
        />
      </div>
    </>
  )
}

export default UserLoggedSessionFilters
