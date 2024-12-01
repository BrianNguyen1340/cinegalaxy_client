import { apiSlice } from '~/redux/apiSlice'
import { API_ROOT } from '~/utils/constants'

export const showtimeSeatStatusAPISlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createShowtimeSeatStatus: builder.mutation({
      query: (data) => ({
        url: `https://cinegalaxy-server.onrender.com/api/v1/showtime-seat-status/create`,
        method: 'POST',
        body: data,
      }),
    }),
    getAllShowtimeSeatStatus: builder.query({
      query: () => ({
        url: `https://cinegalaxy-server.onrender.com/api/v1/showtime-seat-status/get-all`,
      }),
    }),
  }),
})

export const {
  useCreateShowtimeSeatStatusMutation,
  useGetAllShowtimeSeatStatusQuery,
} = showtimeSeatStatusAPISlice
