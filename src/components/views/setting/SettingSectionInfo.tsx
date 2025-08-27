'use client'

//React Imports
import { useState } from 'react'

//MUI Imports
import Typography from '@mui/material/Typography'

//Components Imports
import Modal from '@components/modal'
import AddEditNewRole from './modal/add-edit-role/index'
import CustomButton from '@core/components/mui/Button'

const SettingSectionInfo = () => {
  const [openModal, setOpenModal] = useState<boolean>(false)

  return (
    <>
      <div className='flex justify-between items-center max-sm:flex-col max-sm:gap-2 max-sm:items-start'>
        <div className='flex flex-col gap-1'>
          <Typography variant='h4'>Role Management</Typography>
          <Typography>Lorem Ipsum</Typography>
        </div>
        <CustomButton
          variant='tonal'
          startIcon={<i className='tabler-plus' />}
          text='Create New Role'
          handleClick={() => setOpenModal(true)}
        />
      </div>
      <Modal
        maxWidth='md'
        scroll='body'
        isTitleCenter={true}
        title='Add New Role'
        description='Set Role Permission'
        open={openModal}
        handleClose={() => setOpenModal(false)}
        content={<AddEditNewRole onBtnClick={() => setOpenModal(false)} />}
      />
    </>
  )
}

export default SettingSectionInfo
