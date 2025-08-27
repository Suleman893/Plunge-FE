'use client'

//React Imports
import { useState, useEffect, useMemo } from 'react'

//Third Party Imports
import type { ColumnDef } from '@tanstack/react-table'
import { useSelector, useDispatch } from 'react-redux'

//Components Imports
import UserFilters from './UserFilters'
import Table from '@components/table'
import OptionMenu from '@core/components/option-menu'
import Modal from '@components/modal'
import CustomChip from '@core/components/mui/Chip'
import ActionModal from '@components/modal/shared/ActionModal'
import ResetPassword from '../modal/ResetPassword'
import EditUserDetails from '../modal/EditUserDetails'
import SkeletonAvatar from '@components/common/SkeletonAvatar'

//Constants Import
import { PAGE_SIZE, SORT_BY } from '@constants/common'

//Hook Import
import { useModalOpener } from '@hooks/useModalOpener'

//Redux Imports
import { fetchAllUsers, updateStatus, deleteUser } from '@features/users/thunk'
import type { RootState } from '@features/store'

//Types Imports
import type { User } from '@custom-types/features/user'

//Utils And Helpers Imports
import { formatTimestampToDate, getFullName } from '@utils/common'
import { snakeToPascalConverter, statusColor, userStatusMapping } from '@helpers/common'

const UserTable = () => {
  //Hooks
  const dispatch = useDispatch()

  //For Modal rendering
  const { isOpen, openModal, closeModal, modalConfig } = useModalOpener()

  const {
    isAllUsersLoading,
    isAddUserSuccess,
    allUsers,
    isUserStatusUpdateSuccess,
    isUserDeleteSuccess,
    isEditUserDetailSuccess
  } = useSelector((state: RootState) => state.users)

  const { isEditRoleSuccess } = useSelector((state: RootState) => state.role)

  //States
  //Pagination
  const [page, setPage] = useState<number>(1)

  //Filter
  const [filters, setFilters] = useState<any>({
    nameOrEmail: '',
    roleId: null,
    status: null
  })

  useEffect(() => {
    dispatch(
      fetchAllUsers({
        page,
        elements: PAGE_SIZE,
        sortBy: SORT_BY,
        nameOrEmail: filters?.nameOrEmail,
        roleId: filters?.roleId,
        status: filters?.status
      }) as any
    )
  }, [
    page,
    filters?.roleId,
    filters?.status,
    isAddUserSuccess,
    isUserStatusUpdateSuccess,
    isUserDeleteSuccess,
    isEditUserDetailSuccess,
    isEditRoleSuccess
  ])

  const columns: ColumnDef<User>[] = useMemo(
    () => [
      {
        accessorKey: 'firstName',
        header: 'Full Name',
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            <SkeletonAvatar src={row?.original?.photo || undefined} size={28} />
            <p>{getFullName(row?.original?.firstName, row?.original?.lastName)}</p>
          </div>
        )
      },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ getValue }) => getValue()
      },
      {
        accessorKey: 'role',
        header: 'Role',
        cell: ({ row }) => <span>{snakeToPascalConverter(String(row?.original?.role?.name))}</span>
      },
      {
        accessorKey: 'createdAt',
        header: 'Added On',
        cell: ({ row }) => <span>{formatTimestampToDate(row?.original.createdAt)}</span>
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
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
          const userItem = row.original
          const status = userItem.status

          const options = [
            {
              text: 'Edit User Details & Role',
              menuItemProps: {
                onClick: () =>
                  openModal({
                    title: 'Edit User Details',
                    content: <EditUserDetails onBtnClick={closeModal} itemData={userItem} />,
                    maxWidth: 'md',
                    scroll: 'body',
                    isTitleCenter: true
                  })
              }
            },
            {
              text: 'Reset User Password',
              menuItemProps: {
                disabled: userItem?.status === 'pending',
                onClick: () =>
                  openModal({
                    title: 'Reset User Password',
                    content: <ResetPassword onBtnClick={closeModal} itemData={userItem} />,
                    isTitleCenter: true
                  })
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
                              {getFullName(userItem.firstName, userItem.lastName)}
                            </span>
                            ? You can suspend this user later.
                          </>
                        ),
                        content: (
                          <ActionModal
                            actionType='Activate'
                            onRightBtnClick={() =>
                              dispatch(
                                updateStatus({
                                  uid: userItem.uid,
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
                    disabled: userItem?.status === 'pending',
                    className: 'text-error',
                    onClick: () => {
                      openModal({
                        title: 'Suspend User',
                        description: (
                          <>
                            Are you sure you want to suspend{' '}
                            <span className='text-black font-semibold'>
                              {getFullName(userItem.firstName, userItem.lastName)}?
                            </span>
                            , you can active this user again from here.
                          </>
                        ),
                        content: (
                          <ActionModal
                            actionType='Suspend'
                            onRightBtnClick={() =>
                              dispatch(
                                updateStatus({
                                  uid: userItem.uid,
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
                },
            {
              text: 'Delete User',
              menuItemProps: {
                className: 'text-error',
                onClick: () => {
                  openModal({
                    title: 'Delete User?',
                    description: (
                      <>
                        Are you sure you want to delete{' '}
                        <span className='text-black font-semibold'>
                          {getFullName(userItem?.firstName, userItem?.lastName)}?
                        </span>
                        , by this all of the access this user has will be lost and this action can’t be undone
                      </>
                    ),
                    content: (
                      <ActionModal
                        actionType='Delete'
                        onRightBtnClick={() => {
                          dispatch(
                            deleteUser({
                              uid: userItem.uid,
                              closeModal
                            }) as any
                          )
                        }}
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
      <Table<User>
        isLoading={isAllUsersLoading}
        columns={columns}
        data={allUsers?.items?.length ? allUsers?.items : []}
        totalElements={allUsers?.pagination?.totalElements}
        elementsPerPage={PAGE_SIZE}
        page={page}
        setPage={setPage}
        filters={<UserFilters page={page} setPage={setPage} filters={filters} setFilters={setFilters} />}
      />
      {/* //Modal opener hook */}
      {modalConfig && <Modal open={isOpen} handleClose={closeModal} {...modalConfig} />}
    </>
  )
}

export default UserTable
