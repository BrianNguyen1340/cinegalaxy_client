import { apiSlice } from '~/redux/apiSlice'
import { API_ROOT } from '~/utils/constants'

export const showtimeAPISlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createShowtime: builder.mutation({
      query: (data) => ({
        url: `${API_ROOT}/api/v1/showtime/create`,
        method: 'POST',
        body: data,
      }),
    }),
    getShowtime: builder.query({
      query: (id) => ({
        url: `${API_ROOT}/api/v1/showtime/get/${id}`,
      }),
    }),
    getShowtimes: builder.query({
      query: () => ({
        url: `${API_ROOT}/api/v1/showtime/get-all`,
      }),
    }),
    updateShowtime: builder.mutation({
      query: (data) => ({
        url: `${API_ROOT}/api/v1/showtime/update/${data.id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    hideShowtime: builder.mutation({
      query: (id) => ({
        url: `${API_ROOT}/api/v1/showtime/hide/${id}`,
        method: 'PUT',
      }),
    }),
    showShowtime: builder.mutation({
      query: (id) => ({
        url: `${API_ROOT}/api/v1/showtime/show/${id}`,
        method: 'PUT',
      }),
    }),
    totalShowtimes: builder.query({
      query: () => ({
        url: `${API_ROOT}/api/v1/showtime/total`,
      }),
    }),
  }),
})

export const {
  useCreateShowtimeMutation,
  useGetShowtimeQuery,
  useGetShowtimesQuery,
  useUpdateShowtimeMutation,
  useHideShowtimeMutation,
  useShowShowtimeMutation,
  useTotalShowtimesQuery,
} = showtimeAPISlice
