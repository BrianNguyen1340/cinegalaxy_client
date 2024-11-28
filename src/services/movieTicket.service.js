import { apiSlice } from '~/redux/apiSlice'

export const movieTicketAPISlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createMovieTicket: builder.mutation({
      query: (data) => ({
        url: `/api/v1/movie-ticket/create`,
        method: 'POST',
        body: data,
      }),
    }),
    getMovieTickets: builder.query({
      query: () => ({
        url: `/api/v1/movie-ticket/get-all`,
      }),
    }),
    getMovieTicket: builder.query({
      query: (id) => ({
        url: `/api/v1/movie-ticket/get/${id}`,
      }),
    }),
  }),
})

export const {
  useCreateMovieTicketMutation,
  useGetMovieTicketsQuery,
  useGetMovieTicketQuery,
} = movieTicketAPISlice
