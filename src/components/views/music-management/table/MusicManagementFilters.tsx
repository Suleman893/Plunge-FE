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
import { fetchAllPlaylist, fetchAllLicenseTypes, fetchAllMusics } from '@features/music-management/thunk'
import type { RootState } from '@features/store'

//Types Imports
import type { MusicManagementFilterProps } from '@custom-types/pages/music-management'

//Data Imports
import { musicStatus } from '@data/music-management'

//Helpers Imports
import { snakeToPascalConverter } from '@helpers/common'

//Constants Imports
import { PAGE_SIZE, SORT_BY } from '@constants/common'

const MusicManagementFilters = (props: MusicManagementFilterProps) => {
  const { page, setPage, filters, setFilters, setOpenModal } = props

  //Hooks
  const dispatch = useDispatch()
  const { allPlaylist, allLicenseTypes } = useSelector((state: RootState) => state.musicManagement)

  //Fetch Playlist + License Types
  useEffect(() => {
    dispatch(fetchAllPlaylist() as any)
    dispatch(fetchAllLicenseTypes() as any)
  }, [])

  // Ref to track the last entered name
  const lastNameRef = useRef('')

  // Debounce function accepts name parameter
  const debouncedNameFetch = useCallback(
    debounce((name: any) => {
      dispatch(
        fetchAllMusics({
          page,
          elements: PAGE_SIZE,
          sortBy: SORT_BY,
          status: filters?.status,
          licenseTypeId: filters?.licenseTypeId,
          playlistId: filters?.playlistId,
          name
        }) as any
      )
    }, 500),
    [page, filters.status, filters.licenseTypeId, filters.playlistId]
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
            id='select-playlist'
            options={allPlaylist}
            value={allPlaylist.find((playlist: any) => playlist.id === filters?.playlistId) || null}
            onChange={(_, value) => {
              setFilters((prev: any) => ({ ...prev, playlistId: value?.id || null }))
              setPage(1)
            }}
            getOptionLabel={option => snakeToPascalConverter(option?.name)}
            renderOption={(props, option) => (
              <li {...props} key={option.id}>
                <span>{snakeToPascalConverter(option?.name)}</span>
              </li>
            )}
            renderInput={params => <CustomTextField {...params} placeholder='Filter By Playlist' />}
          />
        </div>
        <div className='w-1/3 max-sm:w-full'>
          <CustomAutocomplete
            disableClearable={false}
            fullWidth
            id='select-status'
            options={musicStatus}
            value={musicStatus.find(status => status.value === filters.status) || null}
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
        <div className='w-1/3 max-sm:w-full'>
          <CustomAutocomplete
            disableClearable={false}
            fullWidth
            id='select-license-type'
            options={allLicenseTypes}
            value={allLicenseTypes.find((license: any) => license.id === filters?.licenseId || null)}
            onChange={(_, value) => {
              setFilters((prev: any) => ({ ...prev, licenseTypeId: value?.id || null }))
              setPage(1)
            }}
            getOptionLabel={option => snakeToPascalConverter(option?.name)}
            renderOption={(props, option) => (
              <li {...props} key={option?.id}>
                <span>{snakeToPascalConverter(option?.name)}</span>
              </li>
            )}
            renderInput={params => <CustomTextField {...params} placeholder='Filter By Licence Type' />}
          />
        </div>
      </div>
      <div className='flex justify-end items-center max-sm:flex-col gap-4 max-sm:w-full'>
        <CustomTextField
          id='search-music'
          placeholder='Search Music'
          value={filters.name}
          onChange={e => setFilters((prev: any) => ({ ...prev, name: e.target.value }))}
          className='max-sm:is-full md:min-is-[250px]'
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

export default MusicManagementFilters
