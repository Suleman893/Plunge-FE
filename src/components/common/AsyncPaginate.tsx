//React Imports
import React, { useState } from 'react'

//Third Party Imports
import { AsyncPaginate } from 'react-select-async-paginate'
import { components } from 'react-select'

//MUI Imports
import Checkbox from '@mui/material/Checkbox'

const DropdownIndicator = (props: any) => {
  const { selectProps } = props

  return (
    <components.DropdownIndicator {...props}>
      {selectProps.menuIsOpen ? (
        <i className='tabler-chevron-up text-[18px]' />
      ) : (
        <i className='tabler-chevron-down text-[18px]' />
      )}
    </components.DropdownIndicator>
  )
}

const Option = (props: any) => {
  const { isMulti } = props.selectProps

  return (
    <components.Option {...props}>
      <div className='flex items-center'>
        {isMulti && (
          <Checkbox
            checked={props.isSelected}
            onChange={() => null} // Selection is handled by react-select
            sx={{
              marginRight: '8px',
              color: 'var(--mui-palette-primary-main)',
              '&.Mui-checked': {
                color: 'var(--mui-palette-primary-main)'
              },
              '&.MuiCheckbox-root': {
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
                }
              }
            }}
          />
        )}
        {props.children}
      </div>
    </components.Option>
  )
}

const CustomAsyncPaginate = ({ label, error, menuPortal = true, ...props }: any) => {
  //Menu Portals true for Modals
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div>
      {/* label props for Text Inputs where label needed not for listings */}
      {label && (
        <label
          className={`block mb-1 font-normal text-[0.8125rem] ${
            error ? 'text-red-500' : isFocused ? 'text-[var(--mui-palette-primary-main)]' : 'text-gray-700'
          }`}
        >
          {label}
        </label>
      )}
      <AsyncPaginate
        {...props}
        {...(menuPortal && { menuPortalTarget: document.body })}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        closeMenuOnSelect={props.isMulti ? false : true} // Like disableCloseOnSelect in MUI
        hideSelectedOptions={false} // Keep showing selected options
        components={{
          DropdownIndicator,
          IndicatorSeparator: null,
          Option,
          MultiValueContainer: () => null, // This completely removes the selected chips from the input
          MultiValueRemove: () => null, // This removes the remove buttons
          MultiValueLabel: () => null // This removes the label
        }}
        styles={{
          control: (baseStyles: any, state: any) => ({
            ...baseStyles,
            borderRadius: 'var(--mui-shape-borderRadius)',
            borderColor: error
              ? 'var(--mui-palette-error-main)'
              : state.isFocused
                ? 'var(--mui-palette-primary-main)'
                : 'var(--mui-palette-customColors-inputBorder)',
            borderWidth: state.isFocused ? '2px' : '1px',
            boxShadow: state.isFocused ? 'var(--mui-customShadows-primary-sm)' : baseStyles.boxShadow,
            '&:hover': {
              borderColor: error
                ? 'var(--mui-palette-error-main)'
                : state.isFocused
                  ? 'var(--mui-palette-primary-main)'
                  : 'var(--mui-palette-action-active)'
            }
          }),
          option: (baseStyles: any, state: any) => ({
            ...baseStyles,
            borderRadius: '4px',
            backgroundColor:
              state.isSelected && !props.isMulti
                ? '#3E6CFF29' // Background for single selection (16% opacity of #3E6CFF)
                : state.isSelected && props.isMulti
                  ? '#3E6CFF29' // Background for multi-selection
                  : state.isFocused
                    ? 'var(--mui-palette-action-hover)' // Background when focused
                    : 'transparent', // Default background
            color:
              state.isSelected && !props.isMulti
                ? '#3E6CFF' // Text color for single selection
                : state.isSelected && props.isMulti
                  ? '#3E6CFF' // Text color for multi-selection
                  : 'var(--mui-palette-text-primary)', // Default text color
            cursor: 'pointer',
            fontSize: '0.975rem',
            padding: '5px',
            '&:active': {
              backgroundColor: '#3E6CFF29' // Keep the same background when active/clicked
            }
          }),
          menu: (baseStyles: any) => ({
            ...baseStyles,
            zIndex: 1300,
            borderRadius: 'var(--mui-shape-borderRadius)',
            boxShadow: 'var(--mui-shadows-6)'
          }),
          menuList: (baseStyles: any) => ({
            ...baseStyles,
            padding: '5px'
          }),
          dropdownIndicator: (baseStyles: any) => ({
            ...baseStyles,
            padding: '0 8px',
            color: 'inherit',
            '&:hover': {
              color: 'inherit'
            }
          }),
          singleValue: (baseStyles: any) => ({
            ...baseStyles,
            color: 'var(--mui-palette-text-primary)'
          }),
          input: (baseStyles: any) => ({
            ...baseStyles,
            color: 'var(--mui-palette-text-primary)'
          }),
          placeholder: (baseStyles: any) => ({
            ...baseStyles,
            color: 'var(--mui-palette-text-secondary)'
          }),
          valueContainer: (baseStyles: any) => ({
            ...baseStyles
          })
        }}
      />
      {error && <p className='text-sm text-red-500 mt-1'>{error.message}</p>}
    </div>
  )
}

export default CustomAsyncPaginate
