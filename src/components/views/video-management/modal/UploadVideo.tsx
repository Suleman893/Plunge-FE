//Component Imports
import FileUpload from '@components/file-drop'

//Types Imports
import type { UploadVideoProps } from '@custom-types/pages/video-management'

//Constants Imports
import { VIDEO_TYPE } from '@constants/common'

const UploadVideo = (props: UploadVideoProps) => {
  const {
    fileVideo,
    setFileVideo,
    selectedFileVideo,
    setSelectedFileVideo,
    loading,
    previewThumbnail,
    showThumbnail,
    itemData
  } = props

  return (
    <>
      <FileUpload
        file={fileVideo}
        setFile={setFileVideo}
        selectedFile={selectedFileVideo}
        setSelectedFile={setSelectedFileVideo}
        maxSize={undefined}
        allowedTypes={VIDEO_TYPE}
        fileType='Video'
        loading={loading}
        isExpandedPadding={true}
        previewThumbnail={previewThumbnail}
        showThumbnail={showThumbnail}
        itemData={itemData}
      />
      <div className='mt-4 text-center text-textDisabled'>
        <p className='text-xs'>The video will be private/draft until you publish it</p>
      </div>
    </>
  )
}

export default UploadVideo
