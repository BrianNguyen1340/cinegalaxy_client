import { apiSlice } from '~/redux/apiSlice'
import { API_ROOT } from '~/utils/constants'

export const serviceTicketAPISlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createServiceTicket: builder.mutation({
      query: (data) => ({
        url: `${API_ROOT}/api/v1/service-ticket/create`,
        method: 'POST',
        body: data,
      }),
    }),
    getServiceTickets: builder.query({
      query: () => ({
        url: `${API_ROOT}/api/v1/service-ticket`,
      }),
    }),
    getServiceTicket: builder.query({
      query: (id) => ({
        url: `${API_ROOT}/api/v1/service-ticket/${id}`,
      }),
    }),
  }),
})

export const {
  useCreateServiceTicketMutation,
  useGetServiceTicketsQuery,
  useGetServiceTicketQuery,
} = serviceTicketAPISlice
