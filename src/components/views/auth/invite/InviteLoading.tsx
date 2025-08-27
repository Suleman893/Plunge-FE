import CircularProgress from '@mui/material/CircularProgress'

const InviteLoading = () => {
  return (
    <div className='flex justify-center items-center bs-full !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]'>
      <CircularProgress />
    </div>
  )
}

export default InviteLoading
