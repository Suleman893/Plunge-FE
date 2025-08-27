'use client'

//React Imports
import { useState, useEffect, useMemo } from 'react'

//Third Party Imports
import type { ColumnDef } from '@tanstack/react-table'
import { useSelector, useDispatch } from 'react-redux'

//Type Imports
import type { Video } from '@custom-types/features/videoManagement'

//Components Imports
import Table from '@components/table'
import Modal from '@components/modal'
import OptionMenu from '@core/components/option-menu'
import ActionModal from '@components/modal/shared/ActionModal'
import CustomChip from '@core/components/mui/Chip'
import VideoManagementFilters from './VideoManagementFilters'
import AddEditVideo from '@components/views/video-management/modal/index'
import VideoPlayer from '../modal/VideoPlayer'
import SkeletonImg from '@components/common/SkeletonImg'
import UploadProgress from './UploadProgress'

//Redux Imports
import type { RootState } from '@features/store'
import { fetchAllVideos, updateStatus, deleteVideo } from '@features/video-management/thunk'
import { resetVideoUploadProgress } from '@features/video-management/progress/slice'

//Context Imports
import { useUploadContext } from '@core/contexts/uploadInstanceContext'

//Hooks Imports
import { useModalOpener } from '@hooks/useModalOpener'

//Utils And Helpers Imports
import { snakeToPascalConverter, videoStatusMapping } from '@helpers/common'
import { truncateText } from '@utils/common'

// Constants Imports
import { PAGE_SIZE, SORT_BY } from '@constants/common'

