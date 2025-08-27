'use client'

//Third-party Imports
import type { ReactNode } from 'react'

import { Provider } from 'react-redux'

import { PersistGate } from 'redux-persist/integration/react'

//Redux Imports
import { store, persistor } from '@features/store'

//Utils Imports
import { setApiInterceptor } from '@utils/apiInterceptor'

const ReduxProvider = ({ children }: { children: ReactNode }) => {
  setApiInterceptor(store)

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>{children}</PersistGate>
    </Provider>
  )
}

export default ReduxProvider
