'use client'

//React Imports
import { useState, useEffect, useMemo } from 'react'

//Third Party Imports
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDispatch, useSelector } from 'react-redux'

// Component Imports
import PreviewVideo from '@components/views/video-management/modal/PreviewVideo'
import UploadVideo from '@components/views/video-management/modal/UploadVideo'
import AddVideoDetails from '@components/views/video-management/modal/AddVideoDetail'
import BorderButton from '@components/buttons/BorderButton'
import CustomButton from '@core/components/mui/Button'
import StepperRender from '@components/modal/shared/StepperRender'
import FollowupVideo from '@components/views/video-management/modal/FollowupVideo'

//Types Imports
import type { AddEditVideoProps } from '@custom-types/pages/video-management'

//Redux Imports
import { addVideo, editVideo, fetchMuxVideoMeta } from '@features/video-management/thunk'
import type { RootState } from '@features/store'

//Context Imports
import { useUploadContext } from '@core/contexts/uploadInstanceContext'

//Schema Imports
import { addVideoSchema, type AddVideoFormValues } from '@schemas/videoManagement'

//Constants Imports
import { VIDEO_THUMBNAIL_SIZE } from '@constants/common'

//Utils And Helpers Imports
import { getFileMetadata } from '@utils/firebaseBucket'
import {
  getMuxPlaybackIdFromUrl,
  getLengthTypeFromDuration,
  getVideoDurationFromFile,
  secondsToHHMMSS,
  hhmmssToSeconds
} from '@helpers/common'

