//MUI Imports
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

//Types Imports
import type { DrawerHeaderProps } from '@custom-types/components/drawer'

const DrawerHeader = (props: DrawerHeaderProps) => {
  const { title, handleClose } = props

  return (
    <div className='flex items-center justify-between plb-5 pli-6'>
      <Typography variant='h4' className='text-xl'>
        {title}
      </Typography>
      <IconButton size='small' onClick={handleClose}>
        <i className='tabler-x text-2xl text-textPrimary' />
      </IconButton>
    </div>
  )
}

export default DrawerHeader
