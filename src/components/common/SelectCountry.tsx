// Component Imports
import CustomAutocomplete from '@core/components/mui/Autocomplete'
import CustomTextField from '@core/components/mui/TextField'

//Data Imports
import countries from '@data/common/countries'

//Type Import
import type { SelectCountryProps } from '@custom-types/components/common'

const SelectCountry = (props: SelectCountryProps) => {
  const { value, onChange, error, helperText } = props

  return (
    <CustomAutocomplete
      disableClearable={false}
      fullWidth
      id='select-country'
      options={countries}
      value={value}
      onChange={(_, newValue) => onChange(newValue)}
      getOptionLabel={option => option?.name || ''}
      renderOption={(props, option) => (
        <li {...props} key={option.code}>
          <span>{option.name}</span>
        </li>
      )}
      renderInput={params => (
        <CustomTextField
          {...params}
          placeholder='Select the country'
          label='Country'
          error={!!error}
          helperText={helperText}
        />
      )}
    />
  )
}

export default SelectCountry
