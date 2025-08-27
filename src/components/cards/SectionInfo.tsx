// MUI Imports
import Typography from '@mui/material/Typography'

//Types Imports
import type { SectionInfoProps } from '@custom-types/components/cards'

const SectionInfo = (props: SectionInfoProps) => {
  const { title, description } = props

  return (
    <div className='flex flex-col gap-1'>
      <Typography className='text-2xl text-black font-semibold'>{title}</Typography>
      {description && <Typography className='text-sm'>{description}</Typography>}
    </div>
  )
}

export default SectionInfo
