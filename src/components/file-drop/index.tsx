'use client'

//React Import
// import { useEffect } from 'react'

//MUI Imports
// import { styled } from '@mui/material/styles'
// import type { BoxProps } from '@mui/material/Box'

//Third-party Imports
import { useDropzone } from 'react-dropzone'
import classNames from 'classnames'
import Skeleton from 'react-loading-skeleton'

// Style Imports
// import AppReactDropzone from '@libs/styles/AppReactDropzone'

//Components Imports
import UploadedFile from './uploaded-file'
import UploadFile from './upload-file'

//Types Imports
import type { FileUploadProps } from '@custom-types/components/file-drop'

//Styled Dropzone Component
// const Dropzone = styled(AppReactDropzone)<BoxProps>(({ theme }) => ({
//   '& .dropzone': {
//     minHeight: 'unset',
//     padding: theme.spacing(12),
//     [theme.breakpoints.down('sm')]: {
//       paddingInline: theme.spacing(5)
//     },
//     '&+.MuiList-root .MuiListItem-root .file-name': {
//       fontWeight: theme.typography.body1.fontWeight
//     }
//   }
// }))

const FileUpload = (props: FileUploadProps) => {
  const {
    file,
    setFile,
    selectedFile,
    setSelectedFile,
    maxSize = undefined,
    allowedTypes,
    fileType,
    isExpandedPadding,
    loading,
    previewThumbnail,
    showThumbnail,
    itemData
  } = props

  const isFileUploadDisabled = itemData?.isUsedInSession

  // Dropzone Hook
  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    accept: allowedTypes,
    maxSize: maxSize,

    // noClick: !!file,
    // noKeyboard: !!file,
    disabled: isFileUploadDisabled,
    noClick: isFileUploadDisabled,
    noKeyboard: isFileUploadDisabled,
    noDrag: isFileUploadDisabled,
    onDrop: acceptedFiles => {
      if (acceptedFiles.length === 0) return
      setFile(acceptedFiles[0])
    }
  })

  // useEffect(() => {
  //   if (file && inputRef.current) {
  //     inputRef.current.setAttribute('id', 'file-input')
  //   }
  // }, [file, inputRef])

  if (loading) {
    return (
      <div
        className={classNames('h-[200px] max-sm:h-[220px] rounded-[6px] bg-[#e4e2ed1f] p-2', {
          'h-[310px]': isExpandedPadding,
          'max-sm:h-[200px]': isExpandedPadding
        })}
      >
        <Skeleton
          height='100%'
          width='100%'
          borderRadius={6}
          duration={1}
          baseColor='#d1d1d1'
          highlightColor='#f5f5f5'

          // baseColor='#e4e2ed'
          // highlightColor='#f5f5f5'
        />
      </div>
    )
  }

  return (
    <div
      {...getRootProps()}
      className={classNames(
        'h-[200px] max-sm:h-[220px] bg-[#e4e2ed1f] flex items-center justify-center cursor-pointer rounded-[6px] border-2 border-dashed',
        { 'sm:p-36': isExpandedPadding }
      )}

      // className='h-[200px] max-sm:h-[220px] flex items-center justify-center cursor-pointer rounded-[6px] border-2 border-dashed p-36'
    >
      {/* <input {...getInputProps()} {...(file ? { ref: inputRef, id: 'file-input' } : {})} /> */}
      <input {...getInputProps()} />
      {file || selectedFile ? (
        <UploadedFile
          file={file}
          setFile={setFile}
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          previewThumbnail={previewThumbnail}
          showThumbnail={showThumbnail}
          itemData={itemData}
        />
      ) : (
        <UploadFile fileType={fileType} />
      )}
    </div>
  )
}

export default FileUpload
