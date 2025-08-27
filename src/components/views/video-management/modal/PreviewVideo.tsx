//React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'

//Helpers and Utils Imports
import { snakeToPascalConverter, timeToReadable } from '@helpers/common'
import { truncateText } from '@utils/common'

//Types Imports
import type { PreviewVideoProps } from '@custom-types/pages/video-management'

const PreviewVideo = (props: PreviewVideoProps) => {
  const { getValues, selectedForPreview, videoThumbnail, isEdit, itemData } = props

  //States
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string | null>(null)

  //Preview data
  const labelData = [
    { label: 'Title' },
    { label: 'Instructor' },
    { label: 'Default Playlist Name' },
    { label: 'Mood' },
    { label: 'Video Type' },
    { label: 'Length Type' },
    { label: 'Pre Timer Duration' },
    { label: 'Plunge Duration' }
  ]

  useEffect(() => {
    if (videoThumbnail instanceof File) {
      const url = URL.createObjectURL(videoThumbnail)

      setThumbnailPreviewUrl(url)

      return () => {
        URL.revokeObjectURL(url)
      }
    } else if (!videoThumbnail && isEdit && itemData?.thumbnail) {
      setThumbnailPreviewUrl(itemData?.thumbnail)
    }
  }, [videoThumbnail])

  const getValueByIndex = (index: number) => {
    switch (index) {
      case 0:
        return truncateText(getValues('name'), 25) || '-'
      case 1:
        return selectedForPreview?.instructor || '-'
      case 2:
        return selectedForPreview?.playlist || '-'
      case 3:
        return snakeToPascalConverter(getValues('mood')) || '-'
      case 4:
        return snakeToPascalConverter(selectedForPreview?.videoType) || '-'
      case 5:
        return snakeToPascalConverter(getValues('lengthType')) || '-'
      case 6:
        return timeToReadable(getValues('preTimerDuration')) || '-'
      case 7:
        return timeToReadable(getValues('plungeDuration')) || '-'
      default:
        return '-'
    }
  }

  return (
    <Grid container spacing={12}>
      <Grid size={{ sm: 12, md: 6 }}>
        <div className='flex flex-col gap-5'>
          {labelData.map((item, index) => (
            <div key={index} className='flex gap-3 max-sm:flex-col'>
              <p className='font-semibold w-48 min-w-48'>{item.label}:</p>
              <p className='break-words'>{getValueByIndex(index)}</p>
            </div>
          ))}
        </div>
      </Grid>
      <Grid size={{ sm: 12, md: 6 }}>
        <img
          src={thumbnailPreviewUrl || undefined}
          alt='thumbnail'
          className='h-[200px] md:h-1/2 w-full object-cover rounded-lg'
        />
      </Grid>
    </Grid>
  )
}

export default PreviewVideo
