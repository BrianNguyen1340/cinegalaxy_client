import { apiSlice } from '~/redux/apiSlice'
import { API_ROOT } from '~/utils/constants'

export const genreAPISlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createGenre: builder.mutation({
      query: (data) => ({
        url: `https://cinegalaxy-server.onrender.com/api/v1/genre/create`,
        method: 'POST',
        body: data,
      }),
    }),
    getGenre: builder.query({
      query: (id) => ({
        url: `https://cinegalaxy-server.onrender.com/api/v1/genre/get/${id}`,
      }),
    }),
    getGenres: builder.query({
      query: () => ({
        url: `https://cinegalaxy-server.onrender.com/api/v1/genre/get-all`,
      }),
    }),
    updateGenre: builder.mutation({
      query: (data) => ({
        url: `https://cinegalaxy-server.onrender.com/api/v1/genre/update/${data.id}`,
        method: 'PUT',
        body: data,
      }),
    }),
  }),
})

export const {
  useCreateGenreMutation,
  useGetGenresQuery,
  useGetGenreQuery,
  useUpdateGenreMutation,
} = genreAPISlice
