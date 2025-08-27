//MUI Imports
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'

//Components Imports
import UploadedFileName from './UploadedFileName'
import UploadedFileSize from './UploadedFileSize'
import UploadedImgPreview from './UploadedImgPreview'
import UploadedVideoPreview from './UploadedVideoPreview'

//Types Imports
import type { UploadedFileProps } from '@custom-types/components/file-drop'

const UploadedFile = (props: UploadedFileProps) => {
  const { file, setFile, selectedFile, setSelectedFile, previewThumbnail, showThumbnail, itemData } = props

  const handleRemove = () => {
    setFile(null)
    setSelectedFile(null)
  }

  return (
    <div className='border rounded-[10px] h-[180px] max-sm:h-[185px]'>
      <div className='p-2 relative'>
        {file ? (
          file?.type?.startsWith('image') ||
          (file?.type?.startsWith('audio') && showThumbnail) ||
          (file?.type?.startsWith('video') && showThumbnail) ? (
            <UploadedImgPreview file={file} previewThumbnail={previewThumbnail} />
          ) : (
            <UploadedVideoPreview file={file} />
          )
        ) : selectedFile ? (
          selectedFile?.type?.startsWith('image') ||
          selectedFile?.type?.startsWith('audio') ||
          (selectedFile?.type?.startsWith('video') && previewThumbnail) ? (
            <UploadedImgPreview selectedFile={selectedFile} previewThumbnail={previewThumbnail} />
          ) : (
            <UploadedVideoPreview selectedFile={selectedFile} />
          )
        ) : null}
      </div>
      <Divider />
      <div className='p-2'>
        {(file || selectedFile) && <UploadedFileName name={file?.name || selectedFile?.name || ''} />}
        {(file || selectedFile) && <UploadedFileSize size={file?.size || selectedFile?.size || 0} />}
      </div>
      <Divider />
      <div className='p-1'>
        <Typography
          className={`font-semibold text-center ${
            itemData?.isUsedInSession ? 'cursor-not-allowed text-gray-400' : 'cursor-pointer text-red-500'
          }`}
          onClick={itemData?.isUsedInSession ? undefined : handleRemove}

          // className='font-semibold text-center cursor-pointer'
          // color='error.main'
        >
          Remove File
        </Typography>
      </div>
    </div>
  )
}

export default UploadedFile
