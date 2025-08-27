'use client'

// React Imports
import { useState, useEffect, useMemo } from 'react'

// Third Party Imports
import type { ColumnDef } from '@tanstack/react-table'
import { useSelector, useDispatch } from 'react-redux'

//Type Imports
import type { Music } from '@custom-types/features/musicManagement'

//Components Imports
import MusicManagementFilters from './MusicManagementFilters'
import OptionMenu from '@core/components/option-menu'
import Table from '@components/table'
import Modal from '@components/modal'
import ActionModal from '@components/modal/shared/ActionModal'
import CustomChip from '@core/components/mui/Chip'
import AudioPlayer from '../modal/AudioPlayer'
import AddEditMusic from '../modal'
import SkeletonImg from '@components/common/SkeletonImg'
import UploadProgress from './UploadProgress'

//Context Imports
import { useUploadContext } from '@core/contexts/uploadInstanceContext'

//Redux Imports
import type { RootState } from '@features/store'
import { fetchAllMusics, updateStatus, deleteMusic } from '@features/music-management/thunk'
import { resetMusicUploadProgress } from '@features/music-management/progress/slice'

//Hooks Imports
import { useModalOpener } from '@hooks/useModalOpener'

//Utils And Helpers Imports
import { snakeToPascalConverter, musicStatusMapping } from '@helpers/common'
import { truncateText } from '@utils/common'

// Constants Imports
import { PAGE_SIZE, SORT_BY } from '@constants/common'

