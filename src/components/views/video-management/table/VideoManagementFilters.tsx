//React Imports
import { useEffect, useRef, useCallback } from 'react'

//Third Party Imports
import debounce from 'lodash/debounce'
import { useSelector, useDispatch } from 'react-redux'

//Components Imports
import CustomTextField from '@core/components/mui/TextField'
import CustomAutocomplete from '@core/components/mui/Autocomplete'
import CustomButton from '@core/components/mui/Button'

//Redux Imports
import { fetchAllVideos, fetchAllVideoTypes } from '@features/video-management/thunk'
import type { RootState } from '@features/store'

//Types Imports
import type { VideoManagementFilterProps } from '@custom-types/pages/video-management'

//Data Imports
import { allMoods, videoStatus } from '@data/video-management'

//Helpers Imports
import { snakeToPascalConverter } from '@helpers/common'

//Constants Imports
import { PAGE_SIZE, SORT_BY } from '@constants/common'

const VideoManagementFilters = (props: VideoManagementFilterProps) => {
  const { page, setPage, filters, setFilters, setOpenModal } = props

  //Hooks
  const dispatch = useDispatch()
  const { allVideoTypes } = useSelector((state: RootState) => state.videoManagement)

  //Fetch Video Types
  useEffect(() => {
    dispatch(fetchAllVideoTypes() as any)
  }, [])

  //Ref to track the last entered
  const lastNameRef = useRef('')

  // Debounce function accepts name parameter
  const debouncedNameFetch = useCallback(
    debounce((name: any) => {
      dispatch(
        fetchAllVideos({
          page,
          elements: PAGE_SIZE,
          sortBy: SORT_BY,
          status: filters?.status,
          mood: filters?.mood,
          videoTypeId: filters?.videoTypeId,
          name
        }) as any
      )
    }, 500),
    [page, filters?.status, filters?.mood, filters?.videoTypeId]
  )

  // Debounced API call for name (only when text has changed)
  useEffect(() => {
    if (filters.name !== lastNameRef.current) {
      lastNameRef.current = filters.name
      setPage(1)
      debouncedNameFetch(filters.name)
    }
  }, [filters.name])

  return (
    <>
      <div className='flex items-center w-1/2 max-sm:flex-col max-sm:w-full gap-4'>
        <div className='w-1/3 max-sm:w-full'>
          <CustomAutocomplete
            disableClearable={false}
            fullWidth
            options={allVideoTypes || []}
            value={allVideoTypes.find((videoType: any) => videoType?.id === filters.videoTypeId) || null}
            onChange={(_, newValue) => {
              setFilters((prev: any) => ({ ...prev, videoTypeId: newValue?.id || null }))
            }}
            getOptionLabel={option => snakeToPascalConverter(option?.name) || ''}
            renderOption={(props, option) => (
              <li {...props} key={option?.name}>
                <span>{snakeToPascalConverter(option?.name)}</span>
              </li>
            )}
            id='select-video-type'
            renderInput={params => <CustomTextField {...params} placeholder='Filter By Video Type' />}
          />
        </div>
        <div className='w-1/3 max-sm:w-full'>
          <CustomAutocomplete
            disableClearable={false}
            fullWidth
            id='select-mood'
            options={allMoods}
            value={allMoods.find(mood => mood.value === filters.mood) || null}
            onChange={(_, value) => {
              setFilters((prev: any) => ({ ...prev, mood: value?.value || null }))
              setPage(1)
            }}
            getOptionLabel={option => snakeToPascalConverter(option?.label) || ''}
            renderOption={(props, option) => (
              <li {...props} key={option.value}>
                <span>{snakeToPascalConverter(option.label)}</span>
              </li>
            )}
            renderInput={params => <CustomTextField {...params} placeholder='Filter By Mood' />}
          />
        </div>
        <div className='w-1/3 max-sm:w-full'>
          <CustomAutocomplete
            disableClearable={false}
            fullWidth
            id='select-status'
            options={videoStatus}
            value={videoStatus.find(status => status.value === filters.status) || null}
            onChange={(_, value) => {
              setFilters((prev: any) => ({ ...prev, status: value?.value || null }))
              setPage(1)
            }}
            getOptionLabel={option => snakeToPascalConverter(option.label) || ''}
            renderOption={(props, option) => (
              <li {...props} key={option.value}>
                <span>{snakeToPascalConverter(option.label)}</span>
              </li>
            )}
            renderInput={params => <CustomTextField {...params} placeholder='Filter By Status' />}
          />
        </div>
      </div>
      <div className='flex justify-end items-center max-sm:flex-col gap-4 max-sm:w-full'>
        <CustomTextField
          id='search-title'
          placeholder='Search Title'
          className='max-sm:is-full md:min-is-[250px]'
          value={filters.name}
          onChange={e =>
            setFilters((prev: any) => ({
              ...prev,
              name: e.target.value
            }))
          }
        />
        <CustomButton
          variant='contained'
          className='max-sm:is-full'
          text='Upload New'
          startIcon={<i className='tabler-plus' />}
          handleClick={() => setOpenModal(true)}
        />
      </div>
    </>
  )
}

export default VideoManagementFilters
