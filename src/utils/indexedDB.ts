// import { envConfig } from '@/configs/envConfig'

// const DB_NAME = envConfig.DB_NAME || 'PrimalPlunges'
// const STORE_NAME = envConfig.STORE_NAME || 'files'
// const DB_VERSION = envConfig.DB_VERSION || 1

// // Open DB Utility
// const openIndexedDB = (): Promise<IDBDatabase> => {
//   return new Promise((resolve, reject) => {
//     const request = indexedDB.open(DB_NAME, DB_VERSION)

//     request.onupgradeneeded = (event: any) => {
//       const db = event.target.result

//       if (!db.objectStoreNames.contains(STORE_NAME)) {
//         db.createObjectStore(STORE_NAME, { keyPath: 'id' })
//       }
//     }

//     request.onsuccess = (event: any) => {
//       resolve(event.target.result)
//     }

//     request.onerror = (event: any) => {
//       console.error('IndexedDB open error:', event.target.error)
//       reject(event.target.error)
//     }
//   })
// }

// // Save File
// export const saveFileToIndexedDB = async (
//   id: string,
//   uploadUrl: any,
//   type: string,
//   file: any,
//   prevFileUrl: string | undefined
// ): Promise<void> => {
//   const db = await openIndexedDB()

//   if (!db.objectStoreNames.contains(STORE_NAME)) {
//     console.error(`Object store '${STORE_NAME}' does not exist.`)

//     return
//   }

//   const transaction = db.transaction([STORE_NAME], 'readwrite')
//   const store = transaction.objectStore(STORE_NAME)

//   const stringId = String(id)

//   const fileToSave = {
//     id: stringId,
//     uploadUrl,
//     type,
//     file,
//     prevFileUrl,
//     path: file.path,
//     relativePath: file.relativePath
//   }

//   return new Promise((resolve, reject) => {
//     const putRequest = store.put(fileToSave)

//     putRequest.onsuccess = () => console.log(`File with ID ${id} stored successfully`)

//     transaction.oncomplete = () => resolve()
//     transaction.onerror = (e: any) => reject(e.target.error)
//   })
// }

// // Read All Files
// export const readFilesFromIndexedDB = async (): Promise<any[]> => {
//   try {
//     const db = await openIndexedDB()

//     if (!db.objectStoreNames.contains(STORE_NAME)) {
//       console.warn(`No object store '${STORE_NAME}' found. Returning empty list.`)

//       return []
//     }

//     const transaction = db.transaction([STORE_NAME], 'readonly')
//     const store = transaction.objectStore(STORE_NAME)

//     return new Promise((resolve, reject) => {
//       const getAllRequest = store.getAll()

//       getAllRequest.onsuccess = () => resolve(getAllRequest.result || [])
//       getAllRequest.onerror = (e: any) => reject(e.target.error)
//     })
//   } catch (err) {
//     console.error('Failed to read from IndexedDB:', err)

//     return []
//   }
// }

// // Delete File (Fail-Safe)
// export const deleteFileFromIndexedDB = async (id: string): Promise<void> => {
//   try {
//     const db = await openIndexedDB()

//     if (!db.objectStoreNames.contains(STORE_NAME)) {
//       console.warn(`No object store '${STORE_NAME}' found. Nothing to delete.`)

//       return
//     }

//     const transaction = db.transaction([STORE_NAME], 'readwrite')
//     const store = transaction.objectStore(STORE_NAME)

//     const deleteRequest = store.delete(String(id))

//     deleteRequest.onsuccess = () => console.log(`File with ID ${id} deleted successfully`)

//     return new Promise((resolve, reject) => {
//       transaction.oncomplete = () => resolve()
//       transaction.onerror = (e: any) => reject(e.target.error)
//     })
//   } catch (err) {
//     console.warn(`Failed to delete file ID ${id}:`, err)
//   }
// }

// // Delete by ID to delete all the Composite Key related
// export const deleteFilesFromIndexedDB = async (id: string | number): Promise<void> => {
//   try {
//     const db = await openIndexedDB()

//     if (!db.objectStoreNames.contains(STORE_NAME)) {
//       console.warn(`No object store '${STORE_NAME}' found. Nothing to delete.`)

//       return
//     }

//     const transaction = db.transaction([STORE_NAME], 'readwrite')
//     const store = transaction.objectStore(STORE_NAME)

//     const stringId = String(id)

//     const getAllRequest = store.getAll()

//     getAllRequest.onsuccess = () => {
//       const allRecords = getAllRequest.result || []

//       allRecords
//         .filter(item => item.id.startsWith(`${stringId}_`))
//         .forEach(item => {
//           store.delete(item.id)
//           console.log(`Deleted composite key: ${item.id}`)
//         })
//     }

//     getAllRequest.onerror = (e: any) => {
//       console.error('Composite delete failed:', e.target.error)
//     }

//     return new Promise((resolve, reject) => {
//       transaction.oncomplete = () => resolve()
//       transaction.onerror = (e: any) => reject(e.target.error)
//     })
//   } catch (err) {
//     console.warn(`Failed to delete files for ID ${id}:`, err)
//   }
// }

// //Parse the Composite Key for get id and key separate (For Plunge/Product Models)
// export const parseCompositeKey = (compositeKey: string): { id: string; key: string } => {
//   const lastUnderscoreIndex = compositeKey.lastIndexOf('_')

//   const id = compositeKey.substring(0, lastUnderscoreIndex)
//   const key = compositeKey.substring(lastUnderscoreIndex + 1)

//   return { id, key }
// }
