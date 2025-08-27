export enum Roles {
  SuperAdmin = 'super_admin',
  Admin = 'admin'
}

// export interface UploadContextType {
//   addUploadInstance: (itemId: any, uploadInstance: any) => void
//   getUploadInstance: (itemId: any) => any
//   removeUploadInstance: (itemId: any) => void
//   stopUploadInstance: (itemId: any) => void
//   stopAllUploadInstances: (itemId: any) => void
// }

export interface TusUploadParams {
  type: 'music' | 'video' | 'setup-video' | 'pairing-video' | 'trouble-shoot-video'
  file: File
  uploadedItem: any
  dispatch: any
  setProgress: any
  resetProgress: any
  addUploadInstance: any
  removeUploadInstance: any
}
