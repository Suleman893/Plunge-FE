'use client'

//React Imports
import React, { createContext, useContext, useRef } from 'react'

//Third Party Imports
import * as tus from 'tus-js-client'
import type { Upload } from 'tus-js-client'

type UploadItem = {
  uploadId: string
  uploadInstance: Upload
}

type UploadContextType = {
  addUploadInstance: (itemId: number | string, uploadId: string, instance: Upload) => void
  removeUploadInstance: (itemId: number | string, uploadId: string) => void
  abortAllUploadsAgainstId: (itemId: string | number) => void
}

const UploadContext = createContext<UploadContextType | null>(null)

export const useUploadContext = (): UploadContextType => {
  const context = useContext(UploadContext)

  if (!context) throw new Error('useUploadContext must be used within an UploadProvider')

  return context
}

export const UploadProvider = ({ children }: { children: React.ReactNode }) => {
  const uploadsRef = useRef<Map<string, UploadItem[]>>(new Map())

  const addUploadInstance = (itemId: string | number, uploadId: string, instance: Upload) => {
    const id = String(itemId)
    const current = uploadsRef.current.get(id) || []

    // Prevent adding duplicate uploadId
    const isDuplicate = current.some(i => i.uploadId === uploadId)

    if (!isDuplicate) {
      uploadsRef.current.set(id, [...current, { uploadId, uploadInstance: instance }])
    }
  }

  const removeUploadInstance = (itemId: string | number, uploadId: string) => {
    const id = String(itemId)
    const current = uploadsRef.current.get(id)

    if (!current) return

    const updated = current.filter(i => i.uploadId !== uploadId)

    if (updated.length > 0) {
      uploadsRef.current.set(id, updated)
    } else {
      uploadsRef.current.delete(id)
    }
  }

  const abortAllUploadsAgainstId = async (itemId: string | number) => {
    const id = String(itemId)
    const uploads = uploadsRef.current.get(id)

    if (uploads && uploads.length > 0) {
      for (const { uploadId, uploadInstance } of uploads) {
        uploadInstance.abort?.()

        const file = uploadInstance.file

        if (file instanceof File) {
          const fingerprint = ['tus', uploadId, file.name, file.type, file.size, file.lastModified].join('-')

          try {
            const urlStorage = tus.defaultOptions.urlStorage
            const previousUploads = await urlStorage.findUploadsByFingerprint(fingerprint)

            for (const upload of previousUploads) {
              if (upload.urlStorageKey) {
                await urlStorage.removeUpload(upload.urlStorageKey)
              }
            }
          } catch (err) {
            console.warn(`Failed to remove upload for uploadId ${uploadId}`, err)
          }
        }
      }

      uploadsRef.current.delete(id)
    }
  }

  return (
    <UploadContext.Provider
      value={{
        addUploadInstance,
        removeUploadInstance,
        abortAllUploadsAgainstId
      }}
    >
      {children}
    </UploadContext.Provider>
  )
}
