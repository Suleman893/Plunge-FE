export interface UploadFileProps {
  fileType: string
}

export interface UploadedFileProps {
  file?: File | null
  setFile: (file: File | null) => void
  selectedFile: {
    url: string
    name: string
    size: number
    type: string
  } | null
  setSelectedFile: (arg: any) => void
  previewThumbnail?: any
  showThumbnail?: boolean
  itemData?: any
}

export interface UploadedFileSizeProps {
  size: number
}

export interface UploadedFileNameProps {
  name: string
}

export interface UploadedFilePreviewProps {
  file?: File | null
  selectedFile?: {
    url: string
    name: string
    size: number
    type: string
  } | null
  previewThumbnail?: any
}

export interface FileUploadProps {
  file: File | null
  setFile: (file: File | null) => void
  selectedFile: {
    url: string
    name: string
    size: number
    type: string
  } | null
  setSelectedFile: (arg: any) => void
  maxSize: number | undefined
  allowedTypes: any
  fileType: string
  loading?: boolean
  isExpandedPadding?: boolean
  previewThumbnail?: any
  showThumbnail?: boolean
  itemData?: any

  // inputRef: React.RefObject<HTMLInputElement>
}
