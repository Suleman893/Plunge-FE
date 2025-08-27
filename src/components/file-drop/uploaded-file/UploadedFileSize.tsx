//Constants Imports
import { getFileSize } from '@utils/common'

//Types Imports
import type { UploadedFileSizeProps } from '@custom-types/components/file-drop'

const UploadedFileSize = (props: UploadedFileSizeProps) => {
  const { size } = props

  return (
    <p className='text-xs italic'>
      <span className='font-bold mr-1'>{getFileSize(size).size}</span>
      <span className='font-light text-gray-400'>{getFileSize(size).unit}</span>
    </p>
  )
}

export default UploadedFileSize
