//MUI Imports
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'

//Third Party Imports
import { Controller } from 'react-hook-form'

//Component Imports
import CustomTextField from '@core/components/mui/TextField'
import BorderButton from '@components/buttons/BorderButton'
import CustomButton from '@core/components/mui/Button'

const ResetPass = (props: any) => {
  const { passwordMethod, loading, control, handleSubmit, onSubmit, handlePasswordMethodChange, onBtnClick, errors } =
    props

  return (
    <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
      <div className='flex flex-col gap-4'>
        <div className='flex flex-col gap-4'>
          <div className='flex justify-between'>
            <RadioGroup row name='password-method-radio' value={passwordMethod} onChange={handlePasswordMethodChange}>
              <FormControlLabel
                value='default'
                control={<Radio />}
                label={<span className='text-sm font-medium'>Set Default Password</span>}
              />
              <FormControlLabel
                value='custom'
                control={<Radio />}
                label={<span className='text-sm font-medium'>Create Custom Password</span>}
              />
            </RadioGroup>
          </div>
          <div>
            <Controller
              name='password'
              control={control}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='Password'
                  placeholder='PrimalPlunge123#'
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  disabled={passwordMethod === 'default'}
                />
              )}
            />
          </div>
        </div>
        <Controller
          name='inform'
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={<Checkbox {...field} checked={field.value} />}
              label={<span className='text-sm'>Inform the user via email after resetting</span>}
            />
          )}
        />
        <div className='flex justify-center gap-5'>
          <BorderButton handleClick={onBtnClick} text='Cancel' />
          <CustomButton type='submit' variant='contained' text='Reset Password' loading={loading} />
        </div>
      </div>
    </form>
  )
}

export default ResetPass
