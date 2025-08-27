//Third Party Imports
import { configureStore, combineReducers } from '@reduxjs/toolkit'

import { persistReducer, persistStore } from 'redux-persist'

import storage from 'redux-persist/lib/storage'

//Slices Import
//Auth + Users
import authReducer from './auth/slice'
import userReducer from './user/slice'
import usersReducer from './users/slice'
import moduleReducer from './module/slice'
import roleReducer from './role/slice'
import appUserManagementReducer from './app-user/slice'

//Plunge Models
import plungeModelReducer from './plunge-model/slice'
import plungeModelProgressReducer from './plunge-model/progress/slice'
import tuyaProductReducer from './tuya-product/slice'

//Music
import musicManagementReducer from './music-management/slice'
import musicProgressReducer from './music-management/progress/slice'

//Video
import videoManagementReducer from './video-management/slice'
import videoProgressReducer from './video-management/progress/slice'

//Others
import dashboardReducer from './dashboard/slice'
import pushNotificationReducer from './push-notification/slice'

//Persist Configs (slice-level only)
// Persist only specific values from slices to local storage (not the entire slice)
// This ensures that only necessary data (e.g., firebaseUser, plungeModelInfo) is saved
const plungeModelPersistConfig = {
  key: 'plungeModel',
  storage,
  whitelist: ['plungeModelInfo']
}

const appUserManagementPersistConfig = {
  key: 'appUserManagement',
  storage,
  whitelist: ['appUserUID', 'appUserId']
}

const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['firebaseUser']
}

const videoProgressPersistConfig = {
  key: 'videoProgress',
  storage,
  whitelist: ['uploadProgressList']
}

const musicProgressPersistConfig = {
  key: 'musicProgress',
  storage,
  whitelist: ['uploadProgressList']
}

const plungeModelProgressPersistConfig = {
  key: 'plungeModelProgress',
  storage,
  whitelist: ['uploadProgressList']
}

// Apply persist only to specific slices
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer)
const persistedPlungeModelReducer = persistReducer(plungeModelPersistConfig, plungeModelReducer)
const persistedAppUserManagementReducer = persistReducer(appUserManagementPersistConfig, appUserManagementReducer)
const persistedVideoProgressReducer = persistReducer(videoProgressPersistConfig, videoProgressReducer)
const persistedMusicProgressReducer = persistReducer(musicProgressPersistConfig, musicProgressReducer)
const persistedPlungeModelProgressReducer = persistReducer(plungeModelProgressPersistConfig, plungeModelProgressReducer)

const rootReducer = combineReducers({
  //Auth + Users
  auth: persistedAuthReducer,
  user: userReducer,
  users: usersReducer,
  module: moduleReducer,
  role: roleReducer,
  appUserManagement: persistedAppUserManagementReducer,

  //Plunge Models
  plungeModel: persistedPlungeModelReducer,
  plungeModelProgress: persistedPlungeModelProgressReducer,
  tuyaProduct: tuyaProductReducer,

  //Music
  musicManagement: musicManagementReducer,
  musicProgress: persistedMusicProgressReducer,

  //Video
  videoManagement: videoManagementReducer,
  videoProgress: persistedVideoProgressReducer,

  //Others
  dashboard: dashboardReducer,
  pushNotification: pushNotificationReducer
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
