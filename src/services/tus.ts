//Third Party Imports
import * as tus from 'tus-js-client'

//Config Imports
import { envConfig } from '@configs/envConfig'

//Redux Imports
import videoManagementService from '@features/video-management/service'
import musicManagementService from '@features/music-management/service'
import plungeModelService from '@features/plunge-model/service'

//Custom Types Imports
import type { TusUploadParams } from '@custom-types/common'

//Constants Imports
import { UPLOAD_CHUNK, AUDIO_UPLOAD_CHUNK, FILE_UPLOAD_RETRY_BACKOFF_MS } from '@constants/common'

export const tusUpload = async (props: TusUploadParams) => {
  const { type, file, uploadedItem, dispatch, setProgress, resetProgress, addUploadInstance, removeUploadInstance } =
    props

  //Upload Id for unique fingerprint
  let uploadId = ''

  //Tus Server
  const upload = new tus.Upload(file, {
    endpoint: `${envConfig.API_URL}/upload/tus`,
    chunkSize: type === 'music' ? AUDIO_UPLOAD_CHUNK : UPLOAD_CHUNK,
    retryDelays: FILE_UPLOAD_RETRY_BACKOFF_MS,
    metadata: {
      filename: file.name,
      filetype: file.type,
      lastmodified: file.lastModified.toString(),
      size: file.size.toString()
    },
    removeFingerprintOnSuccess: true,
    fingerprint: async file => {
      if (type === 'video') {
        uploadId = uploadedItem.videoUploadId
      } else if (type === 'music') {
        uploadId = uploadedItem.audioUploadId
      } else if (type === 'setup-video') {
        uploadId = uploadedItem.setupVideoUploadId
      } else if (type === 'pairing-video') {
        uploadId = uploadedItem.pairingVideoUploadId
      } else if (type === 'trouble-shoot-video') {
        uploadId = uploadedItem.troubleShootVideoUploadId
      }

      return ['tus', uploadId, file.name, file.type, file.size, file.lastModified].join('-')
    },
    onError: function (error: any) {
      console.error('Upload failed in reloads:', error)
    },
    onProgress: function (bytesUploaded: number, bytesTotal: number) {
      const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2)

      dispatch(setProgress({ id: uploadedItem.id, progress: Number(percentage), isPaused: false }))
      console.log(`Upload progress in reloads: ${percentage}%`)
    },
    onSuccess: async function () {
      dispatch(resetProgress({ id: uploadedItem.id }))

      switch (type) {
        case 'video':
          if (upload.url) {
            await videoManagementService.createAssetUsingUrl(uploadedItem?.videoUploadId, upload?.url, file)

            if (uploadedItem?.video) {
              await videoManagementService.removeAssetFromMux(uploadedItem?.video)
            }
          }

          break

        case 'music':
          if (upload.url) {
            await musicManagementService.createAssetUsingUrl(uploadedItem?.audioUploadId, upload?.url, file)

            if (uploadedItem?.audio) {
              await musicManagementService.removeAssetFromMux(uploadedItem?.audio)
            }
          }

          break

        case 'setup-video':
          if (uploadedItem?.setupVideo) {
            await musicManagementService.removeAssetFromMux(uploadedItem?.setupVideo)
          }

          if (upload.url) {
            await plungeModelService.createAssetUsingUrl(uploadedItem?.setupVideoUploadId, upload?.url, file)
          }

          break

        case 'pairing-video':
          if (uploadedItem?.pairingVideo) {
            await musicManagementService.removeAssetFromMux(uploadedItem?.pairingVideo)
          }

          if (upload.url) {
            await plungeModelService.createAssetUsingUrl(uploadedItem?.pairingVideoUploadId, upload?.url, file)
          }

          break

        case 'trouble-shoot-video':
          if (uploadedItem?.troubleShootVideo) {
            await musicManagementService.removeAssetFromMux(uploadedItem?.troubleShootVideo)
          }

          if (upload.url) {
            await plungeModelService.createAssetUsingUrl(uploadedItem?.troubleShootVideoId, upload?.url, file)
          }

          break
      }

      removeUploadInstance(uploadedItem?.id, uploadId)
    }
  })

  //Check for previous uploads and resume if possible
  const previousUploads = await upload.findPreviousUploads()

  if (previousUploads.length) {
    upload.resumeFromPreviousUpload(previousUploads[0])
  } else {
    console.log('No previous upload found, starting new...')
  }

  addUploadInstance(uploadedItem?.id, uploadId, upload)
  upload.start()
}
