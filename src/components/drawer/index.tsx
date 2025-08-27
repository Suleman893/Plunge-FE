// MUI Imports
import Drawer from '@mui/material/Drawer'
import Divider from '@mui/material/Divider'

// Component Imports
import DrawerHeader from './DrawerHeader'

//Types Imports
import type { SideDrawerProps } from '@custom-types/components/drawer'

const SideDrawer = (props: SideDrawerProps) => {
  const { open, handleClose, title, form } = props

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <DrawerHeader title={title} handleClose={handleClose} />
      <Divider />
      {form && <div className='p-6'>{form}</div>}
    </Drawer>
  )
}

export default SideDrawer
