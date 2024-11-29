import { apiSlice } from '~/redux/apiSlice'

export const revenueAPISlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getShowtimeRevenue: builder.query({
      query: (id) => ({
        
      })
    }),
  }),
})

export const { useGetShowtimeRevenueQuery } = revenueAPISlice
