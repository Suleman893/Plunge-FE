//React Imports
import { useEffect, useRef, useCallback } from 'react'

//MUI Imports
import Typography from '@mui/material/Typography'

//Third Party Imports
import debounce from 'lodash/debounce'
import { useDispatch, useSelector } from 'react-redux'

//Components Imports
import CustomTextField from '@core/components/mui/TextField'

//Redux Imports
import type { RootState } from '@features/store'
import { fetchAssociatedPlunges } from '@features/app-user/thunk'

//Types Imports
import type { AssociatedPlungeFiltersProps } from '@custom-types/pages/app-user'

//Constants Imports
import { PAGE_SIZE, SORT_BY } from '@constants/common'

const AssociatedPlungeFilters = (props: AssociatedPlungeFiltersProps) => {
  const { appUserId } = useSelector((state: RootState) => state.appUserManagement)

  const { page, setPage, filters, setFilters } = props

  const dispatch = useDispatch()

  // Ref to track last entered name or model id
  const lastNameOrModelIdRef = useRef('')

  // Debounce function accepts lastNameOrModelId parameter
  const debouncedNameOrModelIdFetch = useCallback(
    debounce((nameOrModelId: any) => {
      dispatch(
        fetchAssociatedPlunges({
          userId: appUserId,
          page,
          elements: PAGE_SIZE,
          sortBy: SORT_BY,
          nameOrModelId
        }) as any
      )
    }, 500),
    [page]
  )

  useEffect(() => {
    if (filters.nameOrModelId !== lastNameOrModelIdRef.current) {
      lastNameOrModelIdRef.current = filters.lastNameOrModelIdRef
      setPage(1)
      debouncedNameOrModelIdFetch(filters.nameOrModelId)
    }
  }, [filters.nameOrModelId])

  return (
    <>
      <div className='flex justify-between items-center gap-4 max-sm:flex-col'>
        <div className='flex flex-col gap-1'>
          <Typography variant='h4'>Associated Plunges</Typography>
          <p>Below is the list of the plunges added by the user in the mobile application</p>
        </div>
      </div>
      <div className='w-1/3 max-sm:w-full'>
        <CustomTextField
          fullWidth
          id='search-name-model-id'
          placeholder='Search Display Name | Model ID'
          value={filters.nameOrModelId}
          onChange={e => setFilters((prev: any) => ({ ...prev, nameOrModelId: e.target.value }))}
        />
      </div>
    </>
  )
}

export default AssociatedPlungeFilters
