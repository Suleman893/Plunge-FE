//React Imports
import { useEffect, useRef, useCallback } from 'react'

//Next Imports
import { useRouter } from 'next/navigation'

//Third Party Imports
import debounce from 'lodash/debounce'
import { useDispatch } from 'react-redux'

//Components Imports
import CustomTextField from '@core/components/mui/TextField'
import CustomAutocomplete from '@core/components/mui/Autocomplete'
import CustomButton from '@core/components/mui/Button'

//Helpers and Utils Imports
import { snakeToPascalConverter } from '@helpers/common'

//Redux Imports
import { fetchAllPlungeModels } from '@features/plunge-model/thunk'

//Types Imports
import type { PlungeModelFiltersProps } from '@custom-types/pages/plunge-models'

//Constants Import
import { PAGE_SIZE, SORT_BY } from '@constants/common'

//Data Imports
import { plungeModelStatus } from '@data/plunge-models'

const PlungeModelFilters = (props: PlungeModelFiltersProps) => {
  const { page, setPage, filters, setFilters } = props

  const router = useRouter()
  const dispatch = useDispatch()

  // Ref to track the last entered product model name
  const lastProductModelNameRef = useRef('')

  // Debounce function accepts productModelName parameter
  const debouncedProductNameFetch = useCallback(
    debounce((productModelName: any) => {
      dispatch(
        fetchAllPlungeModels({
          page,
          elements: PAGE_SIZE,
          sortBy: SORT_BY,
          status: filters?.status,
          productModelName
        }) as any
      )
    }, 500),
    [page, filters.status]
  )

  // Debounced API call for productModelName (only when text has changed)
  useEffect(() => {
    if (filters.productModelName !== lastProductModelNameRef.current) {
      lastProductModelNameRef.current = filters.productModelName
      setPage(1)
      debouncedProductNameFetch(filters.productModelName)
    }
  }, [filters.productModelName])

  return (
    <>
      <div className='w-1/5 max-sm:w-full'>
        <CustomAutocomplete
          disableClearable={false}
          fullWidth
          id='select-status'
          options={plungeModelStatus}
          value={plungeModelStatus.find(status => status.value === filters.status) || null}
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
      <div className='flex justify-end items-center max-sm:flex-col gap-4 max-sm:w-full'>
        <CustomTextField
          id='search-display-name'
          placeholder='Search Display Name'
          value={filters.productModelName}
          className='max-sm:is-full md:min-is-[250px]'
          onChange={e => setFilters((prev: any) => ({ ...prev, productModelName: e.target.value }))}
        />
        <CustomButton
          handleClick={() => router.push('/plunge-models/add')}
          variant='contained'
          className='max-sm:is-full'
          text='Add New Model'
          startIcon={<i className='tabler-plus' />}
        />
      </div>
    </>
  )
}

export default PlungeModelFilters
