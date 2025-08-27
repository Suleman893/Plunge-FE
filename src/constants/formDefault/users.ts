//Schema Imports
import type { AddUserFormValues } from '@schemas/users'

export const addUserDefault: AddUserFormValues = {
  firstName: '',
  lastName: '',
  email: '',
  roleId: null
}

export const setProfileDefault = {
  password: '',
  confirmPassword: '',
  email: '',
  firstName: '',
  lastName: ''
}
