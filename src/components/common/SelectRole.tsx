//Third Party Imports
import { useSelector } from 'react-redux'

// Component Imports
import CustomAutocomplete from '@core/components/mui/Autocomplete'
import CustomTextField from '@core/components/mui/TextField'

//Type Imports
import type { SelectRoleProps } from '@custom-types/components/common'

//Redux Imports
import type { RootState } from '@features/store'

//Utils Imports
import { snakeToPascalConverter } from '@helpers/common'

const SelectRole = (props: SelectRoleProps) => {
  const { value, onChange, error, helperText } = props

  const { allRoles } = useSelector((state: RootState) => state.role)
  const selectedRole = allRoles.find(role => role.id === value)

  return (
    <CustomAutocomplete
      disableClearable={false}
      fullWidth
      id='select-role-type'
      options={allRoles}
      value={selectedRole || null}
      onChange={(_, newValue) => onChange(newValue?.id || null)}
      getOptionLabel={option => snakeToPascalConverter(option?.name) || ''}
      renderOption={(props, option) => (
        <li {...props} key={option.id}>
          <span>{snakeToPascalConverter(option.name)}</span>
        </li>
      )}
      renderInput={params => (
        <CustomTextField
          {...params}
          placeholder='Select role'
          label='User Role'
          error={!!error}
          helperText={helperText}
        />
      )}
    />
  )
}

export default SelectRole
