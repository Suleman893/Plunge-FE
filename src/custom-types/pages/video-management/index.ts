//Types Imports
import type { Video } from '@custom-types/features/videoManagement'

export interface AddVideoDetailsProps {
  control: any
  errors: any
  isEdit: boolean
  itemData: any
  selectedForPreview: any
  setSelectedForPreview: (value: any) => void
  setVideoThumbnail: (file: File | null) => void
  thumbnailError: string
  setThumbnailError: (value: string) => void
  thumbnailName: string
  setThumbnailName: (value: string) => void
  setValue: any
}

export interface FollowupVideoProps {
  allowFollowUp: boolean
  setAllowFollowUp: (val: boolean) => void
  followUpVideoIds: number[]
  setFollowUpVideoIds: (val: any) => void
  error: string | null
  setError: (val: any) => void
  selectedFollowUpVideos: any
  setSelectedFollowUpVideos: any
  itemData?: any
}

export interface AddEditVideoProps {
  handleClose: () => void
  isEdit?: boolean
  itemData?: any
}

export interface PreviewVideoProps {
  getValues: (fieldName: string) => any
  selectedForPreview: any
  setSelectedForPreview: (val: any) => void
  videoThumbnail: File | null
  isEdit?: boolean
  itemData?: any
}

export interface UploadVideoProps {
  fileVideo: File | null
  setFileVideo: (file: File | null) => void
  selectedFileVideo: any
  setSelectedFileVideo: (file: any) => void
  loading?: boolean
  previewThumbnail?: any
  showThumbnail?: boolean
  itemData?: any
}

export interface VideoPlayerProps {
  item: Video
  handleClose: () => void
}

export interface VideoManagementFilterProps {
  setOpenModal: (arg: boolean) => void
  page: number
  setPage: (page: number) => void
  filters: any
  setFilters: (arg: any) => void
}
