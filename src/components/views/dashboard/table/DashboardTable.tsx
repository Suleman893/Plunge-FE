'use client'

//React Imports
import { useState, useEffect, useMemo } from 'react'

//Next Imports
import { useRouter } from 'next/navigation'

//Third Party Imports
import type { ColumnDef } from '@tanstack/react-table'
import { useSelector, useDispatch } from 'react-redux'

//Components Imports
import CustomChip from '@core/components/mui/Chip'
import Table from '@components/table'
import DashboardFilters from './DashboardFilters'
import OptionMenu from '@core/components/option-menu'
import DashboardCard from './DashboardCard'
import EditUser from '@components/views/app-user-management/modal/EditUser'
import ResetPassword from '@components/views/app-user-management/modal/ResetPassword'
import ActionModal from '@components/modal/shared/ActionModal'
import Modal from '@components/modal'
import SkeletonAvatar from '@components/common/SkeletonAvatar'

//Hook Import
import { useModalOpener } from '@hooks/useModalOpener'

//Redux Imports
import type { RootState } from '@features/store'
import { fetchAllAppUsers, updateStatus } from '@features/app-user/thunk'
import { storeAppUserUID } from '@features/app-user/slice'

//Types Imports
import type { AppUser } from '@custom-types/features/appUserManagement'

//Utils and Helpers Imports
import { formatTimestampToDate, getFullName } from '@utils/common'
import { snakeToPascalConverter, statusColor, userStatusMapping } from '@helpers/common'

//Constants Imports
import { PAGE_SIZE } from '@constants/common'

const DashboardTable = () => {
  const { allAppUsers, isAllAppUserLoading, isEditUserSuccess, isAppUserStatusUpdateSuccess } = useSelector(
    (state: RootState) => state.appUserManagement
  )

  //Hooks
  const dispatch = useDispatch()
  const router = useRouter()

  //States
  //Pagination
  const [page, setPage] = useState<number>(1)

  //For Modal Rendering
  const { isOpen, openModal, closeModal, modalConfig } = useModalOpener()

  useEffect(() => {
    dispatch(
      fetchAllAppUsers({
        page,
        elements: 5,
        sortBy: 'DESC'
      }) as any
    )
  }, [isEditUserSuccess, isAppUserStatusUpdateSuccess])

  const columns: ColumnDef<AppUser>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }: any) => (
          <div className='flex items-center gap-3'>
            <SkeletonAvatar src={row?.original?.photo || undefined} size={28} />
            <div className='text-black font-semibold'>
              {getFullName(row?.original?.firstName, row?.original?.lastName)}
            </div>
          </div>
        )
      },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ row }: any) => <p>{row?.original?.email}</p>
      },
      {
        accessorKey: 'associatedPlunges',
        header: 'Associated Plunges',
        cell: ({ row }: any) => (
          <p className='text-[#3E6CFF] font-medium'>{row?.original?.userProductModels.length || 0}</p>
        )
      },
      {
        accessorKey: 'registeredOn',
        header: 'Registered On',
        cell: ({ row }: any) => <p className='text-start'>{formatTimestampToDate(row?.original.createdAt) || '-'}</p>
      },
      {
        accessorKey: 'lastLogin',
        header: 'Last Login',
        cell: ({ row }: any) => <p className='text-start'>{formatTimestampToDate(row?.original.lastLogin) || '-'}</p>
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }: any) => (
          <div className='flex items-center gap-3'>
            <CustomChip
              round='false'
              variant='tonal'
              label={snakeToPascalConverter(userStatusMapping(String(row?.original?.status)))}
              size='small'
              color={statusColor('users', String(row?.original?.status))}
            />
          </div>
        )
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          const appUserItem = row.original
          const status = appUserItem.status

          const options = [
            {
              text: 'View Details',
              menuItemProps: {
                onClick: () => {
                  dispatch(storeAppUserUID(appUserItem))
                  router.push('app-user-management/user-profile')
                }
              }
            },
            {
              text: 'Edit User Details',
              menuItemProps: {
                onClick: () => {
                  openModal({
                    title: 'Edit User Details',
                    content: <EditUser onBtnClick={closeModal} itemData={appUserItem} />,
                    maxWidth: 'md',
                    scroll: 'body',
                    isTitleCenter: true
                  })
                }
              }
            },
            {
              text: 'Reset User Password',
              menuItemProps: {
                disabled: appUserItem?.status === 'pending',
                onClick: () => {
                  openModal({
                    title: 'Reset User Password',
                    content: <ResetPassword onBtnClick={closeModal} itemData={appUserItem} />,
                    isTitleCenter: true
                  })
                }
              }
            },
            status === 'inactive'
              ? {
                  text: 'Activate User',
                  menuItemProps: {
                    onClick: () => {
                      openModal({
                        title: 'Activate User',
                        description: (
                          <>
                            Are you sure you want to activate{' '}
                            <span className='text-black font-semibold'>
                              {getFullName(appUserItem.firstName, appUserItem.lastName)}
                            </span>
                            , he will be able to access the app after this .
                            <br />
                            You can always suspend this user again from the list
                          </>
                        ),
                        content: (
                          <ActionModal
                            actionType='Activate'
                            onRightBtnClick={() =>
                              dispatch(
                                updateStatus({
                                  uid: appUserItem.uid,
                                  data: { status: 'active' },
                                  closeModal
                                }) as any
                              )
                            }
                            onLeftBtnClick={closeModal}
                          />
                        ),
                        isTitleCenter: false
                      })
                    }
                  }
                }
              : {
                  text: 'Suspend User',
                  menuItemProps: {
                    className: 'text-error',
                    disabled: appUserItem?.status === 'pending',
                    onClick: () => {
                      openModal({
                        title: 'Suspend User',
                        description: (
                          <>
                            Are you sure you want to suspend{' '}
                            <span className='text-black font-semibold'>
                              {' '}
                              {getFullName(appUserItem.firstName, appUserItem.lastName)}
                            </span>
                            , he wont be able to access the app after this.
                            <br />
                            You can always active this user again from the list
                          </>
                        ),
                        content: (
                          <ActionModal
                            actionType='Suspend'
                            onRightBtnClick={() =>
                              dispatch(
                                updateStatus({
                                  uid: appUserItem.uid,
                                  data: { status: 'inactive' },
                                  closeModal
                                }) as any
                              )
                            }
                            onLeftBtnClick={closeModal}
                          />
                        ),
                        isTitleCenter: false
                      })
                    }
                  }
                }
          ]

          return (
            <div className='flex items-center'>
              <OptionMenu iconButtonProps={{ size: 'medium' }} iconClassName='text-textSecondary' options={options} />
            </div>
          )
        }
      }
    ],
    []
  )

  return (
    <>
      <Table<AppUser>
        isPaginated={false}
        isLoading={isAllAppUserLoading}
        columns={columns}
        data={allAppUsers?.items?.length ? allAppUsers?.items : []}
        totalElements={allAppUsers?.pagination?.totalElements}
        elementsPerPage={PAGE_SIZE}
        page={page}
        setPage={setPage}
        filters={<DashboardFilters />}
        card={<DashboardCard />}
      />
      {/*//Modal opener hook */}
      {modalConfig && <Modal open={isOpen} handleClose={closeModal} {...modalConfig} />}
    </>
  )
}

export default DashboardTable
