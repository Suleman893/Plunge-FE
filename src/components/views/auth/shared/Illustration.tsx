import { styled } from '@mui/material/styles'

const Illustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  blockSize: 'auto',

  // maxBlockSize: 680,
  maxInlineSize: '100%',
  margin: theme.spacing(12),
  [theme.breakpoints.down(1536)]: {
    maxBlockSize: 580
  },
  [theme.breakpoints.down('lg')]: {
    maxBlockSize: 370
  }
}))

export default Illustration
