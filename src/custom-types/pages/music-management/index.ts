//Type Import
import type { Music } from '@custom-types/features/musicManagement'

export interface MusicManagementFilterProps {
  setOpenModal: (arg: boolean) => void
  page: number
  setPage: (page: number) => void
  filters: any
  setFilters: (arg: any) => void
}

export interface AudioPlayerProps {
  item: Music
  handleClose: () => void
}

export interface AddEditMusicProps {
  handleClose: () => void
  isEdit?: boolean
  itemData?: any
}

export interface AddMusicDetailsProps {
  control: any
  errors: any
  setSelectedForPreview: (value: any) => void
  setMusicThumbnail: (file: File | null) => void
  thumbnailError: string
  setThumbnailError: (value: string) => void
  thumbnailName: string
  setThumbnailName: (value: string) => void
  itemData?: any
}

export interface PreviewMusicProps {
  getValues: (fieldName: string) => any
  selectedForPreview: any
  setSelectedForPreview: (val: any) => void
  musicThumbnail: File | null
  isEdit?: boolean
  itemData?: any
}

export interface UploadMusicProps {
  fileAudio: File | null
  setFileAudio: (file: File | null) => void
  selectedFileAudio: any
  setSelectedFileAudio: (file: any) => void
  loading?: boolean
  previewThumbnail?: any
  showThumbnail?: boolean
  itemData?: any
}
