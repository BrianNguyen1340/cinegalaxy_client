import { apiSlice } from '~/redux/apiSlice'
import { API_ROOT } from '~/utils/constants'

export const cinemaComplexAPISlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCinemaComplex: builder.mutation({
      query: (data) => ({
        url: `${API_ROOT}/api/v1/cinema-complex/create`,
        method: 'POST',
        body: data,
      }),
    }),
    getCinemaComplex: builder.query({
      query: (id) => ({
        url: `${API_ROOT}/api/v1/cinema-complex/get/${id}`,
      }),
    }),
    getCinemaComplexes: builder.query({
      query: () => ({
        url: `${API_ROOT}/api/v1/cinema-complex/get-all`,
      }),
    }),
    updateCinemaComplex: builder.mutation({
      query: (data) => ({
        url: `${API_ROOT}/api/v1/cinema-complex/update/${data.id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    totalCinemaComplex: builder.query({
      query: () => ({
        url: `${API_ROOT}/api/v1/cinema-complex/total`,
      }),
    }),
  }),
})

export const {
  useCreateCinemaComplexMutation,
  useGetCinemaComplexQuery,
  useGetCinemaComplexesQuery,
  useUpdateCinemaComplexMutation,
  useTotalCinemaComplexQuery,
} = cinemaComplexAPISlice
