//React Imports
import React from 'react'

//MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'

const UploadProgress = (props: any) => {
  const { type, progress } = props

  switch (type) {
    case 'video':
    case 'music':
      return (
        <Box mt={2}>
          <CircularProgress variant='determinate' value={progress} sx={{ height: 10, borderRadius: 5 }} />
          <Box display='flex' justifyContent='space-between' mt={1}>
            <Typography variant='body2'></Typography>
            <Typography variant='body2'>{progress}%</Typography>
          </Box>
        </Box>
      )

    case 'plungeModel':
      return (
        <Box mt={2}>
          {Object.entries(progress).map(([key, value]) => (
            <Box key={key} mb={3}>
              <Typography variant='subtitle2' gutterBottom>
                {key === 'setupVideo' ? 'Setup Video' : 'Pairing Video'}
              </Typography>
              <CircularProgress variant='determinate' value={Number(value)} sx={{ height: 10, borderRadius: 5 }} />
              <Box display='flex' justifyContent='space-between' mt={1}>
                <Typography variant='body2'></Typography>
                <Typography variant='body2'>{Number(value)}%</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      )

    default:
      return null
  }
}

export default UploadProgress
