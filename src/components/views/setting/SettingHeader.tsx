'use client'

//React Imports
import { useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

//Third Party Imports
import { useSelector } from 'react-redux'

//Redux Imports
import type { RootState } from '@features/store'

//Components Imports
import Modal from '@components/modal'
import EditProfile from '@components/views/setting/modal/EditProfile'
import CustomButton from '@core/components/mui/Button'
import CustomAvatar from '@core/components/mui/Avatar'

//Assets Import
import { Email } from '@assets/svgs/Email'

//Utils And Helpers Imports
import { getFullName, getInitials } from '@utils/common'

const SettingHeader = () => {
  const { userInfo } = useSelector((state: RootState) => state.user)

  //States
  const [openModal, setOpenModal] = useState<boolean>(false)

  return (
    <>
      <Card>
        <CardMedia image='/images/settings/profile-header.png' className='bs-[120px]' />
        <CardContent className='flex gap-5 justify-center flex-col items-center md:items-end md:flex-row !pt-0 md:justify-start'>
          <div className='flex rounded-bs-md mbs-[-40px] border-[5px] mis-[-5px] border-be-0  border-backgroundPaper bg-backgroundPaper'>
            <CustomAvatar
              variant='rounded'
              alt='user'
              src={userInfo?.photo || undefined}
              sx={{ width: '125px', height: '125px', fontSize: '2rem' }}
            >
              {!userInfo?.photo && getInitials(userInfo?.firstName, userInfo?.lastName)}
            </CustomAvatar>
          </div>
          <div className='flex is-full justify-start self-end flex-col items-center gap-6 sm-gap-0 sm:flex-row sm:justify-between sm:items-end '>
            <div className='flex flex-col items-center sm:items-start gap-2'>
              <Typography variant='h4'>{getFullName(userInfo?.firstName, userInfo?.lastName)}</Typography>
              <div className='flex flex-wrap gap-6 justify-center sm:justify-normal'>
                <div className='flex items-center gap-2'>
                  <Email />
                  <Typography className='font-medium'>{userInfo?.email}</Typography>
                </div>
              </div>
            </div>
            <CustomButton variant='tonal' text='Edit Profile' handleClick={() => setOpenModal(true)} />
          </div>
        </CardContent>
      </Card>
      <Modal
        maxWidth='md'
        scroll='body'
        isTitleCenter={true}
        title='Edit Profile'
        open={openModal}
        handleClose={() => setOpenModal(false)}
        content={<EditProfile onBtnClick={() => setOpenModal(false)} itemData={userInfo} />}
      />
    </>
  )
}

export default SettingHeader
