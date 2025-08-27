//Third party imports
import axios from 'axios'
import type { User } from 'firebase/auth'
import { onAuthStateChanged } from 'firebase/auth'

//Redux Imports
import { logout } from '@features/auth/thunk'

import { renewAccessToken } from '@features/auth/slice'

//Configuration Imports
import { envConfig } from '@configs/envConfig'
import { auth } from './firebaseConfig'

//BASE API URL
const baseURL = envConfig.API_URL

//Axios instance for Protected API's
export const ProtectedAPI = axios.create({
  baseURL: `${baseURL}`
})

//Utility: Waits until Firebase has restored auth state from IndexedDB
const waitForFirebaseAuth = (): Promise<User | null> => {
  return new Promise(resolve => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      unsubscribe() //Unsubscribe listener
      resolve(user) //Resolve promise with user returned from onAuthStateChanged listener
    })
  })
}

//Function to set up API interceptors for protected API calls
export const setApiInterceptor = (store: any) => {
  //Request interceptor
  ProtectedAPI.interceptors.request.use(
    async req => {
      //Wait for Firebase to load user from IndexedDB if needed
      const user = auth.currentUser || (await waitForFirebaseAuth())

      if (user) {
        const accessToken = store.getState().auth.firebaseUser?.accessToken

        req.headers['Authorization'] = `Bearer ${accessToken}`
      }

      return req
    },
    err => Promise.reject(err) // If error in request, pass it along
  )

  //Response interceptor
  ProtectedAPI.interceptors.response.use(
    res => res, // Just return successful response
    async err => {
      const originalReq = err.config

      //If the response status is 401 (Unauthorized) and the request hasn't already been retried
      if (err.response?.status === 401 && !originalReq._retry) {
        originalReq._retry = true

        try {
          // Wait for user restoration if needed
          const user = auth.currentUser || (await waitForFirebaseAuth())

          if (!user) throw new Error('No user')

          // Get a fresh token
          const newAccessToken = await user.getIdToken(true)

          // Attach new token to the original request
          err.config.headers['Authorization'] = `Bearer ${newAccessToken}`

          // Update Redux state with the new token
          store.dispatch(renewAccessToken({ newAccessToken }))

          // Retry the original request
          return ProtectedAPI(err.config)
        } catch (err) {
          store.dispatch(logout())

          // If we still fail, reject and let the UI or Redux thunk handle it
          return Promise.reject(err)
        }
      }

      // If not a 401, or already retried, reject and propagate to original catch
      return Promise.reject(err)
    }
  )
}
