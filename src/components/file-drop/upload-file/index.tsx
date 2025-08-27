//MUI Imports
import Typography from '@mui/material/Typography'

//Component Imports
import CustomAvatar from '@core/components/mui/Avatar'
import CustomButton from '@core/components/mui/Button'

//Types Imports
import type { UploadFileProps } from '@custom-types/components/file-drop'

const UploadFile = (props: UploadFileProps) => {
  const { fileType } = props

  return (
    <div className='flex items-center flex-col gap-2 text-center'>
      <CustomAvatar variant='rounded' skin='light' color='secondary'>
        <i className='tabler-upload' />
      </CustomAvatar>
      <Typography className='text-base text-[#AAAAAA]'>Drag and drop your {fileType} here</Typography>
      <Typography className='text-[#AAAAAA]'>or</Typography>
      <CustomButton variant='tonal' text={`Browse ${fileType}`} />
    </div>
  )
}

export default UploadFile
