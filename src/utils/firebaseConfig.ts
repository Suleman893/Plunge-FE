//Third Party Imports
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'

//Configuration Imports
import { envConfig } from '@configs/envConfig'

const firebaseConfig = {
  apiKey: envConfig.FIREBASE_API_KEY,
  authDomain: envConfig.FIREBASE_AUTH_DOMAIN,
  projectId: envConfig.FIREBASE_PROJECT_ID,
  storageBucket: envConfig.FIREBASE_STORAGE_BUCKET,
  appId: envConfig.FIREBASE_APP_ID
}

//Firebase App Initialization
const app = initializeApp(firebaseConfig)

//Firebase Auth
export const auth = getAuth(app)

//Firebase Storage
export const storage = getStorage(app)
