import { apiSlice } from '~/redux/apiSlice'
import { API_ROOT } from '~/utils/constants'

export const cinemaAPISlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCinema: builder.mutation({
      query: (data) => ({
        url: `${API_ROOT}/api/v1/cinema/create`,
        method: 'POST',
        body: data,
      }),
    }),
    getCinema: builder.query({
      query: (id) => ({
        url: `${API_ROOT}/api/v1/cinema/get/${id}`,
      }),
    }),
    getCinemas: builder.query({
      query: () => ({
        url: `${API_ROOT}/api/v1/cinema/get-all`,
      }),
    }),
    updateCinema: builder.mutation({
      query: (data) => ({
        url: `${API_ROOT}/api/v1/cinema/update/${data.id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    totalCinema: builder.query({
      query: () => ({
        url: `${API_ROOT}/api/v1/cinema/total`,
      }),
    }),
  }),
})

export const {
  useCreateCinemaMutation,
  useGetCinemasQuery,
  useGetCinemaQuery,
  useUpdateCinemaMutation,
  useTotalCinemaQuery,
} = cinemaAPISlice
