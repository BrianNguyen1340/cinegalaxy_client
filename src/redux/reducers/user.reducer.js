import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  token: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload
      state.user = user
      state.token = token
      state.isAuthenticated = true
      state.loading = false
      state.error = null
    },
    logout: (state) => {
      state.isAuthenticated = false
      state.user = null
      state.error = null
      state.token = null
    },
  },
})

export const selectCurrentToken = (state) => state.user.token
export const { setCredentials, logout } = userSlice.actions
export default userSlice.reducer
