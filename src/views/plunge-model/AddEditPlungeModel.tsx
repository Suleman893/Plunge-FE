'use client'

//React Imports
import { useState, useEffect } from 'react'

//Next Imports
import { useParams, useRouter } from 'next/navigation'

//Third Party Imports
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify'

//MUI Imports
import Grid from '@mui/material/Grid2'

//Components Imports
import FileUpload from '@components/file-drop'
import ModelInfoForm from '@components/views/plunge-model/add/ModelInfoForm'
import AddEditSectionInfo from '@components/views/plunge-model/add/AddEditPlungeSectionInfo'
import CardContentWrapper from '@components/common/CardContentWrapper'
import SectionInfo from '@components/cards/SectionInfo'

//Constants Import
import {
  PLUNGE_MODEL_IMG_MAX_SIZE,
  PLUNGE_MODEL_IMG_TYPE,
  PLUNGE_MODEL_VIDEO_TYPE

  // PLUNGE_MODEL_VIDEO_MAX_SIZE,
} from '@constants/common'

//Types Imports
import type { AddEditPageParams } from '@custom-types/pages/plunge-models'

//Schema Imports
import type { AddPlungeFormValues } from '@schemas/plungeModel'
import { addPlungeSchema } from '@schemas/plungeModel'

//Redux Imports
import { addPlungeModel, editPlungeModel, fetchMuxVideoMeta } from '@features/plunge-model/thunk'
import type { RootState } from '@features/store'

//Context Imports
import { useUploadContext } from '@core/contexts/uploadInstanceContext'

//Utils and Helpers Imports
import { getFileMetadata } from '@utils/firebaseBucket'
import { getMuxPlaybackIdFromUrl } from '@helpers/common'

