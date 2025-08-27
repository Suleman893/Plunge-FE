import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

//Type Imports
import type { CardContentWrapperProps } from '@custom-types/components/common'

const CardContentWrapper = (props: CardContentWrapperProps) => {
  const { title, content, sx } = props

  return (
    <Card sx={sx}>
      {title && <CardHeader title={title} titleTypographyProps={{ fontSize: '16px', fontWeight: '500' }} />}
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>{content}</CardContent>
    </Card>
  )
}

export default CardContentWrapper
