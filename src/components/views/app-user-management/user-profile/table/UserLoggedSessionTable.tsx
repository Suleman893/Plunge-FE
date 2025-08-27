'use client'

//React Imports
import { useState, useMemo, useEffect } from 'react'

//Third Party Imports
import type { ColumnDef } from '@tanstack/react-table'
import { useSelector, useDispatch } from 'react-redux'

//Components Imports
import Table from '@components/table'
import SideDrawer from '@components/drawer'
import UserLoggedSessionFilters from './UserLoggedSessionFilters'
import SessionDetails from '../drawer/SessionDetail'
import SkeletonImg from '@components/common/SkeletonImg'

//Redux Imports
import { fetchLoggedSessions } from '@features/app-user/thunk'
import type { RootState } from '@features/store'

//Constants Imports
import { PAGE_SIZE, SORT_BY } from '@constants/common'

//Helpers and Utils Imports
import { snakeToPascalConverter } from '@helpers/common'
import { formatTimestampToDate } from '@utils/common'

const UserLoggedSessionTable = () => {
  const { appUserId } = useSelector((state: RootState) => state.appUserManagement)

  const { allLoggedSession, isAllLoggedSessionLoading } = useSelector((state: RootState) => state.appUserManagement)

  //Hooks
  const dispatch = useDispatch()

  //States
  //Drawer
  const [openDrawer, setOpenDrawer] = useState<boolean>(false)

  //Page
  const [page, setPage] = useState<number>(1)

  //Filters
  const [filters, setFilters] = useState<any>({
    name: ''
  })

  const [selectedSession, setSelectedSession] = useState<any>(null)

  useEffect(() => {
    dispatch(
      fetchLoggedSessions({
        userId: appUserId,
        page,
        elements: PAGE_SIZE,
        sortBy: SORT_BY,
        name: filters?.name
      }) as any
    )
  }, [page])

  const columns: ColumnDef<any>[] = useMemo(
    () => [
      {
        accessorName: 'sessionName',
        header: 'Session Name',
        cell: ({ row }: any) => (
          <div className='flex items-center gap-3'>
            <SkeletonImg
              src={
                row?.original?.sessionType === 'video_guided'
                  ? row?.original?.video?.thumbnail
                  : '/images/app-user/self-guided-session.jpg'
              }
              alt='session'
              width={34}
              height={34}
              className='object-cover rounded-sm'
            />

            <div className='font-semibold'>{row?.original?.name}</div>
          </div>
        )
      },
      {
        accessorName: 'type',
        header: 'Type',
        cell: ({ row }: any) => (
          <p>{row?.original?.sessionType ? snakeToPascalConverter(row?.original?.sessionType) : '-'}</p>
        )
      },
      {
        accessorName: 'timeLogged',
        header: 'Logged Time',
        cell: ({ row }: any) => <p>{row?.original?.goalTime || '-'}</p>
      },
      {
        accessorName: 'dateAdded',
        header: 'Added Date',
        cell: ({ row }: any) => <p>{formatTimestampToDate(row?.original?.createdAt, 'D, MMM YYYY') || '-'}</p>
      },
      {
        accessor: 'Actions',
        header: 'Actions',
        cell: ({ row }: any) => (
          <p
            className='text-primary font-semibold cursor-pointer'
            onClick={() => {
              setOpenDrawer(true)
              setSelectedSession(row?.original)
            }}
          >
            View Details
          </p>
        )
      }
    ],
    []
  )

  return (
    <>
      <Table<any>
        isLoading={isAllLoggedSessionLoading}
        columns={columns}
        data={allLoggedSession?.items?.length ? allLoggedSession?.items : []}
        totalElements={allLoggedSession?.pagination?.totalElements}
        elementsPerPage={PAGE_SIZE}
        page={page}
        setPage={setPage}
        filters={<UserLoggedSessionFilters page={page} setPage={setPage} filters={filters} setFilters={setFilters} />}
      />
      {openDrawer && (
        <SideDrawer
          title='Session Details'
          open={openDrawer}
          handleClose={() => setOpenDrawer(false)}
          form={<SessionDetails itemData={selectedSession} />}
        />
      )}
    </>
  )
}

export default UserLoggedSessionTable