const VideoManagementTable = () => {
  //Context
  const { removeUploadInstance, abortAllUploadsAgainstId } = useUploadContext()

  //Hooks
  const dispatch = useDispatch()

  const {
    allVideos,
    isAllVideoLoading,
    isAddVideoSuccess,
    isVideoStatusUpdateSuccess,
    isVideoDeleteSuccess,
    isEditVideoSuccess
  } = useSelector((state: RootState) => state.videoManagement)

  //States
  //Pagination
  const [page, setPage] = useState<number>(1)

  //Filter
  const [filters, setFilters] = useState({
    name: '',
    status: null,
    mood: null,
    videoTypeId: null
  })

  //Modal
  const [openUploadModal, setOpenUploadModal] = useState<boolean>(false)

  //Edit
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [selectedRow, setSelectedRow] = useState<any>(null)

  useEffect(() => {
    dispatch(
      fetchAllVideos({
        page,
        elements: PAGE_SIZE,
        sortBy: SORT_BY,
        name: filters?.name,
        status: filters?.status,
        videoTypeId: filters?.videoTypeId,
        mood: filters?.mood
      }) as any
    )
  }, [
    page,
    filters?.status,
    filters?.mood,
    filters?.videoTypeId,
    isAddVideoSuccess,
    isVideoStatusUpdateSuccess,
    isEditVideoSuccess,
    isVideoDeleteSuccess
  ])

  //Modal Manager Hook
  const { isOpen, openModal, closeModal, modalConfig } = useModalOpener()

  const columns: ColumnDef<Video>[] = useMemo(
    () => [
      {
        accessorKey: 'title',
        header: 'Title',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <SkeletonImg
              src={row.original?.thumbnail}
              alt='video'
              width={45}
              height={40}
              className='object-cover rounded-sm'
            />
            <div className='flex flex-col'>
              <p className='text-black font-medium'>{truncateText(row.original?.name, 25)}</p>
              <p className='text-[#888888] font-normal text-xs'>
                {truncateText(row.original?.videoInstructor?.name, 25)}
              </p>
            </div>
          </div>
        )
      },
      {
        accessorKey: 'videoType',
        header: 'Video Type',
        cell: ({ row }) => <p>{snakeToPascalConverter(row?.original?.videoType?.name) || '-'}</p>
      },
      {
        accessorKey: 'lengthType',
        header: 'Length Type',
        cell: ({ row }) => <p>{snakeToPascalConverter(row?.original?.lengthType)}</p>
      },
      {
        accessorKey: 'mood',
        header: 'Mood',
        cell: ({ row }) => <p>{snakeToPascalConverter(row?.original?.mood)}</p>
      },
      {
        accessorKey: 'preTimerDuration',
        header: 'Pre-Time',
        cell: ({ row }) => <p>{row?.original?.preTimerDuration || '-'}</p>
      },
      {
        accessorKey: 'plungeDuration',
        header: 'Duration',
        cell: ({ row }) => <p>{row?.original?.plungeDuration}</p>
      },
      {
        accessorKey: 'views',
        header: 'Views',
        cell: ({ row }) => <p>{row?.original?.count || 0}</p>
      },
      {
        accessorKey: 'uploadStatus',
        header: 'Upload Status',
        cell: ({ row }) => <UploadProgress videoItem={row.original} />
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            <CustomChip
              round='false'
              variant='tonal'
              label={snakeToPascalConverter(videoStatusMapping(String(row?.original?.status)))}
              size='small'
              color={row?.original.status === 'active' ? 'success' : 'error'}
            />
          </div>
        )
      },
      {
        id: 'action',
        header: 'Actions',
        cell: ({ row }) => {
          const videoItem = row.original
          const status = videoItem?.status

          const options = [
            ...(videoItem?.videoUploadId === null
              ? [
                  {
                    text: 'Play Video',
                    menuItemProps: {
                      onClick: () =>
                        openModal({
                          title: 'Video Player',
                          description: null,
                          content: <VideoPlayer item={videoItem} handleClose={closeModal} />,
                          isXPaddingDisabled: true
                        })
                    }
                  }
                ]
              : []),
            ...(videoItem?.videoUploadId === null
              ? [
                  {
                    text: 'Edit Video',
                    menuItemProps: {
                      // disabled: videoItem?.isUsedInSession,
                      // ...(videoItem?.isUsedInSession && {
                      //   isToolTip: true,
                      //   toolTipText: 'Used in session'
                      // }),
                      onClick: async () => {
                        setIsEdit(true)
                        setSelectedRow(videoItem)
                        setOpenUploadModal(true)
                      }
                    }
                  }
                ]
              : []),
            status === 'active'
              ? {
                  text: 'Archive Video',
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
                            onRightBtnClick={() => {
                              dispatch(
                                updateStatus({
                                  id: videoItem.id,
                                  data: {
                                    status: 'inactive'
                                  },
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
              : {
                  text: 'Activate Video',
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
                            onRightBtnClick={() => {
                              dispatch(
                                updateStatus({
                                  id: videoItem.id,
                                  data: {
                                    status: 'active'
                                  },
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
                },
            {
              text: 'Delete Video',
              menuItemProps: {
                disabled: videoItem?.isUsedInSession,
                ...(videoItem?.isUsedInSession && {
                  isToolTip: true,
                  toolTipText: 'Used in session'
                }),
                className: 'text-error',
                onClick: () =>
                  openModal({
                    title: 'Delete Video?',
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
                          dispatch(deleteVideo({ itemData: videoItem, closeModal }) as any)
                          dispatch(resetVideoUploadProgress({ id: videoItem?.id }))
                          abortAllUploadsAgainstId(videoItem?.id)

                          if (videoItem?.videoUploadId) {
                            removeUploadInstance(videoItem?.id, videoItem?.videoUploadId)
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
      <Table<Video>
        isLoading={isAllVideoLoading}
        columns={columns}
        data={allVideos?.items?.length ? allVideos?.items : []}
        totalElements={allVideos?.pagination?.totalElements}
        elementsPerPage={PAGE_SIZE}
        page={page}
        setPage={setPage}
        filters={
          <VideoManagementFilters
            setOpenModal={setOpenUploadModal}
            page={page}
            setPage={setPage}
            filters={filters}
            setFilters={setFilters}
          />
        }
      />
      {/* Modal opener hook */}
      {modalConfig && <Modal scroll='body' open={isOpen} handleClose={closeModal} {...modalConfig} />}
      <Modal
        maxWidth='md'
        scroll='body'
        isTitleCenter={true}
        title={isEdit ? 'Edit Video' : 'Upload New Video'}
        description={null}
        open={openUploadModal}
        handleClose={() => {
          setOpenUploadModal(false)
          setIsEdit(false)
        }}
        content={
          <AddEditVideo
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

export default VideoManagementTable
