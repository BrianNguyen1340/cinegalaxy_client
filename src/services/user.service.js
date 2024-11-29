import { apiSlice } from '~/redux/apiSlice'

export const userAPISlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    profile: builder.query({
      query: (data) => ({
        url: `/api/v1/user/profile`,
        method: 'GET',
        body: data,
      }),
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: `/api/v1/user/update-profile`,
        method: 'PUT',
        body: data,
      }),
    }),
    updatePassword: builder.mutation({
      query: (data) => ({
        url: `/api/v1/user/update-password`,
        method: 'PUT',
        body: data,
      }),
    }),
    getUser: builder.query({
      query: (id) => ({
        url: `/api/v1/user/get-user/${id}`,
      }),
    }),
    getUsers: builder.query({
      query: () => ({
        url: `/api/v1/user/get-users`,
      }),
    }),
    updateUser: builder.mutation({
      query: (data) => ({
        url: `/api/v1/user/update-user/${data.id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    blockAccount: builder.mutation({
      query: (id) => ({
        url: `/api/v1/user/block-user/${id}`,
        method: 'PUT',
      }),
    }),
    unblockAccount: builder.mutation({
      query: (id) => ({
        url: `/api/v1/user/unblock-user/${id}`,
        method: 'PUT',
      }),
    }),
    createUser: builder.mutation({
      query: (data) => ({
        url: `/api/v1/user/create-user`,
        method: 'POST',
        body: data,
      }),
    }),
    createEmployee: builder.mutation({
      query: (data) => ({
        url: `/api/v1/user/create-employee`,
        method: 'POST',
        body: data,
      }),
    }),
    getCashiers: builder.query({
      query: () => ({
        url: `/api/v1/user/get-cashiers`,
      }),
    }),
    totalSystemUsers: builder.query({
      query: () => ({
        url: `/api/v1/user/total-system-users`,
      }),
    }),
    totalUsers: builder.query({
      query: () => ({
        url: `/api/v1/user/total-users`,
      }),
    }),
  }),
})

export const {
  useProfileQuery,
  useUpdateProfileMutation,
  useGetUserQuery,
  useBlockAccountMutation,
  useUnblockAccountMutation,
  useCreateUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
  useUpdatePasswordMutation,
  useCreateEmployeeMutation,
  useGetCashiersQuery,
  useTotalSystemUsersQuery,
  useTotalUsersQuery,
} = userAPISlice
