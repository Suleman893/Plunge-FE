// MUI Imports
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

// Utils Imports
import { truncateText } from '@utils/common'

// Types Imports
import type { UploadedFileNameProps } from '@custom-types/components/file-drop'

const UploadedFileName = (props: UploadedFileNameProps) => {
  const { name } = props

  const isTruncated = name.length > 18
  const content = <Typography>{truncateText(name, 18)}</Typography>

  return isTruncated ? (
    <Tooltip title={name} placement='right-end'>
      {content}
    </Tooltip>
  ) : (
    content
  )
}

export default UploadedFileName
