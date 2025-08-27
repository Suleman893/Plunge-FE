//MUI Imports
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Typography from '@mui/material/Typography'

//Components Import
import Link from '@components/Link'

//Types import
import type { BreadcrumbSectionProps } from '@custom-types/components/breadcrumb'

const BreadcrumbSection = (props: BreadcrumbSectionProps) => {
  const { href, mainPage, subPage } = props

  return (
    <Breadcrumbs aria-label='breadcrumb'>
      <Link className='text-secondary' href={href}>
        {mainPage}
      </Link>
      <Typography className='text-primary'>{subPage}</Typography>
    </Breadcrumbs>
  )
}

export default BreadcrumbSection
