'use client'

// React Imports
import { useState, useEffect, useMemo } from 'react'

//Next Imports
import { useRouter } from 'next/navigation'

// Third Party Imports
import type { ColumnDef } from '@tanstack/react-table'
import { useSelector, useDispatch } from 'react-redux'

//Type Imports
import type { PlungeModel } from '@custom-types/features/plungeModel'

import type { ActionModalData, ActionType } from '@custom-types/components/modals/index'

//Components Imports
import PlungeModelFilters from './PlungeModelFilters'
import OptionMenu from '@core/components/option-menu'
import Table from '@components/table'
import Modal from '@components/modal'
import ActionModal from '@components/modal/shared/ActionModal'
import CustomChip from '@core/components/mui/Chip'
import SkeletonImg from '@components/common/SkeletonImg'
import UploadProgress from './UploadProgress'

//Redux Imports
import type { RootState } from '@features/store'
import { deletePlungeModel, fetchAllPlungeModels, updatePlungeStatus } from '@features/plunge-model/thunk'
import { storePlungeInfo } from '@features/plunge-model/slice'
import { resetPlungeModelUploadProgressById } from '@features/plunge-model/progress/slice'

//Context Imports
import { useUploadContext } from '@core/contexts/uploadInstanceContext'

//Utils And Helpers Imports
import { snakeToPascalConverter, statusColor, plungeModelStatusMapping } from '@helpers/common'
import { truncateText } from '@utils/common'

// Constants Imports
import { PAGE_SIZE, SORT_BY } from '@constants/common'
import { actionModalDefault } from '@constants/actionModalDefault'

