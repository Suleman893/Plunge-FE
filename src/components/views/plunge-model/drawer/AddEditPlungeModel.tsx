// // React Imports
// import { useState, useRef } from 'react'

// // MUI Import
// import Box from '@mui/material/Box'
// import Divider from '@mui/material/Divider'

// // Component Imports
// import CustomAutocomplete from '@core/components/mui/Autocomplete'
// import CustomTextField from '@core/components/mui/TextField'
// import FileUpload from '@components/file-drop'
// import BorderButton from '@components/buttons/BorderButton'
// import CustomButton from '@core/components/mui/Button'

// // Static Data Import
// import { staticTuyaHardware } from '@data/plunge-models'

// const AddEditPlungeModel = (props: AddEditPlungeModelProps) => {
//   const { isEdit } = props
//   const [file, setFile] = useState<File | null>(null)
//   const inputRef = useRef<HTMLInputElement | null>(null)

//   const handleChangeImageClick = () => {
//     inputRef.current?.click()
//   }

//   return (
//     <form className='flex flex-col gap-6'>
//       <Box>
//         <p className='text-sm mb-1'>Select Tuya Hardware</p>
//         <div className='flex justify-between gap-2 max-sm:flex-col'>
//           <div className='w-[65%] max-sm:w-full'>
//             <CustomAutocomplete
//               disableClearable={false}
//               fullWidth
//               id='select-hardware'
//               options={staticTuyaHardware}
//               renderInput={params => <CustomTextField {...params} placeholder='Select Hardware' />}
//             />
//           </div>
//           <CustomButton variant='tonal' color='primary' text='Sync List' className='max-sm:w-full' />
//         </div>

//         <p className='my-3 text-sm text-gray-400'>You can only select one hardware at a time</p>
//         <Divider />
//       </Box>
//       <Box>
//         <div className='flex justify-between items-center mb-1'>
//           <p className='text-sm'>Product Image</p>
//           {file && (
//             <p className='text-sm text-[#3E6CFF] cursor-pointer' onClick={handleChangeImageClick}>
//               Change Image
//             </p>
//           )}
//         </div>
//         <FileUpload file={file} setFile={setFile} inputRef={inputRef} />
//       </Box>
//       <CustomTextField fullWidth label='Display Name' variant='outlined' placeholder='Ice Bath Pro - Portable' />
//       <CustomTextField fullWidth label='Model Number/ID' variant='outlined' placeholder='CB-PB-200' />

//       <div className='flex items-center gap-4'>
//         <CustomButton variant='contained' color='primary' fullWidth text={isEdit ? 'Save Changes' : 'Add Product'} />
//         <BorderButton text='Cancel' />
//       </div>
//     </form>
//   )
// }

// export default AddEditPlungeModel
