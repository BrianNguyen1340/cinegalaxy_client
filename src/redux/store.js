import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { persistStore } from 'redux-persist'

import { apiSlice } from './apiSlice'
import { rootReducer } from './reducers/root.reducer'

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      apiSlice.middleware,
    ),
  devTools: true,
})

export const persistor = persistStore(store)

setupListeners(store.dispatch)
