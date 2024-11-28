import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { logout, setCredentials } from './reducers/user.reducer'

const baseQuery = fetchBaseQuery({
  baseUrl: '',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().user.token
    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    return headers
  },
})

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)
  if (result?.error?.status === 401 || result?.error?.status === 403) {
    let refreshResult = await baseQuery(
      '/api/v1/auth/refresh-access-token',
      api,
      extraOptions,
    )

    if (refreshResult?.data) {
      const { token: newAccessToken } = refreshResult.data
      const currentUser = api.getState().user.user

      api.dispatch(
        setCredentials({
          token: newAccessToken,
          user: currentUser,
        }),
      )

      result = await baseQuery(args, api, extraOptions)
    } else {
      if (
        refreshResult?.error?.status === 403 ||
        refreshResult?.error?.status === 401
      ) {
        const errorData = refreshResult.error.data
        errorData.message = 'Your login has expired!'
      }
      api.dispatch(logout())
    }
  }
  return result
}

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
})
