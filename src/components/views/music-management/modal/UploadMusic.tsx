//Component Imports
import FileUpload from '@components/file-drop'

//Types Imports
import type { UploadMusicProps } from '@custom-types/pages/music-management'

//Constants Imports
import { MUSIC_AUDIO_TYPE } from '@constants/common'

const UploadMusic = (props: UploadMusicProps) => {
  const {
    fileAudio,
    setFileAudio,
    selectedFileAudio,
    setSelectedFileAudio,
    loading,
    previewThumbnail,
    showThumbnail,
    itemData
  } = props

  return (
    <>
      <FileUpload
        file={fileAudio}
        setFile={setFileAudio}
        selectedFile={selectedFileAudio}
        setSelectedFile={setSelectedFileAudio}
        maxSize={undefined}
        allowedTypes={MUSIC_AUDIO_TYPE}
        fileType='Audio'
        loading={loading}
        isExpandedPadding={true}
        previewThumbnail={previewThumbnail}
        showThumbnail={showThumbnail}
        itemData={itemData}
      />
      <div className='mt-4 text-center text-textDisabled'>
        <p className='text-sm'>The music will be private/draft until you publish it</p>
      </div>
    </>
  )
}

export default UploadMusic
