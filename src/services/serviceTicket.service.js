import { apiSlice } from '~/redux/apiSlice'
import { API_ROOT } from '~/utils/constants'

export const serviceTicketAPISlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createServiceTicket: builder.mutation({
      query: (data) => ({
        url: `https://cinegalaxy-server.onrender.com/api/v1/service-ticket/create`,
        method: 'POST',
        body: data,
      }),
    }),
    getServiceTickets: builder.query({
      query: () => ({
        url: `https://cinegalaxy-server.onrender.com/api/v1/service-ticket`,
      }),
    }),
    getServiceTicket: builder.query({
      query: (id) => ({
        url: `https://cinegalaxy-server.onrender.com/api/v1/service-ticket/${id}`,
      }),
    }),
  }),
})

export const {
  useCreateServiceTicketMutation,
  useGetServiceTicketsQuery,
  useGetServiceTicketQuery,
} = serviceTicketAPISlice
