// 'use client'

// //React Imports
// import React, { createContext, useContext, useRef } from 'react'

// //Types Imports
// import type { UploadContextType } from '@custom-types/common'

// const UploadContext = createContext<UploadContextType | null>(null)

// export const useUploadContext = () => {
//   const context = useContext(UploadContext)

//   if (!context) throw new Error('useUploadContext must be used within an UploadProvider')

//   return context
// }

// export const UploadProvider = ({ children }: any) => {
//   const uploadsRef = useRef(new Map())

//   const addUploadInstance = (itemId: any, uploadInstance: any) => {
//     uploadsRef.current.set(itemId, uploadInstance)
//   }

//   const getUploadInstance = (itemId: any) => {
//     return uploadsRef.current.get(itemId)
//   }

//   const removeUploadInstance = (itemId: any) => {
//     uploadsRef.current.delete(itemId)
//   }

//   const stopUploadInstance = (itemId: any) => {
//     const upload = uploadsRef.current.get(itemId)

//     if (upload) {
//       upload.abort?.()
//       uploadsRef.current.delete(itemId)
//     }
//   }

//   const stopAllUploadInstances = (itemId: number) => {
//     const stringId = String(itemId)

//     for (const [key, uploadInstance] of uploadsRef.current.entries()) {
//       const keyString = String(key) // Ensure key is always string

//       if (keyString.startsWith(stringId)) {
//         uploadInstance?.abort?.()
//         uploadsRef.current.delete(key)
//       }
//     }
//   }

//   return (
//     <UploadContext.Provider
//       value={{ addUploadInstance, getUploadInstance, removeUploadInstance, stopUploadInstance, stopAllUploadInstances }}
//     >
//       {children}
//     </UploadContext.Provider>
//   )
// }
