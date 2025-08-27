//Third Party Imports
import Skeleton from 'react-loading-skeleton'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'

//Types Imports
import type { BasicInfoProps } from '@custom-types/components/cards'

const BasicInfo = (props: BasicInfoProps) => {
  // Props
  const { bgColor, boxShadow, border, title, stats, avatarIcon, avatarColor, isLoading, height } = props

  return (
    <Card
      sx={{
        backgroundColor: bgColor || '#FFFFFF',
        boxShadow: boxShadow || undefined,
        border: border || undefined,
        height: height || undefined
      }}
    >
      <CardContent className='flex justify-between gap-1'>
        <div className='flex flex-col gap-1 flex-grow'>
          {isLoading ? <Skeleton height={34} width={50} /> : <Typography variant='h4'>{stats}</Typography>}
          <Typography color='text.secondary' className='text-sm'>
            {title}
          </Typography>
        </div>
        <CustomAvatar color={avatarColor} skin='light' variant='rounded' size={42}>
          {avatarIcon}
        </CustomAvatar>
      </CardContent>
    </Card>
  )
}

export default BasicInfo
