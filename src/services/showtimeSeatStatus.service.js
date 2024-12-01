import { apiSlice } from '~/redux/apiSlice'
import { API_ROOT } from '~/utils/constants'

export const showtimeSeatStatusAPISlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createShowtimeSeatStatus: builder.mutation({
      query: (data) => ({
        url: `${API_ROOT}/api/v1/showtime-seat-status/create`,
        method: 'POST',
        body: data,
      }),
    }),
    getAllShowtimeSeatStatus: builder.query({
      query: () => ({
        url: `${API_ROOT}/api/v1/showtime-seat-status/get-all`,
      }),
    }),
  }),
})

export const {
  useCreateShowtimeSeatStatusMutation,
  useGetAllShowtimeSeatStatusQuery,
} = showtimeSeatStatusAPISlice
