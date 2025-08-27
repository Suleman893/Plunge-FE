//React Imports
import { createElement } from 'react'

//Type Import
import type { TabOption } from '@custom-types/components/tabs'

//Assets Import
import UsersManagement from '@assets/svgs/tab/UsersManagement'
import Lock from '@assets/svgs/tab/Lock'
import ActiveUsersManagement from '@assets/svgs/tab/ActiveUsersManagement'
import ActiveLock from '@assets/svgs/tab/ActiveLock'

export const tabOptions: TabOption[] = [
  {
    id: 1,
    label: 'Users & Roles Management',
    iconPosition: 'start',
    value: 'manageUsersAndRoles',
    defaultIcon: createElement(UsersManagement),
    activeIcon: createElement(ActiveUsersManagement),
    disabled: false
  },
  {
    id: 2,
    label: 'Security',
    iconPosition: 'start',
    value: 'security',
    defaultIcon: createElement(Lock),
    activeIcon: createElement(ActiveLock),
    disabled: false
  }
]

export const roleTypes = [
  {
    label: 'Admin',
    value: 1
  },
  {
    label: 'Consumer',
    value: 2
  }
]


//Used in Dropdowns in User Listing
export const userStatus = [
  {
    label: 'Pending',
    value: 'pending'
  },
  {
    label: 'Active',
    value: 'active'
  },
  {
    label: 'Suspended',
    value: 'inactive'
  }
]
