'use client'

// React Imports
import { useState, useEffect, useMemo } from 'react'

//Third Party Imports
import type { ColumnDef } from '@tanstack/react-table'
import { useSelector, useDispatch } from 'react-redux'

//Types Imports
import type { PushNotification } from '@custom-types/features/pushNotification'

//Reusable Components Imports
import Table from '@components/table'
import OptionMenu from '@core/components/option-menu'
import Modal from '@components/modal'
import CustomChip from '@core/components/mui/Chip'
import SideDrawer from '@components/drawer'
import AddEditNotification from '@components/views/push-notification/drawer/AddEditNotification'
import NotificationDetail from '@components/views/push-notification/modal/NotificationDetails'
import ActionModal from '@components/modal/shared/ActionModal'
import PushNotificationFilters from './PushNotificationFilters'

//Hooks Imports
import { useModalOpener } from '@hooks/useModalOpener'

//Redux Imports
import type { RootState } from '@features/store'
import { fetchAllNotifications, deleteNotification } from '@features/push-notification/thunk'

// Constants Imports
import { PAGE_SIZE, SORT_BY } from '@constants/common'

//Utils And Helpers Imports
import { formatTimeTo12Hour, toLowerCase, truncateText, formatTimestampToDate } from '@utils/common'
import { snakeToPascalConverter, statusColor } from '@helpers/common'

const PushNotificationTable = () => {
  //Hooks
  const dispatch = useDispatch()

  const {
    isAllNotificationLoading,
    allNotifications,
    isNotificationDeleteSuccess,
    isCreateNotificationSuccess,
    isEditNotificationSuccess
  } = useSelector((state: RootState) => state.pushNotification)

  //States
  //Pagination
  const [page, setPage] = useState<number>(1)

  //Filter
  const [filters, setFilters] = useState({
    message: '',
    notificationType: '',
    status: null
  })

  //Drawer
  const [openDrawer, setOpenDrawer] = useState(false)

  //Edit
  const [isEdit, setIsEdit] = useState(false)

  //Select Row
  const [selectedNotification, setSelectedNotification] = useState<PushNotification | null>(null)

  useEffect(() => {
    dispatch(
      fetchAllNotifications({
        page,
        elements: PAGE_SIZE,
        sortBy: SORT_BY,
        message: filters?.message,
        notificationType: filters?.notificationType,
        status: filters?.status
      }) as any
    )
  }, [
    page,
    filters?.status,
    filters?.notificationType,
    isNotificationDeleteSuccess,
    isCreateNotificationSuccess,
    isEditNotificationSuccess
  ])

  //Modal Manager Hook
  const { isOpen, openModal, closeModal, modalConfig } = useModalOpener()

  const columns: ColumnDef<PushNotification>[] = useMemo(
    () => [
      {
        accessorKey: 'notificationType',
        header: 'Notification Type',
        cell: ({ row }) => <p>{snakeToPascalConverter(row.original.notificationType?.name)}</p>
      },
      {
        accessorKey: 'message',
        header: 'Message',
        cell: ({ row }) => truncateText(row.original.message, 45)
      },
      {
        accessorKey: 'sent',
        header: 'Sent/Scheduled Date',
        cell: ({ row }) => (
          <p>{`${formatTimestampToDate(row.original?.date, 'DD/MM/YY')} | ${formatTimeTo12Hour(row.original?.time)}`}</p>
        )
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            <CustomChip
              variant='tonal'
              label={snakeToPascalConverter(row?.original?.status === 'schedule' ? 'scheduled' : 'sent')}
              size='small'
              color={statusColor('push-notifications', String(row?.original?.status))}
            />
          </div>
        )
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className='flex items-center'>
            <OptionMenu
              iconButtonProps={{ size: 'medium' }}
              iconClassName='text-textSecondary'
              options={
                [
                  {
                    text: 'View Details',
                    menuItemProps: {
                      onClick: () =>
                        openModal({
                          title: 'Notification Details',
                          isTitleCenter: true,
                          content: (
                            <NotificationDetail
                              defaultData={row?.original}
                              onBtnClick={closeModal}
                              isEdit={isEdit}
                              onEditBtnClick={() => {
                                closeModal()
                                setOpenDrawer(true)
                                setIsEdit(true)
                              }}
                            />
                          )
                        })
                    }
                  },
                  row.original.status !== 'sent' && {
                    text: 'Edit Notification',
                    menuItemProps: {
                      onClick: () => {
                        setSelectedNotification(row.original)
                        setOpenDrawer(true)
                        setIsEdit(true)
                      }
                    }
                  },
                  {
                    text: 'Delete Notification',
                    menuItemProps: {
                      className: 'text-error',
                      onClick: () =>
                        openModal({
                          title: 'Delete Notification?',
                          description: (
                            <>
                              Are you sure you want to delete this{' '}
                              <span className='text-black font-semibold'>
                                {toLowerCase(row.original?.status)} notification,
                              </span>{' '}
                              this cant be undone
                            </>
                          ),
                          content: (
                            <ActionModal
                              actionType='Delete'
                              onRightBtnClick={() => {
                                dispatch(deleteNotification({ id: row?.original.id, closeModal }) as any)
                              }}
                              onLeftBtnClick={closeModal}
                            />
                          ),
                          isTitleCenter: false
                        })
                    }
                  }
                ].filter(Boolean) as any[]
              }
            />
          </div>
        )
      }
    ],
    []
  )

  return (
    <>
      <Table<PushNotification>
        isLoading={isAllNotificationLoading}
        columns={columns}
        data={allNotifications?.items?.length ? allNotifications?.items : []}
        totalElements={allNotifications?.pagination?.totalElements}
        elementsPerPage={PAGE_SIZE}
        page={page}
        setPage={setPage}
        filters={<PushNotificationFilters page={page} setPage={setPage} filters={filters} setFilters={setFilters} />}
      />
      {/* //Modal opener hook */}
      {modalConfig && <Modal open={isOpen} handleClose={closeModal} {...modalConfig} />}
      {/* Used openDrawer && to overcome some rendering issue */}
      {openDrawer && (
        <SideDrawer
          title={isEdit ? 'Edit Notification' : 'Create New Notification'}
          open={openDrawer}
          handleClose={() => setOpenDrawer(false)}
          form={
            <AddEditNotification
              isEdit={isEdit}
              handleClose={() => setOpenDrawer(false)}
              defaultData={selectedNotification}
            />
          }
        />
      )}
    </>
  )
}

export default PushNotificationTable
