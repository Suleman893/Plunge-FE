//React Imports
import { useState, useMemo } from 'react'

//Third Party Imports
import { useSelector } from 'react-redux'
import dayjs from 'dayjs'
import Skeleton from 'react-loading-skeleton'

//MUI  Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid2'

//Components Imports
import Modal from '@components/modal'
import CustomButton from '@core/components/mui/Button'
import BorderButton from '@components/buttons/BorderButton'
import ResetPassword from '@components/views/app-user-management/modal/ResetPassword'
import EditUser from '@components/views/app-user-management/modal/EditUser'

//Redux Imports
import type { RootState } from '@features/store'

//Utils And Helper Imports
import { capitalizeFirst, getFullName } from '@utils/common'
import { hashUID } from '@helpers/common'

const UserOverview = () => {
  const { appUserInfo, isFetchUserInfoLoading } = useSelector((state: RootState) => state.appUserManagement)

  //States
  //Modals
  const [openResetPassModal, setOpenResetPassModal] = useState<boolean>(false)
  const [openUserDetailModal, setOpenUserDetailModal] = useState<boolean>(false)

  const hashedFirebaseUID = useMemo(() => {
    return appUserInfo?.uid ? hashUID(appUserInfo?.uid) : '-'
  }, [appUserInfo?.uid])

  return (
    <>
      <Card>
        <CardHeader
          title={<span className='font-semibold'>User Overview </span>}
          action={
            <div className='flex gap-2 max-sm:flex-col'>
              <BorderButton
                text='Reset Password'
                handleClick={() => setOpenResetPassModal(true)}
                disabled={appUserInfo?.status === 'pending'}
              />
              <CustomButton text='Edit Details' variant='tonal' handleClick={() => setOpenUserDetailModal(true)} />
            </div>
          }
        />
        <CardContent>
          <Grid container>
            <Grid size={{ xs: 12, sm: 6 }}>
              <div className='flex flex-col gap-4'>
                <div className='flex flex-col gap-2'>
                  <p className='text-xs'>Full Name:</p>
                  <p className='text-sm text-black'>
                    {isFetchUserInfoLoading ? (
                      <Skeleton width={150} height={20} />
                    ) : (
                      getFullName(capitalizeFirst(appUserInfo?.firstName), appUserInfo?.lastName)
                    )}
                  </p>
                </div>

                <div className='flex flex-col gap-2'>
                  <p className='text-xs'>Date of Birth:</p>
                  <p className='text-sm text-black'>
                    {isFetchUserInfoLoading ? (
                      <Skeleton width={150} height={20} />
                    ) : appUserInfo?.dob ? (
                      dayjs(appUserInfo.dob).format('D, MMM YYYY')
                    ) : (
                      '-'
                    )}
                  </p>
                </div>

                <div className='flex flex-col gap-2'>
                  <p className='text-xs'>Joined on:</p>
                  <p className='text-sm text-black'>
                    {isFetchUserInfoLoading ? (
                      <Skeleton width={150} height={20} />
                    ) : appUserInfo?.createdAt ? (
                      dayjs(appUserInfo.createdAt).format('D MMM, YYYY')
                    ) : (
                      ''
                    )}
                  </p>
                </div>

                <div className='flex flex-col gap-2'>
                  <p className='text-xs'>User ID:</p>
                  <p className='text-sm text-black'>
                    {isFetchUserInfoLoading ? <Skeleton width={150} height={20} /> : hashedFirebaseUID?.slice(0, 28)}
                  </p>
                </div>
              </div>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <div className='flex flex-col gap-4 max-sm:mt-4'>
                <div className='flex flex-col gap-2'>
                  <p className='text-xs'>Email Address:</p>
                  <p className='text-sm text-black'>
                    {isFetchUserInfoLoading ? <Skeleton width={150} height={20} /> : appUserInfo?.email}
                  </p>
                </div>

                <div className='flex flex-col gap-2'>
                  <p className='text-xs'>Sex:</p>
                  <p className='text-sm text-black'>
                    {isFetchUserInfoLoading ? (
                      <Skeleton width={150} height={20} />
                    ) : (
                      capitalizeFirst(appUserInfo?.gender) || '-'
                    )}
                  </p>
                </div>

                <div className='flex flex-col gap-2'>
                  <p className='text-xs'>Last Active on:</p>
                  <p className='text-sm text-black'>
                    {isFetchUserInfoLoading ? (
                      <Skeleton width={150} height={20} />
                    ) : appUserInfo?.lastLogin ? (
                      dayjs(appUserInfo.lastLogin).format('D MMM, YYYY')
                    ) : (
                      '-'
                    )}
                  </p>
                </div>

                <div className='flex flex-col gap-2'>
                  <p className='text-xs'>Password Changed On:</p>
                  <p className='text-sm text-black'>
                    {isFetchUserInfoLoading ? (
                      <Skeleton width={150} height={20} />
                    ) : appUserInfo?.lastPasswordChange ? (
                      dayjs(appUserInfo.lastPasswordChange).format('D MMM, YYYY')
                    ) : (
                      '-'
                    )}
                  </p>
                </div>
              </div>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Reset User Password Modal */}
      <Modal
        title='Reset User Password'
        open={openResetPassModal}
        handleClose={() => setOpenResetPassModal(false)}
        content={<ResetPassword onBtnClick={() => setOpenResetPassModal(false)} itemData={appUserInfo} />}
      />
      {/* Edit User Details Modal */}
      <Modal
        isTitleCenter={true}
        maxWidth='md'
        scroll='body'
        title='Edit User Details'
        open={openUserDetailModal}
        handleClose={() => setOpenUserDetailModal(false)}
        content={<EditUser onBtnClick={() => setOpenUserDetailModal(false)} itemData={appUserInfo} />}
      />
    </>
  )
}

export default UserOverview
