import { apiSlice } from '~/redux/apiSlice'
import { API_ROOT } from '~/utils/constants'

export const movieTicketAPISlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createMovieTicket: builder.mutation({
      query: (data) => ({
        url: `${API_ROOT}/api/v1/movie-ticket/create`,
        method: 'POST',
        body: data,
      }),
    }),
    getMovieTickets: builder.query({
      query: () => ({
        url: `${API_ROOT}/api/v1/movie-ticket/get-all`,
      }),
    }),
    getMovieTicket: builder.query({
      query: (id) => ({
        url: `${API_ROOT}/api/v1/movie-ticket/get/${id}`,
      }),
    }),
  }),
})

export const {
  useCreateMovieTicketMutation,
  useGetMovieTicketsQuery,
  useGetMovieTicketQuery,
} = movieTicketAPISlice
