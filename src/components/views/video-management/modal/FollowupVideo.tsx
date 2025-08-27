//MUI Imports
import Typography from '@mui/material/Typography'
import Switch from '@mui/material/Switch'
import Grid from '@mui/material/Grid2'
import Chip from '@mui/material/Chip'

//Third Party Imports
import { useDispatch } from 'react-redux'

//Custom Components Imports
// import CustomTextField from '@core/components/mui/TextField'
// import CustomAutocomplete from '@core/components/mui/Autocomplete'
import CustomAsyncPaginate from '@components/common/AsyncPaginate'

//Redux Imports
import { fetchAllVideosOptions } from '@features/video-management/thunk'

//Custom Types Imports
import type { FollowupVideoProps } from '@custom-types/pages/video-management'

//Helpers Imports
import { fetchPaginatedOptions } from '@helpers/common'

//Constants Imports
import { PAGE_SIZE, SORT_BY } from '@constants/common'

const FollowupVideo = (props: FollowupVideoProps) => {
  //Props
  const {
    allowFollowUp,
    setAllowFollowUp,
    followUpVideoIds,
    setFollowUpVideoIds,
    error,
    setError,
    selectedFollowUpVideos,
    setSelectedFollowUpVideos,
    itemData
  } = props

  //Redux Imports
  const dispatch = useDispatch()

  const loadVideosOptions = async (searchQuery: any, loadedOptions: any, additional: any) => {
    const page = additional.page || 1

    return fetchPaginatedOptions(
      dispatch,
      fetchAllVideosOptions,
      {
        page,
        elements: PAGE_SIZE,
        sortBy: SORT_BY,
        name: searchQuery,
        videoId: itemData
      },
      searchQuery,
      loadedOptions,
      additional
    )
  }

  return (
    <div className='flex flex-col gap-3'>
      <div className='flex items-center justify-between'>
        <Typography variant='h5'>Allow Follow Up Video Recommendation</Typography>
        <Switch
          checked={allowFollowUp}
          onChange={e => {
            setAllowFollowUp(e.target.checked)
            if (!e.target.checked) setFollowUpVideoIds([]) // clear selected videos if disabled
          }}
        />
      </div>
      {!allowFollowUp && (
        <p className='text-xs text-gray-500'>
          By allowing this, you need to select some videos from the database to show up on the mobile app when the
          session gets complete
        </p>
      )}
      {allowFollowUp && (
        <Grid size={{ xs: 12 }}>
          <CustomAsyncPaginate
            isMulti
            menuPortal={false} //False in modals
            label='Select Video'
            placeholder='Select videos from the list'
            loadOptions={loadVideosOptions}
            additional={{ page: 1 }}
            getOptionValue={(option: any) => option?.id}
            getOptionLabel={(option: any) => option?.name}
            value={selectedFollowUpVideos}
            onChange={(selected: any) => {
              const selectedOptions =
                selected?.map((item: any) => ({
                  id: item?.id,
                  name: item?.name
                })) || []

              const selectedIds = selectedOptions?.map((item: any) => item?.id) || []

              setSelectedFollowUpVideos(selectedOptions)
              setFollowUpVideoIds(selectedIds)

              if (selectedIds.length > 0) setError(null)
            }}
            error={error}
          />

          {error && <span className='text-error text-[13px]'>Follow up video is required</span>}
          <p className='text-sm mt-1 text-gray-500'>You can select up to 10 videos</p>
          <div className='flex flex-wrap gap-2.5 mt-6'>
            {selectedFollowUpVideos.map((video: any) => (
              <Chip
                key={video?.id}
                label={video?.name}
                size='medium'
                onDelete={() => {
                  const updatedIds = followUpVideoIds?.filter((id: any) => id !== video?.id)
                  const updatedVideos = selectedFollowUpVideos?.filter((itm: any) => itm?.id !== video?.id)

                  setFollowUpVideoIds(updatedIds)
                  setSelectedFollowUpVideos(updatedVideos)

                  if (updatedIds?.length === 0) setError('Video selection is required')
                }}
              />
            ))}
          </div>
        </Grid>
      )}
    </div>
  )
}

export default FollowupVideo
