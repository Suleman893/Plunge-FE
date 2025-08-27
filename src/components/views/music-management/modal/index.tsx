'use client'

//React Imports
import { useState, useEffect } from 'react'

//Third Party Imports
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDispatch, useSelector } from 'react-redux'

//Component Imports
import PreviewMusic from '@components/views/music-management/modal/PreviewMusic'
import UploadMusic from '@components/views/music-management/modal/UploadMusic'
import AddMusicDetails from '@components/views/music-management/modal/AddMusicDetails'
import BorderButton from '@components/buttons/BorderButton'
import CustomButton from '@core/components/mui/Button'
import StepperRender from '@components/modal/shared/StepperRender'

//Types Imports
import type { AddEditMusicProps } from '@custom-types/pages/music-management'

//Redux Imports
import { addMusic, editMusic, fetchMuxAudioMeta } from '@features/music-management/thunk'
import type { RootState } from '@features/store'

//Context Imports
import { useUploadContext } from '@core/contexts/uploadInstanceContext'

//Schema Imports
import type { AddMusicFormValues } from '@schemas/musicManagement'
import { addMusicSchema } from '@schemas/musicManagement'

//Utils And Helpers Imports
import { getFileMetadata } from '@utils/firebaseBucket'
import { getMuxPlaybackIdFromUrl } from '@helpers/common'

//Constants Imports
import { MUSIC_THUMBNAIL_SIZE } from '@constants/common'

