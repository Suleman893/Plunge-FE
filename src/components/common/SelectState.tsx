'use client'

//React Imports
import { useState, useEffect } from 'react'

//Services Imports
import { fetchStatesByCountry } from '@services/index'

//Components Imports
import CustomAutocomplete from '@core/components/mui/Autocomplete'
import CustomTextField from '@core/components/mui/TextField'

//Type Imports
import type { SelectStateProps } from '@custom-types/components/common'

const SelectState = (props: SelectStateProps) => {
  const { countryCode, value, onChange, error, helperText } = props

  // States
  const [countryStates, setCountryStates] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadStates = async () => {
      if (!countryCode) {
        setCountryStates([])

        return
      }

      setLoading(true)

      try {
        const data = await fetchStatesByCountry(countryCode)

        setCountryStates(data || [])
      } catch (error) {
        setCountryStates([])
      } finally {
        setLoading(false)
      }
    }

    loadStates()
  }, [countryCode])

  return (
    <CustomAutocomplete
      disableClearable={false}
      fullWidth
      id='select-state'
      options={countryStates}
      value={countryStates.find(state => state.name === value) || null}
      onChange={(_, newValue) => onChange(newValue?.name || '')}
      getOptionLabel={option => option?.name || ''}
      loading={loading}
      disabled={!countryCode}
      renderOption={(props, option) => (
        <li {...props} key={option.id}>
          <span>{option.name}</span>
        </li>
      )}
      renderInput={params => (
        <CustomTextField
          {...params}
          placeholder='Select the state'
          label='State'
          error={!!error}
          helperText={helperText}
        />
      )}
    />
  )
}

export default SelectState
