//React Imports
import { useState } from 'react'

//Third Party Imports
import { useSelector, useDispatch } from 'react-redux'
import dayjs from 'dayjs'
import Skeleton from 'react-loading-skeleton'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

//Components Imports
import Modal from '@components/modal'
import CustomChip from '@core/components/mui/Chip'
import CustomButton from '@core/components/mui/Button'
import ActionModal from '@components/modal/shared/ActionModal'
import CustomAvatar from '@core/components/mui/Avatar'

//Redux Imports
import type { RootState } from '@features/store'
import { updateStatus } from '@features/app-user/thunk'

//Assets Imports
import Email from '@assets/svgs/app-user-management/Email'
import UserCheck from '@assets/svgs/app-user-management/UserCheck'
import Calender from '@assets/svgs/app-user-management/Calender'

//Utils And Helper Imports
import { capitalizeFirst, getFullName, getInitials } from '@utils/common'
import { snakeToPascalConverter, statusColor, userStatusMapping } from '@helpers/common'

const UserProfileHeader = () => {
  const { appUserInfo, isFetchUserInfoLoading } = useSelector((state: RootState) => state.appUserManagement)

  //Hooks
  const dispatch = useDispatch()

  //States
  //Modal
  const [openModal, setOpenModal] = useState<boolean>(false)

  return (
    <>
      <Card>
        <CardContent className='flex gap-5 justify-between items-start max-sm:flex-col'>
          <div className='flex gap-5 justify-between items-start max-md:flex-col max-md:justify-start'>
            <div className='flex rounded-bs-md border-[5px] mis-[-5px] border-be-0 border-backgroundPaper bg-backgroundPaper'>
              {isFetchUserInfoLoading ? (
                <Skeleton height={70} width={70} />
              ) : (
                <CustomAvatar
                  variant='rounded'
                  alt='user'
                  src={appUserInfo?.photo || undefined}
                  sx={{ height: '70px', width: '70px', fontSize: '2rem' }}
                >
                  {!appUserInfo?.photo && getInitials(appUserInfo?.firstName, appUserInfo?.lastName)}
                </CustomAvatar>
              )}
            </div>
            <div className='flex is-full justify-start self-end flex-col items-center gap-6'>
              <div className='flex flex-col items-center sm:items-start gap-2'>
                <div className='flex items-center justify-center gap-4'>
                  {isFetchUserInfoLoading ? (
                    <>
                      <Skeleton height={23} width={130} />
                      <Skeleton height={25} width={70} />
                    </>
                  ) : (
                    <>
                      <Typography variant='h4'>
                        {getFullName(capitalizeFirst(appUserInfo?.firstName), appUserInfo?.lastName)}
                      </Typography>
                      <CustomChip
                        round='false'
                        variant='tonal'
                        label={snakeToPascalConverter(userStatusMapping(String(appUserInfo?.status)))}
                        size='small'
                        color={statusColor('users', String(appUserInfo?.status))}
                      />
                    </>
                  )}
                </div>
                <div className='flex flex-wrap gap-6 justify-center max-sm:justify-start'>
                  {isFetchUserInfoLoading ? (
                    <>
                      <Skeleton height={20} width={150} />
                      <Skeleton height={20} width={150} />
                      <Skeleton height={20} width={150} />
                    </>
                  ) : (
                    <>
                      <div className='flex items-center gap-2'>
                        <Email />
                        <Typography className='font-medium'>{appUserInfo?.email}</Typography>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Calender />
                        <Typography className='font-medium'>
                          Joined, {appUserInfo?.createdAt ? dayjs(appUserInfo?.createdAt).format('MMM YYYY') : '-'}
                        </Typography>
                      </div>
                      <div className='flex items-center gap-2'>
                        <UserCheck />
                        <Typography className='font-medium'>
                          Last Online:{' '}
                          {appUserInfo?.lastLogin ? dayjs(appUserInfo.lastLogin).format('D MMM YYYY') : '-'}
                        </Typography>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div>
            <CustomButton
              variant='tonal'
              color={appUserInfo?.status === 'inactive' ? 'success' : 'error'}
              text={appUserInfo?.status === 'inactive' ? 'Activate User' : 'Suspend User'}
              onClick={() => setOpenModal(true)}
              disabled={appUserInfo?.status === 'pending'}
            />
          </div>
        </CardContent>
      </Card>
      {appUserInfo?.status === 'inactive' ? (
        <Modal
          title='Activate User?'
          description={
            <>
              Are you sure you want to activate{' '}
              <span className='text-black font-semibold'>
                {getFullName(capitalizeFirst(appUserInfo?.firstName), appUserInfo?.lastName)}
              </span>
              , he will be able to access the app after this.
              <br />
              You can always suspend this user again from the list
            </>
          }
          open={openModal}
          handleClose={() => setOpenModal(false)}
          content={
            <ActionModal
              actionType='Activate'
              onRightBtnClick={() => {
                dispatch(
                  updateStatus({
                    uid: appUserInfo.uid,
                    data: { status: 'active' },
                    closeModal: () => setOpenModal(false)
                  }) as any
                )
              }}
              onLeftBtnClick={() => setOpenModal(false)}
            />
          }
        />
      ) : (
        <Modal
          title='Suspend User?'
          description={
            <>
              Are you sure you want to suspend{' '}
              <span className='text-black font-semibold'>
                {' '}
                {getFullName(appUserInfo?.firstName, appUserInfo?.lastName)}
              </span>
              , he wont be able to access the app after this.
              <br />
              You can always active this user again from the list
            </>
          }
          open={openModal}
          handleClose={() => setOpenModal(false)}
          content={
            <ActionModal
              actionType='Suspend'
              onRightBtnClick={() => {
                dispatch(
                  updateStatus({
                    uid: appUserInfo?.uid,
                    data: { status: 'inactive' },
                    closeModal: () => setOpenModal(false)
                  }) as any
                )
              }}
              onLeftBtnClick={() => setOpenModal(false)}
            />
          }
        />
      )}
    </>
  )
}

export default UserProfileHeader
