//MUI Imports
import Typography from '@mui/material/Typography'

//Components Imports
import CustomButton from '@core/components/mui/Button'
import BreadcrumbSection from '@components/breadcrumb'
import BorderButton from '@components/buttons/BorderButton'

//Types Imports
import type { AddEditPlungeSectionProps } from '@custom-types/pages/plunge-models'

const AddEditPlungeSectionInfo = (props: AddEditPlungeSectionProps) => {
  const { mode, loading, reset, disabled } = props

  return (
    <div className='flex justify-between items-center max-sm:flex-col max-sm:gap-2 max-sm:items-start'>
      <div className='flex flex-col gap-1'>
        <Typography className='text-xl text-black font-semibold'>{mode === 'add' ? 'Add New Plunge Model' : 'Edit Plunge Model'}</Typography>
        <BreadcrumbSection
          href='/plunge-models'
          mainPage='Plunge Models'
          subPage={mode === 'add' ? 'Add New Model' : 'Edit Model'}
        />
      </div>
      <div className='flex gap-3'>
        <BorderButton text='Discard' handleClick={reset} loading={loading} disabled={disabled} />
        <CustomButton
          text={mode === 'add' ? 'Add Model' : 'Save Changes'}
          type='submit'
          loading={loading}
          disabled={disabled}
        />
      </div>
    </div>
  )
}

export default AddEditPlungeSectionInfo
