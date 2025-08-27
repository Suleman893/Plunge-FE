// 'use client'

// //React Import
// import { useEffect } from 'react'

// //Third Party Imports
// import { useDispatch } from 'react-redux'
// import { UpChunk } from '@mux/upchunk'

// //Redux Imports
// import { resetVideoUploadProgress, setVideoUploadProgress } from '@features/video-management/progress/slice'
// import { resetMusicUploadProgress, setMusicUploadProgress } from '@features/music-management/progress/slice'
// import {
//   resetPlungeModelUploadProgressByKey,
//   setPlungeModelUploadProgress
// } from '@features/plunge-model/progress/slice'
// import musicManagementService from '@features/music-management/service'
// import videoManagementService from '@features/video-management/service'
// import plungeService from '@features/plunge-model/service'

// //Context Imports
// import { useUploadContext } from '@core/contexts/uploadInstanceContext'

// //Helpers and Utils Imports
// import { deleteFileFromIndexedDB, parseCompositeKey, readFilesFromIndexedDB } from '@utils/indexedDB'

// //Constants Imports
// import { UPLOAD_CHUNK } from '@constants/common'

// export const useResumeUploadsFromIndexedDB = () => {
//   const dispatch = useDispatch()
//   const { addUploadInstance, removeUploadInstance } = useUploadContext()

//   useEffect(() => {
//     const resumeUploads = async () => {
//       try {
//         const savedFiles = await readFilesFromIndexedDB()

//         if (savedFiles.length > 0) {
//           savedFiles.forEach((record: any) => {
//             const { id, uploadUrl, type, file, prevFileUrl } = record

//             const fileBlob = record.file
//             const fileName = record.fileName
//             const filePath = record.path
//             const fileRelativePath = record.relativePath

//             const reconstructedFile: any = new File([fileBlob], fileName, { type: fileBlob.type })

//             reconstructedFile.path = filePath
//             reconstructedFile.relativePath = fileRelativePath

//             if (uploadUrl && file) {
//               const upload = UpChunk.createUpload({
//                 endpoint: uploadUrl,
//                 file: reconstructedFile,
//                 chunkSize: UPLOAD_CHUNK
//               })

//               //Saving Instance of Mux, been used for all three modules
//               addUploadInstance(id, upload)

//               upload.on('progress', (event: any) => {
//                 if (type === 'video') {
//                   dispatch(setVideoUploadProgress({ id: Number(id), progress: event.detail }))
//                 } else if (type === 'music') {
//                   dispatch(setMusicUploadProgress({ id: Number(id), progress: event.detail }))
//                 } else if (type === 'plunge-models') {
//                   const { id: actualId, key } = parseCompositeKey(id)
//                   const parsedId = Number(actualId)

//                   dispatch(setPlungeModelUploadProgress({ id: parsedId, key: key, progress: event.detail }))
//                 }
//               })

//               upload.on('success', async () => {
//                 if (type === 'video') {
//                   const parsedId = Number(id)

//                   dispatch(resetVideoUploadProgress({ id: parsedId }))
//                   await deleteFileFromIndexedDB(id)
//                   removeUploadInstance(id)

//                   if (prevFileUrl) {
//                     await videoManagementService.removeAssetFromMux(prevFileUrl)
//                   }
//                 } else if (type === 'music') {
//                   const parsedId = Number(id)

//                   dispatch(resetMusicUploadProgress({ id: parsedId }))
//                   await deleteFileFromIndexedDB(id)
//                   removeUploadInstance(id)

//                   if (prevFileUrl) {
//                     await musicManagementService.removeAssetFromMux(prevFileUrl)
//                   }
//                 } else if (type === 'plunge-models') {
//                   const { id: actualId, key } = parseCompositeKey(id)
//                   const parsedId = Number(actualId)

//                   if (key === 'pairingVideo') {
//                     resetPlungeModelUploadProgressByKey({
//                       id: parsedId,
//                       key: 'pairingVideo'
//                     })
//                     await deleteFileFromIndexedDB(`${parsedId}_${key}`)
//                     removeUploadInstance(`${parsedId}_${key}`)

//                     if (prevFileUrl) {
//                       await plungeService.removeAssetFromMux(prevFileUrl)
//                     }
//                   } else if (key === 'setupVideo') {
//                     resetPlungeModelUploadProgressByKey({
//                       id: parsedId,
//                       key: 'setupVideo'
//                     })
//                     await deleteFileFromIndexedDB(`${parsedId}_${key}`)
//                     removeUploadInstance(`${parsedId}_${key}`)

//                     if (prevFileUrl) {
//                       await plungeService.removeAssetFromMux(prevFileUrl)
//                     }
//                   } else if (key === 'troubleShootVideo') {
//                     resetPlungeModelUploadProgressByKey({
//                       id: parsedId,
//                       key: 'troubleShootVideo'
//                     })
//                     await deleteFileFromIndexedDB(`${parsedId}_${key}`)
//                     removeUploadInstance(`${parsedId}_${key}`)

//                     if (prevFileUrl) {
//                       await plungeService.removeAssetFromMux(prevFileUrl)
//                     }
//                   }
//                 }
//               })

//               upload.on('error', async event => {
//                 console.log('The error from mux upload', event)

//                 // try {
//                 //   // If action is 'add', delete the newly created record from the database (cleanup on failure)
//                 //   // Wrapped in try-catch to avoid breaking the upload flow if deletion fails.
//                 //   if (action === 'add' && uploadedVideoInfo?.id) {
//                 //     try {
//                 //       await ProtectedAPI.delete(`/admin/video/delete/${uploadedVideoInfo.id}`)
//                 //     } catch (err) {
//                 //       console.log('The error', err)
//                 //     }
//                 //   }
//                 // } catch (error) {
//                 //   console.error('Failed to delete video from database', error)
//                 // }

//                 // dispatch(resetUploadProgress({ id: id }))
//                 // await deleteFileFromIndexedDB(id)
//               })
//             }
//           })
//         }
//       } catch (error) {
//         console.error('Failed to reload uploads:', error)
//       }
//     }

//     resumeUploads()
//   }, [])
// }
