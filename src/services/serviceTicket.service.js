import { apiSlice } from '~/redux/apiSlice'

export const serviceTicketAPISlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createServiceTicket: builder.mutation({
      query: (data) => ({
        url: `/api/v1/service-ticket/create`,
        method: 'POST',
        body: data,
      }),
    }),
    getServiceTickets: builder.query({
      query: () => ({
        url: `/api/v1/service-ticket`,
      }),
    }),
    getServiceTicket: builder.query({
      query: (id) => ({
        url: `/api/v1/service-ticket/${id}`,
      }),
    }),
  }),
})

export const {
  useCreateServiceTicketMutation,
  useGetServiceTicketsQuery,
  useGetServiceTicketQuery,
} = serviceTicketAPISlice