const PlungeModelTable = () => {
  //Context
  const { removeUploadInstance, abortAllUploadsAgainstId } = useUploadContext()

  //Hooks
  const router = useRouter()
  const dispatch = useDispatch()

  const { isAllPlungeModelLoading, allPlungeModels, isPlungeStatusUpdateSuccess, isPlungeDeleteSuccess } = useSelector(
    (state: RootState) => state.plungeModel
  )

  //States
  //Pagination
  const [page, setPage] = useState<number>(1)

  //Filter
  const [filters, setFilters] = useState({
    productModelName: '',
    status: null
  })

  //Modal
  const [selectedRow, setSelectedRow] = useState<PlungeModel | null>(null)
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [modalData, setModalData] = useState<ActionModalData>(actionModalDefault)

  useEffect(() => {
    dispatch(
      fetchAllPlungeModels({
        page,
        elements: PAGE_SIZE,
        sortBy: SORT_BY,
        productModelName: filters?.productModelName,
        status: filters?.status
      }) as any
    )
  }, [page, filters?.status, isPlungeStatusUpdateSuccess, isPlungeDeleteSuccess])

  const handleAction = () => {
    if (!selectedRow) return

    switch (modalData.actionType) {
      case 'Delete':
        dispatch(deletePlungeModel({ selectedItem: selectedRow, setOpenModal }) as any)
        dispatch(resetPlungeModelUploadProgressById({ id: selectedRow.id }))
        abortAllUploadsAgainstId(selectedRow?.id)

        if (selectedRow?.setupVideoUploadId) {
          removeUploadInstance(selectedRow?.id, selectedRow?.setupVideoUploadId)
        }

        if (selectedRow?.pairingVideoUploadId) {
          removeUploadInstance(selectedRow?.id, selectedRow?.pairingVideoUploadId)
        }

        if (selectedRow?.troubleShootVideoUploadId) {
          removeUploadInstance(selectedRow?.id, selectedRow?.troubleShootVideoUploadId)
        }

        break
      case 'Disable':
        dispatch(updatePlungeStatus({ id: selectedRow.id, data: { status: 'inactive' }, setOpenModal }) as any)
        break
      case 'Activate':
        dispatch(updatePlungeStatus({ id: selectedRow.id, data: { status: 'active' }, setOpenModal }) as any)
        break
    }
  }

  const openActionModal = (action: ActionType, row?: any) => {
    if (!row) return
    setSelectedRow(row)

    switch (action) {
      case 'Delete':
        setModalData({
          title: 'Delete Plunge Model?',
          description: (
            <>
              Are you sure you want to delete <span className='text-black font-semibold'>{row?.name}</span>? This cant
              be undone.
            </>
          ),
          actionType: 'Delete'
        })
        break
      case 'Disable':
        setModalData({
          title: 'Disable Plunge Model?',
          description: (
            <>
              Are you sure you want to disable <span className='text-black font-semibold'>{row?.name}</span>, you can
              active this again too
            </>
          ),
          actionType: 'Disable'
        })
        break
      case 'Activate':
        setModalData({
          title: 'Activate Plunge Model?',
          description: (
            <>
              Are you sure you want to enable <span className='text-black font-semibold'>{row?.name}</span>, you can
              disable this again too
            </>
          ),
          actionType: 'Activate'
        })
        break
    }

    setOpenModal(true)
  }

  const columns: ColumnDef<PlungeModel>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Model Display Name',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <SkeletonImg
              src={row.original?.thumbnail}
              alt='plunge-model'
              width={40}
              height={30}
              className='object-cover rounded-sm'
            />
            {truncateText(row.original?.name, 25)}
          </div>
        )
      },
      {
        accessorKey: 'modelId',
        header: 'Model ID',
        cell: ({ getValue }) => getValue()
      },
      {
        accessorKey: 'hardwareName',
        header: 'Tuya Hardware name',
        cell: ({ row }) => <p>{row.original.tuyaProduct?.productName}</p>
      },
      {
        accessorKey: 'uploadStatus',
        header: 'Upload Status',
        cell: ({ row }) => <UploadProgress plungeItem={row.original} />
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            <CustomChip
              round='false'
              variant='tonal'
              label={snakeToPascalConverter(plungeModelStatusMapping(String(row?.original?.status)))}
              size='small'
              color={statusColor('plunge-models', String(row?.original?.status))}
            />
          </div>
        )
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          const plunge = row?.original
          const status = plunge?.status

          const options = [
            ...(plunge?.pairingVideoUploadId === null &&
            plunge?.setupVideoUploadId === null &&
            plunge?.troubleShootVideoUploadId === null
              ? [
                  {
                    text: 'Edit Model Details',
                    menuItemProps: {
                      disabled: plunge?.isUsedInSession,
                      ...(plunge?.isUsedInSession && {
                        isToolTip: true,
                        toolTipText: 'Used in session'
                      }),
                      onClick: () => {
                        dispatch(storePlungeInfo(plunge))
                        router.push('/plunge-models/edit')
                      }
                    }
                  }
                ]
              : []),
            {
              text: status === 'active' ? 'Disable Model' : 'Activate Model',
              menuItemProps: {
                onClick: () => openActionModal(status === 'active' ? 'Disable' : 'Activate', plunge)
              }
            },
            {
              text: 'Delete Model',
              menuItemProps: {
                disabled: plunge?.isUsedInSession,
                ...(plunge?.isUsedInSession && {
                  isToolTip: true,
                  toolTipText: 'Used in session'
                }),
                className: 'text-error',
                onClick: () => openActionModal('Delete', plunge)
              }
            }
          ]

          return (
            <div className='flex items-center'>
              <OptionMenu iconButtonProps={{ size: 'medium' }} iconClassName='text-textSecondary' options={options} />
            </div>
          )
        },
        enableSorting: false
      }
    ],
    []
  )

  return (
    <>
      <Table<PlungeModel>
        isLoading={isAllPlungeModelLoading}
        columns={columns}
        data={allPlungeModels?.items?.length ? allPlungeModels?.items : []}
        totalElements={allPlungeModels?.pagination?.totalElements}
        elementsPerPage={PAGE_SIZE}
        page={page}
        setPage={setPage}
        filters={<PlungeModelFilters page={page} setPage={setPage} filters={filters} setFilters={setFilters} />}
      />
      <Modal
        title={modalData.title}
        description={modalData.description}
        open={openModal}
        handleClose={() => setOpenModal(false)}
        content={
          <ActionModal
            actionType={modalData.actionType}
            onRightBtnClick={handleAction}
            onLeftBtnClick={() => setOpenModal(false)}
          />
        }
      />
    </>
  )
}

export default PlungeModelTable
