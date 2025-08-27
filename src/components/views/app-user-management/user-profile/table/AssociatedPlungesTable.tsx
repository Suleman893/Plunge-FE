'use client'

//React Imports
import { useState, useMemo, useEffect } from 'react'

//Third Party Imports
import { useDispatch, useSelector } from 'react-redux'
import type { ColumnDef } from '@tanstack/react-table'
import classnames from 'classnames'

//Components Imports
import Table from '@components/table'
import SideDrawer from '@components/drawer'
import AssociatedPlungeFilters from './AssociatedPlungeFilters'
import DeviceDetails from '../drawer/DeviceDetails'
import SkeletonImg from '@components/common/SkeletonImg'

//Redux Imports
import { fetchAssociatedPlunges } from '@features/app-user/thunk'
import type { RootState } from '@features/store'

//Constants Imports
import { PAGE_SIZE, SORT_BY } from '@constants/common'

//Helpers And Utils Imports
import { capitalizeFirst, formatTimestampToDate } from '@utils/common'

const AssociatedPlungesTable = () => {
  //Hooks
  const { appUserId } = useSelector((state: RootState) => state.appUserManagement)

  const { isAllAssociatedPlungesLoading, allAssociatedPlunges } = useSelector(
    (state: RootState) => state.appUserManagement
  )

  const dispatch = useDispatch()

  //States
  //Drawer
  const [openDrawer, setOpenDrawer] = useState<boolean>(false)

  //Page
  const [page, setPage] = useState<number>(1)

  //Filter
  const [filters, setFilters] = useState<any>({
    nameOrModelId: ''
  })

  useEffect(() => {
    dispatch(
      fetchAssociatedPlunges({
        userId: appUserId,
        page,
        elements: PAGE_SIZE,
        sortBy: SORT_BY,
        nameOrModelId: filters?.nameOrModelId
      }) as any
    )
  }, [page])

  const columns: ColumnDef<any>[] = useMemo(
    () => [
      {
        accessorName: 'displayName',
        header: 'Model Display Name',
        cell: ({ row }: any) => (
          <div className='flex items-center gap-3'>
            <SkeletonImg
              src={row?.original?.productModel?.thumbnail}
              alt='plunge'
              width={40}
              height={30}
              className='object-cover rounded-sm'
            />
            <div className='text-black font-semibold'>{row?.original?.name || '-'}</div>
          </div>
        )
      },
      {
        accessorName: 'modelId',
        header: 'Model Id',
        cell: ({ row }: any) => <p>{row?.original?.productModel?.modelId || '-'}</p>
      },
      {
        accessorName: 'tuyaHardwareName',
        header: 'Tuya Hardware Name',
        cell: ({ row }: any) => <p>{row?.original?.productModel?.tuyaProduct?.productId || '-'}</p>
      },
      {
        accessorName: 'dateAdded',
        header: 'Added Date',
        cell: ({ row }: any) => <p>{formatTimestampToDate(row?.original?.createdAt, 'D, MMM YYYY') || '-'}</p>
      },
      {
        accessorName: 'status',
        header: 'Status',
        cell: ({ row }: any) => (
          <p>
            <span
              className={classnames({
                'text-[#28C76F] font-normal': row?.original?.productModel?.status == 'active'
              })}
            >
              {capitalizeFirst(row?.original?.productModel?.status)}
            </span>
            {/* {' | '}
            <span
              className={classnames({
                'text-[#28C76F] font-normal': row?.original.onlineStatus == 'Online'
              })}
            >
              {row?.original.onlineStatus}
            </span> */}
          </p>
        )
      },
      {
        accessorName: 'action',
        header: 'Actions',
        cell: () => (
          <p className='text-primary font-semibold cursor-pointer' onClick={() => setOpenDrawer(true)}>
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
        isLoading={isAllAssociatedPlungesLoading}
        columns={columns}
        data={allAssociatedPlunges?.items?.length ? allAssociatedPlunges?.items : []}
        totalElements={allAssociatedPlunges?.pagination?.totalElements}
        elementsPerPage={PAGE_SIZE}
        page={page}
        setPage={setPage}
        filters={<AssociatedPlungeFilters page={page} setPage={setPage} filters={filters} setFilters={setFilters} />}
      />
      {openDrawer && (
        <SideDrawer
          title='Device Details'
          open={openDrawer}
          handleClose={() => setOpenDrawer(false)}
          form={<DeviceDetails />}
        />
      )}
    </>
  )
}

export default AssociatedPlungesTable
