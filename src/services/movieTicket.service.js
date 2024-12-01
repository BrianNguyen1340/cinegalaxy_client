import { apiSlice } from '~/redux/apiSlice'
import { API_ROOT } from '~/utils/constants'

export const movieTicketAPISlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createMovieTicket: builder.mutation({
      query: (data) => ({
        url: `https://cinegalaxy-server.onrender.com/api/v1/movie-ticket/create`,
        method: 'POST',
        body: data,
      }),
    }),
    getMovieTickets: builder.query({
      query: () => ({
        url: `https://cinegalaxy-server.onrender.com/api/v1/movie-ticket/get-all`,
      }),
    }),
    getMovieTicket: builder.query({
      query: (id) => ({
        url: `https://cinegalaxy-server.onrender.com/api/v1/movie-ticket/get/${id}`,
      }),
    }),
  }),
})

export const {
  useCreateMovieTicketMutation,
  useGetMovieTicketsQuery,
  useGetMovieTicketQuery,
} = movieTicketAPISlice