const AddEditVideo = (props: AddEditVideoProps) => {
  const { handleClose, isEdit, itemData } = props

  //Hooks Imports
  const dispatch = useDispatch()
  const { addUploadInstance, removeUploadInstance } = useUploadContext()
  const { isAddVideoLoading, isEditVideoLoading } = useSelector((state: RootState) => state.videoManagement)

  //States
  //Stepper Section
  const [activeStep, setActiveStep] = useState(0)

  //Video Upload
  const [fileVideo, setFileVideo] = useState<File | null>(null)
  const [selectedFileVideo, setSelectedFileVideo] = useState<any>(null)

  //Video Thumbnail
  const [videoThumbnail, setVideoThumbnail] = useState<File | null>(null)
  const [thumbnailName, setThumbnailName] = useState<string>('')
  const [thumbnailError, setThumbnailError] = useState<string>('')

  //For Preview Component
  const [selectedForPreview, setSelectedForPreview] = useState<any>({
    playlist: '',
    instructor: '',
    videoType: null,
    preTimerDuration: '',
    plungeDuration: ''
  })

  //Follow up components
  const [allowFollowUp, setAllowFollowUp] = useState<boolean>(false)
  const [followUpVideoIds, setFollowUpVideoIds] = useState<number[]>([])
  const [followUpError, setFollowUpError] = useState<string>('')

  //Follow up component (Edit)
  const [selectedVideos, setSelectedVideos] = useState<{ id: string; name: string }[]>([])
  const [originalFollowUpIds, setOriginalFollowUpIds] = useState<number[]>([])

  //Loading
  const [isMetaLoading, setIsMetaLoading] = useState<boolean>(false)

  //Fetch Meta Data
  const fetchMetadata = async () => {
    const uploadedThumbnailMeta = await getFileMetadata(itemData?.thumbnail)

    const videoPlaybackId = getMuxPlaybackIdFromUrl(itemData?.video)
    const uploadVideoMeta = await dispatch(fetchMuxVideoMeta({ id: videoPlaybackId }) as any)

    setThumbnailName(uploadedThumbnailMeta?.name)
    setSelectedFileVideo(uploadVideoMeta?.payload)
    setIsMetaLoading(false)
  }

  //Fetch meta for Video Thumbnail
  useEffect(() => {
    if (isEdit && itemData?.thumbnail && itemData?.video) {
      setIsMetaLoading(true)
      fetchMetadata()
    }

    if (isEdit && itemData?.videoInstructor?.id && itemData?.videoInstructor?.name) {
      setSelectedForPreview((prev: any) => ({
        ...prev,
        instructor: itemData?.videoInstructor?.name
      }))
    }

    if (isEdit && itemData?.followUpVideos) {
      //Already selected by user in edit
      const alreadySelectedFollowUpVideos = itemData?.followUpVideos || []

      const currentIds = new Set(selectedVideos.map((itm: any) => itm?.id))

      const nonDuplicate = alreadySelectedFollowUpVideos
        .filter((itm: any) => !currentIds.has(itm.id))
        .map(({ id, name }: any) => ({ id, name }))

      setAllowFollowUp(alreadySelectedFollowUpVideos?.length > 0)

      const finalSelectedVideos = [...selectedVideos, ...nonDuplicate]

      setSelectedVideos(finalSelectedVideos)
      setFollowUpVideoIds(finalSelectedVideos.map((itm: any) => itm.id))
      setOriginalFollowUpIds(alreadySelectedFollowUpVideos.map((itm: any) => itm.id))
    }
  }, [isEdit])

  //Form
  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    trigger,
    getValues,
    setValue
  } = useForm<AddVideoFormValues>({
    resolver: zodResolver(addVideoSchema),
    defaultValues: {
      name: isEdit ? itemData?.name : '',
      videoInstructorId: isEdit ? itemData?.videoInstructor?.id : null,
      mood: isEdit ? itemData?.mood : '',
      playlistId: isEdit ? itemData?.playlist?.id : null,
      videoTypeId: isEdit ? itemData?.videoType?.id : null,
      lengthType: isEdit ? itemData?.lengthType : '',
      preTimerDuration: isEdit ? itemData?.preTimerDuration : '',
      plungeDuration: isEdit ? itemData?.plungeDuration : ''
    }
  })

  const onSubmit = async (data: AddVideoFormValues) => {
    const preTimerSeconds = hhmmssToSeconds(data.preTimerDuration)
    const plungeSeconds = hhmmssToSeconds(data.plungeDuration)

    const finalPlungeSeconds = Math.max(plungeSeconds - preTimerSeconds, 0)
    const finalPlungeDuration = secondsToHHMMSS(finalPlungeSeconds)

    const lengthType = getLengthTypeFromDuration(finalPlungeSeconds)

    const payloadData = {
      id: itemData?.id,
      itemData: itemData,
      data: {
        ...data,
        plungeDuration: finalPlungeDuration,
        lengthType
      },
      videoThumbnail,
      fileVideo,
      followUpVideoIds,
      handleClose,
      addUploadInstance,
      removeUploadInstance
    }

    if (isEdit) {
      dispatch(editVideo(payloadData) as any)
    } else {
      dispatch(addVideo(payloadData) as any)
    }
  }

  useEffect(() => {
    const getAndSetDuration = async () => {
      if (fileVideo) {
        try {
          setSelectedForPreview((prev: any) => ({
            ...prev,
            videoFile: fileVideo
          }))

          const durationInSec = await getVideoDurationFromFile(fileVideo)

          //For plungeDuration field
          const durationFormatted = secondsToHHMMSS(durationInSec)

          //For lengthType field
          const lengthType = getLengthTypeFromDuration(durationInSec)

          setValue('plungeDuration', durationFormatted)

          setValue('lengthType', lengthType)
        } catch (err) {
          console.error('Error reading video duration:', err)
        }
      }
    }

    getAndSetDuration()
  }, [fileVideo])

  //Memorization implemented to check the modification in follow up videos
  const hasFollowUpModified = useMemo(() => {
    if (!isEdit) return false

    //If length is changed means followUpVideos are modified
    if (followUpVideoIds?.length !== originalFollowUpIds.length) return true

    const currentFollowUpVideosIdsSet = new Set(followUpVideoIds)
    const originalFollowUpVideosIdsSet = new Set(originalFollowUpIds)

    for (const id of currentFollowUpVideosIdsSet) {
      if (!originalFollowUpVideosIdsSet.has(id)) return true
    }

    return false
  }, [followUpVideoIds, originalFollowUpIds, isEdit])

  const steps = [
    {
      number: '01',
      title: 'Upload Video',
      component: (
        <UploadVideo
          fileVideo={fileVideo}
          setFileVideo={setFileVideo}
          selectedFileVideo={selectedFileVideo}
          setSelectedFileVideo={setSelectedFileVideo}
          loading={isMetaLoading}
          previewThumbnail={videoThumbnail || itemData?.thumbnail}
          showThumbnail={true}
          itemData={itemData}
        />
      )
    },
    {
      number: '02',
      title: 'Add Video Details',
      component: (
        <AddVideoDetails
          control={control}
          errors={errors}
          isEdit={isEdit || false}
          itemData={itemData}
          selectedForPreview={selectedForPreview}
          setSelectedForPreview={setSelectedForPreview}
          setVideoThumbnail={setVideoThumbnail}
          thumbnailName={thumbnailName}
          setThumbnailName={setThumbnailName}
          thumbnailError={thumbnailError}
          setThumbnailError={setThumbnailError}
          setValue={setValue}
        />
      )
    },
    {
      number: '03',
      title: 'Follow-up Videos',
      component: (
        <FollowupVideo
          allowFollowUp={allowFollowUp}
          setAllowFollowUp={setAllowFollowUp}
          followUpVideoIds={followUpVideoIds}
          setFollowUpVideoIds={setFollowUpVideoIds}
          error={followUpError}
          setError={setFollowUpError}
          selectedFollowUpVideos={selectedVideos}
          setSelectedFollowUpVideos={setSelectedVideos}
          itemData={isEdit ? itemData?.id : null}
        />
      )
    },
    {
      number: '04',
      title: 'Preview',
      component: (
        <PreviewVideo
          getValues={getValues}
          selectedForPreview={selectedForPreview}
          setSelectedForPreview={setSelectedForPreview}
          videoThumbnail={videoThumbnail}
          isEdit={isEdit}
          itemData={itemData}
        />
      )
    }
  ]

  const handleNext = async () => {
    // Step 1: Video upload step – Ensure video file is selected
    if (activeStep === 0) {
      if (!fileVideo && !selectedFileVideo) {
        return toast.error('Video file is required')
      }
    }

    // Step 2: Form & thumbnail validation step
    if (activeStep === 1) {
      const isFormValid = await trigger()
      let thumbnailIsValid = true

      if (!videoThumbnail && isEdit && !thumbnailName) {
        setThumbnailError('Thumbnail is required')
        thumbnailIsValid = false
      } else if (videoThumbnail) {
        if (videoThumbnail.size > VIDEO_THUMBNAIL_SIZE) {
          setThumbnailError(`Thumbnail must be less than ${VIDEO_THUMBNAIL_SIZE} MB`)
          thumbnailIsValid = false
        }
      } else if (!isEdit && !videoThumbnail) {
        setThumbnailError('Thumbnail is required')
        thumbnailIsValid = false
      }

      if (!isFormValid || !thumbnailIsValid) return
    }

    // Step 3: Follow-up video selection step
    if (activeStep === 2) {
      if (allowFollowUp) {
        if (followUpVideoIds.length === 0) {
          return setFollowUpError('Minimum one follow up video is required')
        }

        if (followUpVideoIds.length > 10) {
          return setFollowUpError('Maximum 10 follow up videos are allowed')
        }
      }
    }

    // Step 4: Preview & Submit step – Final form submission
    if (activeStep === 3 && activeStep === steps.length - 1) {
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
          <BorderButton handleClick={handleBack} text='Back' disabled={isAddVideoLoading || isEditVideoLoading} />
        )}
        {activeStep === steps.length - 1 ? (
          <CustomButton
            handleClick={handleNext}
            color='primary'
            text={isEdit ? 'Update Video' : 'Upload Video'}
            loading={isAddVideoLoading || isEditVideoLoading}
            disabled={isEdit && !isDirty && !videoThumbnail && !fileVideo && !hasFollowUpModified}
          />
        ) : (
          <CustomButton handleClick={handleNext} color='primary' text='Next' disabled={isMetaLoading} />
        )}
      </div>
    </div>
  )
}

export default AddEditVideo
