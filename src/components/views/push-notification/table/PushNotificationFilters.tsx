//React Imports
import { useState, useEffect, useRef, useCallback } from 'react'

//Third Party Imports
import debounce from 'lodash/debounce'
import { useDispatch } from 'react-redux'

//Components Imports
import CustomTextField from '@core/components/mui/TextField'
import CustomAutocomplete from '@core/components/mui/Autocomplete'
import SideDrawer from '@components/drawer'
import AddEditNotification from '@components/views/push-notification/drawer/AddEditNotification'
import CustomButton from '@core/components/mui/Button'

//Data Imports
import { notificationStatus, notificationTypes } from '@data/push-notifications'

//Redux Imports
import { fetchAllNotifications } from '@features/push-notification/thunk'

//Types Imports
import type { PushNotificationFiltersProps } from '@custom-types/pages/push-notifications'

//Constants Import
import { PAGE_SIZE, SORT_BY } from '@constants/common'

const PushNotificationFilters = (props: PushNotificationFiltersProps) => {
  const { page, setPage, filters, setFilters } = props

  const dispatch = useDispatch()

  //States
  const [openDrawer, setOpenDrawer] = useState<boolean>(false)

  // Ref to track the last entered notification message
  const lastMessageRef = useRef('')

  // Debounce function accepts notificationMessage parameter
  const debouncedMessageFetch = useCallback(
    debounce((message: string) => {
      dispatch(
        fetchAllNotifications({
          page,
          elements: PAGE_SIZE,
          sortBy: SORT_BY,
          message,
          notificationType: filters.notificationType,
          status: filters.status
        }) as any
      )
    }, 500),
    [page, filters.notificationType, filters.status]
  )

  // Debounced API call for productModelName (only when text has changed)
  useEffect(() => {
    if (filters.message !== lastMessageRef.current) {
      lastMessageRef.current = filters.message
      setPage(1)
      debouncedMessageFetch(filters.message)
    }
  }, [filters.message])

  return (
    <>
      <div className='flex items-center w-1/2 max-sm:flex-col max-sm:w-full gap-4'>
        <div className='w-1/2 max-sm:w-full'>
          <CustomAutocomplete
            disableClearable={false}
            fullWidth
            id='select-notification-type'
            options={notificationTypes}
            value={notificationTypes.find(type => type.value === filters.notificationType) || null}
            onChange={(_, value) => {
              setFilters((prev: any) => ({ ...prev, notificationType: value?.value || null }))
              setPage(1)
            }}
            getOptionLabel={option => option?.label || ''}
            renderInput={params => <CustomTextField {...params} placeholder='Filter By Type' />}
          />
        </div>
        <div className='w-1/2 max-sm:w-full'>
          <CustomAutocomplete
            disableClearable={false}
            fullWidth
            id='select-notification-status'
            options={notificationStatus}
            value={notificationStatus.find(status => status.value === filters.status) || null}
            onChange={(_, value) => {
              setFilters((prev: any) => ({ ...prev, status: value?.value || null }))
              setPage(1)
            }}
            getOptionLabel={option => option.label || ''}
            renderInput={params => <CustomTextField {...params} placeholder='Filter By Status' />}
          />
        </div>
      </div>
      <div className='flex justify-end items-center max-sm:flex-col gap-4 max-sm:w-full'>
        <CustomTextField
          id='search-notification'
          placeholder='Search Notification'
          value={filters.message}
          onChange={e => setFilters((prev: any) => ({ ...prev, message: e.target.value }))}
          className='max-sm:is-full md:min-is-[250px]'
        />
        <CustomButton
          text='Create New'
          startIcon={<i className='tabler-plus' />}
          className='max-sm:is-full'
          handleClick={() => setOpenDrawer(true)}
        />
      </div>
      {/* Used openDrawer && to overcome some rendering issue */}
      {openDrawer && (
        <SideDrawer
          title='Create New Notification'
          open={openDrawer}
          handleClose={() => setOpenDrawer(false)}
          form={<AddEditNotification handleClose={() => setOpenDrawer(false)} />}
        />
      )}
    </>
  )
}

export default PushNotificationFilters
