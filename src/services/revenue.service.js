import { apiSlice } from '~/redux/apiSlice'

export const revenueAPISlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    calculateTotalOrderRevenue: builder.query({
      query: () => ({
        url: `/api/v1/revenue/order-revenue`,
      }),
    }),
  }),
})

export const { useCalculateTotalOrderRevenueQuery } = revenueAPISlice
