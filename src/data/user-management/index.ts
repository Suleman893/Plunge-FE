//React Imports
import { createElement } from 'react'

//Type Imports
import type { TabOption } from '@custom-types/components/tabs'

//Assets Imports
import Plunge from '@assets/svgs/tab/Plunge'
import Lock from '@assets/svgs/tab/Lock'
import ActivePlunge from '@assets/svgs/tab/ActivePlunge'
import ActiveLock from '@assets/svgs/tab/ActiveLock'

export const tabOptions: TabOption[] = [
  {
    id: 1,
    label: 'Associated Plunges',
    iconPosition: 'start',
    value: 'associatedPlunges',
    defaultIcon: createElement(Plunge),
    activeIcon: createElement(ActivePlunge),
    disabled: false
  },
  {
    id: 2,
    label: 'User Logged Sessions',
    iconPosition: 'start',
    value: 'userLoggedSession',
    defaultIcon: createElement(Lock),
    activeIcon: createElement(ActiveLock),
    disabled: false
  }
]
