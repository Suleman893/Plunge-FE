'use client'

//React Imports
import { useState, useEffect, useMemo } from 'react'

//Next Imports
import { useRouter } from 'next/navigation'

//MUI Imports
import Tooltip from '@mui/material/Tooltip'
import Divider from '@mui/material/Divider'

//Third Party Imports
import type { ColumnDef } from '@tanstack/react-table'
import { useSelector, useDispatch } from 'react-redux'

//Component Imports
import Table from '@components/table'
import Modal from '@components/modal'
import UserManagementFilters from './UserManagementFilter'
import CustomChip from '@core/components/mui/Chip'
import OptionMenu from '@core/components/option-menu'
import SkeletonAvatar from '@components/common/SkeletonAvatar'
import ActionModal from '@components/modal/shared/ActionModal'
import ResetPassword from '@components/views/app-user-management/modal/ResetPassword'
import EditUser from '@components/views/app-user-management/modal/EditUser'

//Hook Import
import { useModalOpener } from '@hooks/useModalOpener'

//Redux Imports
import type { RootState } from '@features/store'
import { fetchAllAppUsers, updateStatus } from '@features/app-user/thunk'
import { storeAppUserUID } from '@features/app-user/slice'

//Types Imports
import type { AppUser } from '@custom-types/features/appUserManagement'

//Utils and Helper Imports
import { formatTimestampToDate, getFullName } from '@utils/common'
import { snakeToPascalConverter, statusColor, userStatusMapping } from '@helpers/common'

//Constants Imports
import { PAGE_SIZE } from '@constants/common'

const UserManagementTable = () => {
  const { allAppUsers, isAllAppUserLoading, isEditUserSuccess, isAppUserStatusUpdateSuccess } = useSelector(
    (state: RootState) => state.appUserManagement
  )

  //Hooks
  const dispatch = useDispatch()
  const router = useRouter()

  //States
  //Pagination
  const [page, setPage] = useState<number>(1)

  //Filter
  const [filters, setFilters] = useState<any>({
    sortBy: 'DESC',
    status: null,
    nameOrEmail: ''
  })

  //For Modal Rendering
  const { isOpen, openModal, closeModal, modalConfig } = useModalOpener()

  useEffect(() => {
    dispatch(
      fetchAllAppUsers({
        page,
        elements: PAGE_SIZE,
        sortBy: filters?.sortBy,
        status: filters?.status
      }) as any
    )
  }, [page, filters?.sortBy, filters?.status, isEditUserSuccess, isAppUserStatusUpdateSuccess])

  const PlungeTooltipContent = ({ data }: any) => (
    <div className='flex flex-col gap-2 p-2'>
      <p className='text-sm font-medium'>Total {data?.length || 0} Device</p>
      <Divider />
      {data?.length > 0 &&
        data?.map((item: any) => (
          <div key={item?.id} className='flex flex-col gap-1'>
            <p>{item?.name}</p>
            <p className='font-normal text-[10px] text-[#666666]'>{item?.deviceId}</p>
          </div>
        ))}
    </div>
  )

  const columns: ColumnDef<AppUser>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }: any) => (
          <div className='flex items-center gap-3'>
            <SkeletonAvatar src={row?.original?.photo} size={28} />
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
        cell: ({ row }: any) => {
          const userProductModels = row?.original?.userProductModels || []
          const userProductModelCount = userProductModels?.length

          return userProductModelCount > 0 ? (
            <Tooltip
              title={<PlungeTooltipContent data={userProductModels} />}
              arrow
              slotProps={{
                tooltip: {
                  sx: {
                    bgcolor: 'white',
                    color: 'black',
                    border: '1px solid #e5e7eb',
                    boxShadow: 3,
                    fontSize: '12px',
                    p: 2,
                    borderRadius: 1,
                    '& .MuiTooltip-arrow': {
                      color: 'white'
                    }
                  }
                },
                popper: {
                  modifiers: [
                    {
                      name: 'offset',
                      options: {
                        offset: [0, 8]
                      }
                    }
                  ]
                }
              }}
            >
              <p className='text-primary font-semibold text-center'>{userProductModelCount}</p>
            </Tooltip>
          ) : (
            <p className='text-primary font-semibold text-center'>{userProductModelCount}</p>
          )
        }
      },
      {
        accessorKey: 'registeredOn',
        header: 'Registered On',
        cell: ({ row }: any) => <p className='text-center'>{formatTimestampToDate(row?.original.createdAt)}</p>
      },
      {
        accessorKey: 'lastLogin',
        header: 'Last Login',
        cell: ({ row }: any) => <p className='text-center'>{formatTimestampToDate(row?.original.lastLogin) || '-'}</p>
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
        id: 'action',
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
        isLoading={isAllAppUserLoading}
        columns={columns}
        data={allAppUsers?.items?.length ? allAppUsers?.items : []}
        totalElements={allAppUsers?.pagination?.totalElements}
        elementsPerPage={PAGE_SIZE}
        page={page}
        setPage={setPage}
        filters={<UserManagementFilters page={page} setPage={setPage} filters={filters} setFilters={setFilters} />}
      />
      {/*//Modal opener hook */}
      {modalConfig && <Modal open={isOpen} handleClose={closeModal} {...modalConfig} />}
    </>
  )
}

export default UserManagementTable
