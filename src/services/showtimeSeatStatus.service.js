import { apiSlice } from '~/redux/apiSlice'

export const showtimeSeatStatusAPISlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createShowtimeSeatStatus: builder.mutation({
      query: (data) => ({
        url: `/api/v1/showtime-seat-status/create`,
        method: 'POST',
        body: data,
      }),
    }),
    getAllShowtimeSeatStatus: builder.query({
      query: () => ({
        url: `/api/v1/showtime-seat-status/get-all`,
      }),
    }),
  }),
})

export const {
  useCreateShowtimeSeatStatusMutation,
  useGetAllShowtimeSeatStatusQuery,
} = showtimeSeatStatusAPISlice
