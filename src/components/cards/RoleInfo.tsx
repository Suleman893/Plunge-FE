'use client'

//React Imports
import { useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import AvatarGroup from '@mui/material/AvatarGroup'
import Skeleton from 'react-loading-skeleton'

//Components Imports
import Modal from '@components/modal'
import AddEditRole from '@components/views/setting/modal/add-edit-role'
import SkeletonAvatar from '@components/common/SkeletonAvatar'

// Types Imports
import type { RoleInfoProps } from '@custom-types/components/cards'
import type { User } from '@custom-types/features/user'

// Utils And Helpers Imports
import { snakeToPascalConverter } from '@helpers/common'
import { truncateText } from '@utils/common'

const RoleInfo = (props: RoleInfoProps) => {
  const { data, loading = false } = props

  //States
  const [openModal, setOpenModal] = useState<boolean>(false)

  return (
    <>
      <Grid size={{ xs: 12, md: 6, lg: 4 }}>
        <Card>
          <CardContent className='flex flex-col gap-1 py-8'>
            <div className='flex justify-between items-center'>
              {loading ? (
                <Skeleton width={80} height={20} />
              ) : (
                <Typography variant='body1'>Total {data?.totalUsers} users</Typography>
              )}

              <AvatarGroup
                max={4}
                sx={{
                  '& .MuiAvatar-root': {
                    width: 26,
                    height: 26,
                    fontSize: 12
                  }
                }}
              >
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => <Skeleton circle key={i} width={26} height={26} />)
                ) : data?.users?.length ? (
                  data?.users?.map((itm: User, idx: number) => (
                    <SkeletonAvatar key={idx} src={itm?.photo || undefined} size={26}>
                      {!itm?.photo && itm?.firstName?.charAt(0)?.toUpperCase()}
                    </SkeletonAvatar>
                  ))
                ) : (
                  <div className='w-[26px] h-[27px]' />
                )}
              </AvatarGroup>
            </div>

            <div className='flex flex-col gap-2 mt-3'>
              {loading ? (
                <>
                  <Skeleton width={`50%`} height={24} />
                  <Skeleton width={`30%`} height={18} />
                </>
              ) : (
                <>
                  <Typography className='font-semibold text-black text-lg'>
                    {data?.name && truncateText(snakeToPascalConverter(data.name), 30)}
                  </Typography>
                  <Typography
                    variant='button'
                    className='cursor-pointer text-[#0079BD]'
                    onClick={() => setOpenModal(true)}
                  >
                    Edit Role
                  </Typography>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </Grid>
      <Modal
        maxWidth='md'
        scroll='body'
        isTitleCenter={true}
        title='Edit Role'
        description='Set Role Permission'
        open={openModal}
        handleClose={() => setOpenModal(false)}
        content={<AddEditRole onBtnClick={() => setOpenModal(false)} isEdit={true} itemData={data} />}
      />
    </>
  )
}

export default RoleInfo
