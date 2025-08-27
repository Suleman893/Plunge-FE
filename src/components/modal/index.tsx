'use client'

//MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Typography from '@mui/material/Typography'

//Third party imports
import classnames from 'classnames'

//Component Imports
import ModalCloseButton from './ModalCloseButton'

//Type Imports
import type { ModalProps } from '@custom-types/components/modals'

const Modal = (props: ModalProps) => {
  const {
    isCloseIcon = true,
    maxWidth = 'sm',
    scroll = 'body',
    open,
    handleClose,
    isTitleCenter = false,
    title,
    description,
    content,
    isXPaddingDisabled = false
  } = props

  return (
    <Dialog
      fullWidth
      maxWidth={maxWidth}
      scroll={scroll}
      open={open}
      onClose={handleClose}
      closeAfterTransition={false}
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
    >
      {isCloseIcon && (
        <ModalCloseButton onClick={() => handleClose()} disableRipple>
          <i className='tabler-x' />
        </ModalCloseButton>
      )}
      <DialogTitle
        variant='h5'
        className={classnames('flex flex-col gap-4 sm:pbs-10 sm:pbe-6 font-semibold text-xl', {
          'sm:pli-10': !isXPaddingDisabled,
          'text-center': isTitleCenter
        })}
      >
        {title}
        {description && (
          <Typography component='span' className='text-sm'>
            {description}
          </Typography>
        )}
      </DialogTitle>
      <DialogContent
        className={classnames('overflow-visible pbs-0 sm:pbe-10', {
          'sm:pli-16': !isXPaddingDisabled
        })}
      >
        {content}
      </DialogContent>
    </Dialog>
  )
}

export default Modal