const AddEditMusic = (props: AddEditMusicProps) => {
  const { handleClose, isEdit, itemData } = props

  //Hooks Imports
  const dispatch = useDispatch()
  const { isAddMusicLoading, isEditMusicLoading } = useSelector((state: RootState) => state.musicManagement)
  const { addUploadInstance, removeUploadInstance } = useUploadContext()

  //States
  //Stepper Section
  const [activeStep, setActiveStep] = useState(0)

  //Audio Upload
  const [fileAudio, setFileAudio] = useState<File | null>(null)
  const [selectedFileAudio, setSelectedFileAudio] = useState<any>(null)

  //Music Thumbnail
  const [musicThumbnail, setMusicThumbnail] = useState<File | null>(null)
  const [thumbnailName, setThumbnailName] = useState<string>('')
  const [thumbnailError, setThumbnailError] = useState<string>('')

  //For Preview Component
  const [selectedForPreview, setSelectedForPreview] = useState<any>({
    licenseType: '',
    playlist: '',
    audioFile: null
  })

  //Loading
  const [isMetaLoading, setIsMetaLoading] = useState<boolean>(false)

  const fetchMetadata = async () => {
    const uploadedThumbnailMeta = await getFileMetadata(itemData?.thumbnail)

    const audioPlaybackId = getMuxPlaybackIdFromUrl(itemData?.audio)
    const uploadAudioMeta = await dispatch(fetchMuxAudioMeta({ id: audioPlaybackId }) as any)

    setThumbnailName(uploadedThumbnailMeta?.name)
    setSelectedFileAudio(uploadAudioMeta?.payload)
    setIsMetaLoading(false)
  }

  // Fetch meta for Music Thumbnail
  useEffect(() => {
    if (isEdit && itemData?.thumbnail && itemData?.audio) {
      setIsMetaLoading(true)
      fetchMetadata()
    }
  }, [isEdit])

  useEffect(() => {
    if (fileAudio) {
      setSelectedForPreview((prev: any) => ({
        ...prev,
        audioFile: fileAudio
      }))
    }
  }, [fileAudio])

  //Form
  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    trigger,
    getValues
  } = useForm<AddMusicFormValues>({
    resolver: zodResolver(addMusicSchema),
    defaultValues: {
      name: isEdit ? itemData?.name : '',
      artistName: isEdit ? itemData?.artistName : '',
      playlistId: isEdit ? itemData?.playlist?.id : null,
      licenseTypeId: isEdit ? itemData?.licenseType?.id : null
    }
  })

  const onSubmit = async (data: AddMusicFormValues) => {
    const payloadData = {
      id: itemData?.id,
      itemData,
      data,
      musicThumbnail,
      fileAudio,
      handleClose,
      addUploadInstance,
      removeUploadInstance
    }

    if (isEdit) {
      dispatch(editMusic(payloadData) as any)
    } else {
      dispatch(addMusic(payloadData) as any)
    }
  }

  const steps = [
    {
      number: '01',
      title: 'Upload Music',
      component: (
        <UploadMusic
          fileAudio={fileAudio}
          setFileAudio={setFileAudio}
          selectedFileAudio={selectedFileAudio}
          setSelectedFileAudio={setSelectedFileAudio}
          loading={isMetaLoading}
          previewThumbnail={musicThumbnail || itemData?.thumbnail}
          showThumbnail={true}
          itemData={itemData}
        />
      )
    },
    {
      number: '02',
      title: 'Add Music Details',
      component: (
        <AddMusicDetails
          control={control}
          errors={errors}
          setSelectedForPreview={setSelectedForPreview}
          setMusicThumbnail={setMusicThumbnail}
          thumbnailName={thumbnailName}
          setThumbnailName={setThumbnailName}
          thumbnailError={thumbnailError}
          setThumbnailError={setThumbnailError}
          itemData={itemData}
        />
      )
    },
    {
      number: '03',
      title: 'Preview',
      component: (
        <PreviewMusic
          getValues={getValues}
          selectedForPreview={selectedForPreview}
          setSelectedForPreview={setSelectedForPreview}
          musicThumbnail={musicThumbnail}
          isEdit={isEdit}
          itemData={itemData}
        />
      )
    }
  ]

  const handleNext = async () => {
    // Step 1: Music upload step – Ensure music file is selected
    if (activeStep === 0) {
      if (!fileAudio && !selectedFileAudio) {
        return toast.error('Audio file is required')
      }
    }

    // Step 2: Form & thumbnail validation step
    if (activeStep === 1) {
      const isFormValid = await trigger()
      let thumbnailIsValid = true

      if (!musicThumbnail && isEdit && !thumbnailName) {
        setThumbnailError('Thumbnail is required')
        thumbnailIsValid = false
      } else if (musicThumbnail) {
        if (musicThumbnail.size > MUSIC_THUMBNAIL_SIZE) {
          setThumbnailError(`Thumbnail must be less than ${MUSIC_THUMBNAIL_SIZE} MB`)
          thumbnailIsValid = false
        }
      } else if (!isEdit && !musicThumbnail) {
        setThumbnailError('Thumbnail is required')
        thumbnailIsValid = false
      }

      if (!isFormValid || !thumbnailIsValid) return
    }

    // Step 3: Preview & Submit step - Final form submission
    if (activeStep === 2 && activeStep === steps.length - 1) {
      return handleSubmit(onSubmit)()
    }

    if (activeStep < steps.length - 1) {
      setActiveStep(prev => prev + 1)
    }
  }

  const handleBack = () => {
    setActiveStep(prev => prev - 1)
  }

  return (
    <div className='flex flex-col gap-3'>
      {/* Stepper Section */}
      <StepperRender activeStep={activeStep} steps={steps} />
      {/* Modal Content */}
      <div className='mt-2'>{steps[activeStep]?.component}</div>
      {/* Stepper Form Button */}
      <div className='flex justify-center gap-2 mt-1'>
        {activeStep === 0 ? (
          <BorderButton handleClick={() => handleClose()} text='No, Cancel' />
        ) : (
          <BorderButton handleClick={handleBack} text='Back' disabled={isAddMusicLoading || isEditMusicLoading} />
        )}
        {activeStep === steps.length - 1 ? (
          <CustomButton
            handleClick={handleNext}
            color='primary'
            text={isEdit ? 'Update Music' : 'Upload Music'}
            loading={isAddMusicLoading || isEditMusicLoading}
            disabled={isEdit && !isDirty && !musicThumbnail && !fileAudio}
          />
        ) : (
          <CustomButton handleClick={handleNext} color='primary' text='Next' disabled={isMetaLoading} />
        )}
      </div>
    </div>
  )
}

export default AddEditMusic
