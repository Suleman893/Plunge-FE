'use client'

//React Imports
import { useState } from 'react'

//Third Party Imports
import classNames from 'classnames'
import Skeleton from 'react-loading-skeleton'

//Types Imports
import type { SkeletonImgProps } from '@custom-types/components/common'

const SkeletonImg = (props: SkeletonImgProps) => {
  const { src, alt, width, height, className } = props
  const [isLoading, setIsLoading] = useState(true)

  return (
    <>
      <div style={{ width, height }} className='relative'>
        {isLoading && <Skeleton width={width} height={height} />}
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={classNames('absolute top-0 left-0', className, isLoading ? 'opacity-0' : 'opacity-100')}
          onLoad={() => setIsLoading(false)}
          loading='lazy'
        />
      </div>
    </>
  )
}

export default SkeletonImg
