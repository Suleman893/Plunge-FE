'use client'

// React Imports
import { useEffect } from 'react'

// MUI Imports
import Typography from '@mui/material/Typography'

// Third Party Imports
import { useSelector, useDispatch } from 'react-redux'
import Skeleton from 'react-loading-skeleton'

// Components Imports
import CustomChip from '@core/components/mui/Chip'
import SkeletonImg from '@components/common/SkeletonImg'

// Redux Imports
import type { RootState } from '@features/store'
import { fetchPopularVideos } from '@features/dashboard/thunk'

// Utils Imports
import { formatViewCount } from '@helpers/common'
import { truncateText } from '@utils/common'

const MostPopularVideo = () => {
  const dispatch = useDispatch()
  const { isPopularVideosLoading, popularVideos } = useSelector((state: RootState) => state.dashboard)

  useEffect(() => {
    dispatch(fetchPopularVideos() as any)
  }, [])

  // If no record
  if (!isPopularVideosLoading && popularVideos?.length === 0) {
    return <Typography variant='h6'>No popular videos found</Typography>
  }

  const renderList = isPopularVideosLoading ? Array.from({ length: 5 }) : popularVideos

  return (
    <>
      {renderList?.map((item: any, index: number) => (
        <div key={index} className='flex items-center gap-4 max-sm:flex-col max-sm:items-start mb-4'>
          {/* Thumbnail */}
          {isPopularVideosLoading ? (
            <Skeleton width={52} height={35} borderRadius={6} />
          ) : (
            <SkeletonImg
              src={item?.thumbnail}
              alt='videos'
              width={55}
              height={40}
              className='object-cover rounded-[6px]'
            />
          )}

          {/* Content */}
          <div className='flex flex-wrap justify-between items-center gap-x-4 gap-y-1 is-full max-sm:flex-col max-sm:items-start'>
            <div className='flex flex-col'>
              <Typography variant='h6' className='font-medium' color='text.primary'>
                {isPopularVideosLoading ? <Skeleton width={150} /> : truncateText(item?.name, 20)}
              </Typography>

              <Typography variant='body2'>
                {isPopularVideosLoading ? <Skeleton width={100} /> : truncateText(item?.videoInstructor?.name, 20)}
              </Typography>
            </div>

            <div className='flex justify-end items-center is-32 max-sm:justify-start'>
              {isPopularVideosLoading ? (
                <Skeleton width={60} height={25} borderRadius={5} />
              ) : (
                <CustomChip label={formatViewCount(item?.count)} variant='tonal' size='small' color='secondary' />
              )}
            </div>
          </div>
        </div>
      ))}
    </>
  )
}

export default MostPopularVideo