const AddEditPlungeModel = () => {
  //Hooks
  const dispatch = useDispatch()
  const router = useRouter()
  const params: AddEditPageParams = useParams()
  const { addUploadInstance, removeUploadInstance } = useUploadContext()

  //Mode (add, edit)
  const mode = params.mode

  const { isAddPlungeModelLoading, isEditPlungeModelLoading, plungeModelInfo } = useSelector(
    (state: RootState) => state.plungeModel
  )

  //States

  //Files
  const [fileImg, setFileImg] = useState<File | null>(null)
  const [fileSetupVideo, setFileSetupVideo] = useState<File | null>(null)
  const [filePairingVideo, setFilePairingVideo] = useState<File | null>(null)
  const [fileTroubleShootVideo, setFileTroubleShootVideo] = useState<File | null>(null)

  const [selectedFileImg, setSelectedFileImg] = useState<any>(null)
  const [selectedSetupFileVideo, setSelectedSetupFileVideo] = useState<any>(null)
  const [selectedPairingFileVideo, setSelectedPairingFileVideo] = useState<any>(null)
  const [selectedTroubleShootVideo, setSelectedTroubleShootVideo] = useState<any>(null)

  //Refetch meta for files on discard button
  const [reFetchFile, setReFetchFile] = useState<boolean>(false)

  //Loading for Meta data
  const [isMetaLoading, setIsMetaLoading] = useState<boolean>(false)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty }
  } = useForm<AddPlungeFormValues>({
    resolver: zodResolver(addPlungeSchema),
    defaultValues: {
      tuyaId: mode === 'edit' ? plungeModelInfo?.tuyaProduct?.id : null,
      name: mode === 'edit' ? plungeModelInfo?.name : '',
      modelId: mode === 'edit' ? plungeModelInfo?.modelId : '',
      thumbnail: mode === 'edit' ? plungeModelInfo?.thumbnail : ''
    }
  })

  const fetchMetadata = async () => {
    const uploadPicMeta = await getFileMetadata(plungeModelInfo?.thumbnail)

    const setupVideoPlaybackId = getMuxPlaybackIdFromUrl(plungeModelInfo?.setupVideo)
    const pairingVideoPlaybackId = getMuxPlaybackIdFromUrl(plungeModelInfo?.pairingVideo)
    const troubleShootVideoPlaybackId = getMuxPlaybackIdFromUrl(plungeModelInfo?.troubleShootVideo)

    const uploadSetupVideoMeta = await dispatch(fetchMuxVideoMeta({ id: setupVideoPlaybackId }) as any)
    const uploadPairingVideoMeta = await dispatch(fetchMuxVideoMeta({ id: pairingVideoPlaybackId }) as any)
    const uploadTroubleShootVideoMeta = await dispatch(fetchMuxVideoMeta({ id: troubleShootVideoPlaybackId }) as any)

    setSelectedFileImg(uploadPicMeta)

    setSelectedPairingFileVideo(uploadPairingVideoMeta?.payload)
    setSelectedSetupFileVideo(uploadSetupVideoMeta?.payload)
    setSelectedTroubleShootVideo(uploadTroubleShootVideoMeta?.payload)

    setIsMetaLoading(false)
  }

  useEffect(() => {
    if (
      mode === 'edit' &&
      plungeModelInfo?.thumbnail &&
      plungeModelInfo?.pairingVideo &&
      plungeModelInfo?.setupVideo &&
      plungeModelInfo?.troubleShootVideo
    ) {
      setIsMetaLoading(true)
      fetchMetadata()
    }
  }, [reFetchFile])

  const onSubmit = async (data: AddPlungeFormValues) => {
    const payloadData: any = {
      id: plungeModelInfo?.id,
      data,
      itemData: plungeModelInfo,
      router,
      addUploadInstance,
      removeUploadInstance
    }

    if (fileImg) payloadData.fileImg = fileImg
    if (fileSetupVideo) payloadData.fileSetupVideo = fileSetupVideo
    if (filePairingVideo) payloadData.filePairingVideo = filePairingVideo
    if (fileTroubleShootVideo) payloadData.fileTroubleShootVideo = fileTroubleShootVideo

    switch (mode) {
      case 'add':
        if (!fileImg) {
          return toast.error('Image is required')
        }

        if (!fileSetupVideo) {
          return toast.error('Setup video is required')
        }

        if (!filePairingVideo) {
          return toast.error('Pairing video is required')
        }

        if (!fileTroubleShootVideo) {
          return toast.error('Trouble shoot video is required')
        }

        dispatch(addPlungeModel(payloadData) as any)
        break

      case 'edit':
        if (!fileImg && !selectedFileImg) {
          return toast.error('Image is required')
        }

        if (!fileSetupVideo && !selectedSetupFileVideo) {
          return toast.error('Setup video is required')
        }

        if (!filePairingVideo && !selectedPairingFileVideo) {
          return toast.error('Pairing video is required')
        }

        if (!fileTroubleShootVideo && !selectedTroubleShootVideo) {
          return toast.error('Trouble shoot video is required')
        }

        dispatch(editPlungeModel(payloadData) as any)
        break

      default:
        break
    }
  }

  //Discard Button Handler
  const handleDiscard = () => {
    reset() // reset form fields
    setFileImg(null) // reset new image file
    setFileSetupVideo(null) // reset new pairing video file
    setFilePairingVideo(null) // reset new setup video file
    setFileTroubleShootVideo(null) // reset new trouble shoot video file
    setReFetchFile(!reFetchFile)

    if (mode === 'edit') {
      //If edit then fetch the meta data and apply previous uploaded picture
      fetchMetadata()
    }
  }

  //Keep save button disabled
  const isFormChanged =
    isDirty ||
    selectedFileImg === null ||
    selectedSetupFileVideo === null ||
    selectedPairingFileVideo === null ||
    fileImg !== null ||
    fileSetupVideo !== null ||
    filePairingVideo !== null ||
    fileTroubleShootVideo !== null

  return (
    <>
      <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
        <AddEditSectionInfo
          mode={mode}
          loading={isAddPlungeModelLoading || isEditPlungeModelLoading}
          reset={handleDiscard}
          disabled={isMetaLoading || !isFormChanged}
        />
        <Grid container sx={{ mt: 4 }}>
          <Grid size={{ xs: 12 }}>
            {/* First Row  */}
            <CardContentWrapper
              title='Model Image'
              content={
                <FileUpload
                  file={fileImg}
                  setFile={setFileImg}
                  selectedFile={mode === 'edit' ? selectedFileImg : null}
                  setSelectedFile={setSelectedFileImg}
                  maxSize={PLUNGE_MODEL_IMG_MAX_SIZE}
                  allowedTypes={PLUNGE_MODEL_IMG_TYPE}
                  fileType='Image'
                  loading={isMetaLoading}
                />
              }
            />
            {/* Second Row  */}
            <Grid container spacing={4} sx={{ mt: 4 }}>
              <Grid size={{ xs: 12 }}>
                <CardContentWrapper
                  sx={{ height: '100%' }}
                  title='Model Information'
                  content={<ModelInfoForm control={control} errors={errors} />}
                />
              </Grid>
            </Grid>

            {/* Third Row  */}
            <Grid container spacing={4} sx={{ mt: 4 }}>
              <SectionInfo
                title='Upload Video Guides'
                description='These videos will help users to understand about adding & pairing their product in the mobile app'
              />
            </Grid>
            {/* Fourth Row  */}
            <Grid container spacing={4} sx={{ mt: 4 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <CardContentWrapper
                  title='Setup Video'
                  sx={{ height: '100%' }}
                  content={
                    <FileUpload
                      file={fileSetupVideo}
                      setFile={setFileSetupVideo}
                      selectedFile={mode === 'edit' ? selectedSetupFileVideo : null}
                      setSelectedFile={setSelectedSetupFileVideo}
                      maxSize={undefined}
                      allowedTypes={PLUNGE_MODEL_VIDEO_TYPE}
                      fileType='Video'
                      loading={isMetaLoading}
                    />
                  }
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <CardContentWrapper
                  title='Pairing Video'
                  sx={{ height: '100%' }}
                  content={
                    <FileUpload
                      file={filePairingVideo}
                      setFile={setFilePairingVideo}
                      selectedFile={mode === 'edit' ? selectedPairingFileVideo : null}
                      setSelectedFile={setSelectedPairingFileVideo}
                      maxSize={undefined}
                      allowedTypes={PLUNGE_MODEL_VIDEO_TYPE}
                      fileType='Video'
                      loading={isMetaLoading}
                    />
                  }
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <CardContentWrapper
                  title='Trouble Shoot Video'
                  sx={{ height: '100%' }}
                  content={
                    <FileUpload
                      file={fileTroubleShootVideo}
                      setFile={setFileTroubleShootVideo}
                      selectedFile={mode === 'edit' ? selectedTroubleShootVideo : null}
                      setSelectedFile={setSelectedTroubleShootVideo}
                      maxSize={undefined}
                      allowedTypes={PLUNGE_MODEL_VIDEO_TYPE}
                      fileType='Video'
                      loading={isMetaLoading}
                    />
                  }
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </>
  )
}

export default AddEditPlungeModel
