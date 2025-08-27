'use client'

//React Imports
import { useEffect } from 'react'

// MUI Import
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid2'

//Third Party Imports
import { Controller } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'

//Component Imports
import CustomAutocomplete from '@core/components/mui/Autocomplete'
import CustomTextField from '@core/components/mui/TextField'
import CustomButton from '@core/components/mui/Button'

//Types Imports
import type { AddEditPlungeModelProps } from '@custom-types/pages/plunge-models'

//Redux Imports
import { fetchAllProducts, syncProduct } from '@features/tuya-product/thunk'
import type { RootState } from '@features/store'

//Utils Imports
import { snakeToPascalConverter } from '@helpers/common'

const ModelInfoForm = (props: AddEditPlungeModelProps) => {
  const { control, errors } = props

  const dispatch = useDispatch()

  const { allProducts, isSyncProductLoading } = useSelector((state: RootState) => state.tuyaProduct)

  useEffect(() => {
    dispatch(
      fetchAllProducts({
        page: 1,
        elements: 25,
        sortBy: 'ASC'
      }) as any
    )
  }, [])

  return (
    <div className='flex flex-col gap-6'>
      <Box>
        <div className='flex justify-between items-center gap-4 max-sm:flex-col'>
          <Controller
            name='tuyaId'
            control={control}
            render={({ field }) => {
              const selectedProduct = allProducts?.items?.find((product: any) => product.id === field.value) || null

              return (
                <CustomAutocomplete
                  disableClearable={false}
                  fullWidth
                  id='select-tuya-hardware'
                  options={allProducts?.items || []}
                  value={selectedProduct}
                  onChange={(_, newValue) => {
                    field.onChange(newValue?.id || null)
                  }}
                  getOptionLabel={option => snakeToPascalConverter(option?.productName) || ''}
                  renderOption={(props, option) => (
                    <li {...props} key={option.id}>
                      <span>{snakeToPascalConverter(option.productName)}</span>
                    </li>
                  )}
                  renderInput={params => (
                    <CustomTextField
                      {...params}
                      placeholder='Select Hardware'
                      label='Select Tuya Hardware'
                      error={!!errors.tuyaId}
                      helperText={errors.tuyaId?.message || ' '}
                    />
                  )}
                />
              )
            }}
          />
          <CustomButton
            loading={isSyncProductLoading}
            variant='tonal'
            color='primary'
            text='Sync List'
            className='max-sm:w-full md:w-[18%] sm:w-[25%]'
            onClick={() => dispatch(syncProduct() as any)}
          />
        </div>
        <p className='mt-3 mb-[0.80rem] text-sm text-textDisabled'>You can only select one hardware at a time</p>
        <Divider className='mt-2 mb-1' />
      </Box>
      <Grid container spacing={5}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name='name'
            control={control}
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                label='Display Name'
                placeholder='Enter the Display Name'
                onChange={e => {
                  field.onChange(e.target.value)
                }}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name='modelId'
            control={control}
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                label='Model Number/ID'
                placeholder='Enter the Model Number/Id'
                onChange={e => {
                  field.onChange(e.target.value)
                }}
                error={!!errors.modelId}
                helperText={errors.modelId?.message}
              />
            )}
          />
        </Grid>
      </Grid>
    </div>
  )
}

export default ModelInfoForm
