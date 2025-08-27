//React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'

//Third Party Imports
import { useDispatch, useSelector } from 'react-redux'

//Redux Imports
import { fetchAllLicenseTypes, fetchAllPlaylist } from '@features/music-management/thunk'
import type { RootState } from '@features/store'

//Utils Imports
import { capitalizeFirst, truncateText } from '@utils/common'
import { getAudioDuration, getAudioDurationLabel } from '@helpers/common'

//Types Imports
import type { PreviewMusicProps } from '@custom-types/pages/music-management'

const PreviewMusic = (props: PreviewMusicProps) => {
  const { getValues, selectedForPreview, setSelectedForPreview, musicThumbnail, isEdit, itemData } = props

  //Hook
  const dispatch = useDispatch()

  //Edit
  const { allPlaylist, allLicenseTypes } = useSelector((state: RootState) => state.musicManagement)

  //States
  const [audioLabel, setAudioLabel] = useState<string | null>(null)
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string | null>(null)

  //Preview data
  const labelData = [
    { label: 'Music Title' },
    { label: 'Artist Name' },
    { label: 'Associated Playlist' },
    { label: 'Music Length' },
    { label: 'Licence Type' }
  ]

  useEffect(() => {
    const loadDuration = async () => {
      if (selectedForPreview?.audioFile) {
        const durationLabel = await getAudioDuration(selectedForPreview?.audioFile)

        setAudioLabel(durationLabel)
      } else if (!selectedForPreview?.audioFile && isEdit && itemData?.audioDuration) {
        const audioLabel = getAudioDurationLabel(itemData?.audioDuration)

        setAudioLabel(audioLabel)
      }
    }

    loadDuration()
  }, [selectedForPreview?.audioFile, itemData?.audioDuration])

  useEffect(() => {
    if (musicThumbnail instanceof File) {
      const url = URL.createObjectURL(musicThumbnail)

      setThumbnailPreviewUrl(url)

      return () => {
        URL.revokeObjectURL(url)
      }
    } else if (!musicThumbnail && isEdit && itemData?.thumbnail) {
      setThumbnailPreviewUrl(itemData?.thumbnail)
    }
  }, [musicThumbnail])

  useEffect(() => {
    dispatch(fetchAllPlaylist() as any)
    dispatch(fetchAllLicenseTypes() as any)
  }, [isEdit])

  useEffect(() => {
    const selectedPlayList = allPlaylist.find((itm: any) => itm.id === getValues('playlistId'))
    const selectedLicenseType = allLicenseTypes.find((itm: any) => itm.id === getValues('licenseTypeId'))

    setSelectedForPreview((prev: any) => ({
      ...prev,
      playlist: selectedPlayList?.name,
      licenseType: selectedLicenseType?.name
    }))
  }, [allPlaylist, allLicenseTypes])

  const getValueByIndex = (index: number) => {
    switch (index) {
      case 0:
        return truncateText(getValues('name'), 35) || '-'
      case 1:
        return truncateText(getValues('artistName'), 35) || '-'
      case 2:
        return capitalizeFirst(selectedForPreview?.playlist) || '-'
      case 3:
        return audioLabel || '-'
      case 4:
        return selectedForPreview?.licenseType || '-'
      default:
        return '-'
    }
  }

  return (
    <Grid container spacing={12}>
      <Grid size={{ sm: 12, md: 8 }}>
        <div className='flex flex-col gap-5'>
          {labelData.map((item, index) => (
            <div key={index} className='flex gap-3 max-sm:flex-col'>
              <p className='font-semibold w-48 min-w-48'>{item.label}:</p>
              <p className='break-words'>{getValueByIndex(index)}</p>
            </div>
          ))}
        </div>
      </Grid>
      <Grid size={{ sm: 12, md: 4 }}>
        <img
          src={thumbnailPreviewUrl || undefined}
          alt='thumbnail'
          className='h-[200px] w-full object-cover rounded-lg'
        />
      </Grid>
    </Grid>
  )
}

export default PreviewMusic
