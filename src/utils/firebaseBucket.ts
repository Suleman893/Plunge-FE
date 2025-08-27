//Third Party Imports
import { ref, uploadBytes, getDownloadURL, deleteObject, getMetadata } from 'firebase/storage'

//Config
import { storage } from './firebaseConfig'
import { envConfig } from '@configs/envConfig'

export const uploadFileAndGetURL = async (
  file: File,
  path: string,
  allowedTypes: string[],
  maxSize: number | null
): Promise<any> => {
  const isValidType = allowedTypes.includes(file.type)

  if (!isValidType) {
    throw new Error('Invalid file type')
  }

  if (maxSize !== null) {
    const isFileSizeExceed = file.size >= maxSize

    if (isFileSizeExceed) {
      throw new Error('File exceeds maximum size')
    }
  }

  try {
    const storageRef = ref(storage, path)

    await uploadBytes(storageRef, file)
    const downloadURL = await getDownloadURL(storageRef)

    return downloadURL
  } catch (err) {
    console.log('The err in upload', err)
    throw new Error('Failed to upload file')
  }
}

export const deleteFileFromBucket = async (url: string): Promise<any> => {
  if (!url) {
    // throw new Error('Invalid URL')
    console.warn('deleteFileFromBucket: Empty URL received.')

    return false
  }

  const getPathFromUrl = (url: string): any => {
    const parts = url.split('/o/')

    if (parts.length < 2) return null
    const path = parts[1].split('?')[0]

    return decodeURIComponent(path)
  }

  const filePath = getPathFromUrl(url)

  if (!filePath) {
    return false

    // throw new Error('Failed to parse file path from URL')
  }

  try {
    const fileRef = ref(storage, filePath)

    await deleteObject(fileRef)

    return true
  } catch (err) {
    console.log('The err', err)

    return true

    // return false //Ignore error

    // Commented throwing error, to allow updation or deletion even if file not found in firebase
    // throw new Error('Failed to delete file')
  }
}

export const getFileMetadata = async (fileUrl: string): Promise<any> => {
  try {
    const getPathFromUrl = (url: string): string | null => {
      const parts = url.split('/o/')

      if (parts.length < 2) return null
      const path = parts[1].split('?')[0]

      return decodeURIComponent(path)
    }

    const filePath = getPathFromUrl(fileUrl)

    if (!filePath) {
      throw new Error('Failed to parse file path from URL')
    }

    const fileRef = ref(storage, filePath)

    const metadata = await getMetadata(fileRef)

    const name = metadata.name
    const size = metadata.size
    const type = metadata.contentType
    const url = fileUrl

    return { name, size, type, url }
  } catch (err) {
    throw new Error('Failed to fetch url meta data')
  }
}

export const getFirebasePublicUrl = (uploadId: string) => {
  const bucket = envConfig.FIREBASE_STORAGE_BUCKET

  return `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${uploadId}?alt=media`
}
