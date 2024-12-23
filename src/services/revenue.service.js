import { apiSlice } from '~/redux/apiSlice'
import { API_ROOT } from '~/utils/constants'

export const revenueAPISlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    calculateTotalOrderRevenue: builder.query({
      query: () => ({
        url: `https://cinegalaxy-server.onrender.com/api/v1/revenue/order-revenue`,
      }),
    }),
    calculateTotalMovieTicketRevenue: builder.query({
      query: () => ({
        url: `https://cinegalaxy-server.onrender.com/api/v1/revenue/cinema-revenue`,
      }),
    }),
  }),
})

export const {
  useCalculateTotalOrderRevenueQuery,
  useCalculateTotalMovieTicketRevenueQuery,
} = revenueAPISlice
