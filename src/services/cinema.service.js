import { apiSlice } from '~/redux/apiSlice'

export const cinemaAPISlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCinema: builder.mutation({
      query: (data) => ({
        url: `/api/v1/cinema/create`,
        method: 'POST',
        body: data,
      }),
    }),
    getCinema: builder.query({
      query: (id) => ({
        url: `/api/v1/cinema/get/${id}`,
      }),
    }),
    getCinemas: builder.query({
      query: () => ({
        url: `/api/v1/cinema/get-all`,
      }),
    }),
    updateCinema: builder.mutation({
      query: (data) => ({
        url: `/api/v1/cinema/update/${data.id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    totalCinema: builder.query({
      query: () => ({
        url: `/api/v1/cinema/total`,
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
