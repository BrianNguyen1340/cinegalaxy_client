import { apiSlice } from '~/redux/apiSlice'
import { API_ROOT } from '~/utils/constants'

export const orderAPISlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (data) => ({
        url: `${API_ROOT}/api/v1/order/create`,
        method: 'POST',
        body: data,
      }),
    }),
    getOrder: builder.query({
      query: (id) => ({
        url: `${API_ROOT}/api/v1/order/${id}`,
      }),
    }),
    makeOrderAsPaid: builder.mutation({
      query: ({ id, details }) => ({
        url: `${API_ROOT}/api/v1/order/${id}/pay`,
        method: 'PUT',
        body: details,
      }),
    }),
    getPaypalClientId: builder.query({
      query: () => ({
        url: `${API_ROOT}/api/v1/config/paypal`,
      }),
    }),
    getOrders: builder.query({
      query: () => ({
        url: `${API_ROOT}/api/v1/order/get-all`,
      }),
    }),
  }),
})

export const {
  useCreateOrderMutation,
  useGetOrderQuery,
  useMakeOrderAsPaidMutation,
  useGetPaypalClientIdQuery,
  useGetOrdersQuery,
} = orderAPISlice
