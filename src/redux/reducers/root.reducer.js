import { combineReducers } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import { apiSlice } from '~/redux/apiSlice'
import userReducer from './user.reducer'
import orderReducer from './order.reducer'

const userPersistConfig = {
  key: 'user',
  storage,
}

const orderPersistConfig = {
  key: 'order',
  storage,
}

const persistedUserReducer = persistReducer(userPersistConfig, userReducer)
const persistedOrderReducer = persistReducer(orderPersistConfig, orderReducer)

export const rootReducer = combineReducers({
  user: persistedUserReducer,
  order: persistedOrderReducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
})