const MusicManagementTable = () => {
  //Context
  const { removeUploadInstance, abortAllUploadsAgainstId } = useUploadContext()

  //Hooks
  const dispatch = useDispatch()

  const {
    allMusics,
    isAllMusicLoading,
    isAddMusicSuccess,
    isMusicDeleteSuccess,
    isMusicStatusUpdateSuccess,
    isEditMusicSuccess
  } = useSelector((state: RootState) => state.musicManagement)

  //States
  //Pagination
  const [page, setPage] = useState<number>(1)

  //Filter
  const [filters, setFilters] = useState<any>({
    name: '',
    status: null,
    licenseTypeId: null,
    playlistId: null
  })

  //Modal
  const [openUploadModal, setOpenUploadModal] = useState<boolean>(false)

  //Edit
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [selectedRow, setSelectedRow] = useState<any>(null)

  useEffect(() => {
    dispatch(
      fetchAllMusics({
        page,
        elements: PAGE_SIZE,
        sortBy: SORT_BY,
        name: filters?.name,
        status: filters?.status,
        licenseTypeId: filters?.licenseTypeId,
        playlistId: filters?.playlistId
      }) as any
    )
  }, [
    page,
    filters?.status,
    filters?.licenseTypeId,
    filters?.playlistId,
    isAddMusicSuccess,
    isMusicDeleteSuccess,
    isMusicStatusUpdateSuccess,
    isEditMusicSuccess
  ])

  //Modal Manager Hook
  const { isOpen, openModal, closeModal, modalConfig } = useModalOpener()

  const columns: ColumnDef<Music>[] = useMemo(
    () => [
      {
        accessorKey: 'musicTitle',
        header: 'Music Title',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <SkeletonImg
              src={row.original?.thumbnail}
              alt='music'
              width={45}
              height={40}
              className='object-cover rounded-sm'
            />
            <div className='flex flex-col'>
              <p className='text-black font-medium'>{truncateText(row.original?.name, 25)}</p>
              <p className='text-[#888888] font-normal text-xs'>{truncateText(row.original?.artistName, 25)}</p>
            </div>
          </div>
        )
      },
      {
        accessorKey: 'playlistName',
        header: 'Playlist',
        cell: ({ row }) => <p>{row?.original?.playlist?.name || '-'}</p>
      },
      {
        accessorKey: 'playlistCount',
        header: 'Playlist Count',
        cell: ({ row }) => <p>{row?.original?.playlist?.count}</p>
      },
      {
        accessorKey: 'playCount',
        header: 'Play Count',
        cell: ({ row }) => <p>{row?.original?.count}</p>
      },
      {
        accessorKey: 'licenseType',
        header: 'License Type',
        cell: ({ row }) => <p>{row?.original?.licenseType?.name || '-'}</p>
      },
      {
        accessorKey: 'uploadStatus',
        header: 'Upload Status',
        cell: ({ row }) => <UploadProgress musicItem={row.original} />
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            <CustomChip
              round='false'
              variant='tonal'
              label={snakeToPascalConverter(musicStatusMapping(String(row?.original?.status)))}
              size='small'
              color={row?.original.status === 'active' ? 'success' : 'error'}
            />
          </div>
        )
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          const musicItem = row.original
          const status = musicItem?.status

          const options = [
            ...(musicItem?.audioUploadId === null
              ? [
                  {
                    text: 'Play Song',
                    menuItemProps: {
                      onClick: () =>
                        openModal({
                          title: 'Music Player',
                          description: null,
                          content: <AudioPlayer item={musicItem} handleClose={closeModal} />,
                          isXPaddingDisabled: true
                        })
                    }
                  }
                ]
              : []),
            ...(musicItem?.audioUploadId === null
              ? [
                  {
                    text: 'Edit Music',
                    menuItemProps: {
                      // disabled: musicItem?.isUsedInSession,
                      // ...(musicItem?.isUsedInSession && {
                      //   isToolTip: true,
                      //   toolTipText: 'Used in session'
                      // }),
                      onClick: async () => {
                        setIsEdit(true)
                        setSelectedRow(musicItem)
                        setOpenUploadModal(true)
                      }
                    }
                  }
                ]
              : []),
            status === 'active'
              ? {
                  text: 'Archive Music',
                  menuItemProps: {
                    onClick: () => {
                      openModal({
                        title: 'Change Status?',
                        description: (
                          <>
                            Are you sure you want to archive{' '}
                            <span className='text-black font-semibold'>{row.original?.name}</span>? You can activate
                            this again later.
                          </>
                        ),
                        content: (
                          <ActionModal
                            actionType='Archive'
                            onRightBtnClick={() =>
                              dispatch(
                                updateStatus({
                                  id: musicItem.id,
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
              : {
                  text: 'Activate Music',
                  menuItemProps: {
                    onClick: () => {
                      openModal({
                        title: 'Change Status?',
                        description: (
                          <>
                            Are you sure you want to activate{' '}
                            <span className='text-black font-semibold'>{row.original?.name}</span>? You can archive this
                            again later.
                          </>
                        ),
                        content: (
                          <ActionModal
                            actionType='Activate'
                            onRightBtnClick={() =>
                              dispatch(
                                updateStatus({
                                  id: musicItem.id,
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
                },
            {
              text: 'Delete Music',
              menuItemProps: {
                disabled: musicItem?.isUsedInSession,
                ...(musicItem?.isUsedInSession && {
                  isToolTip: true,
                  toolTipText: 'Used in session'
                }),
                className: 'text-error',
                onClick: () =>
                  openModal({
                    title: 'Delete Music?',
                    description: (
                      <>
                        Are you sure you want to delete this{' '}
                        <span className='text-black font-semibold'>{row.original?.name},</span> this cant be undone
                      </>
                    ),
                    content: (
                      <ActionModal
                        actionType='Delete'
                        onRightBtnClick={() => {
                          dispatch(deleteMusic({ itemData: musicItem, closeModal }) as any)
                          dispatch(resetMusicUploadProgress({ id: musicItem?.id }))
                          abortAllUploadsAgainstId(musicItem?.id)

                          if (musicItem?.audioUploadId) {
                            removeUploadInstance(musicItem?.id, musicItem?.audioUploadId)
                          }
                        }}
                        onLeftBtnClick={closeModal}
                      />
                    ),
                    isTitleCenter: false
                  })
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
      <Table<Music>
        isLoading={isAllMusicLoading}
        columns={columns}
        data={allMusics?.items?.length ? allMusics?.items : []}
        totalElements={allMusics?.pagination?.totalElements}
        elementsPerPage={PAGE_SIZE}
        page={page}
        setPage={setPage}
        filters={
          <MusicManagementFilters
            setOpenModal={setOpenUploadModal}
            page={page}
            setPage={setPage}
            filters={filters}
            setFilters={setFilters}
          />
        }
      />
      {/* Modal opener hook */}
      {modalConfig && <Modal open={isOpen} handleClose={closeModal} {...modalConfig} />}
      <Modal
        maxWidth='md'
        scroll='body'
        isTitleCenter={true}
        title={isEdit ? 'Edit Music' : 'Upload New Music'}
        description={null}
        open={openUploadModal}
        handleClose={() => {
          setOpenUploadModal(false)
          setIsEdit(false)
        }}
        content={
          <AddEditMusic
            handleClose={() => {
              setOpenUploadModal(false)
              setIsEdit(false)
            }}
            isEdit={isEdit}
            itemData={selectedRow}
          />
        }
      />
    </>
  )
}

export default MusicManagementTable
