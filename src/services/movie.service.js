import { apiSlice } from '~/redux/apiSlice'
import { API_ROOT } from '~/utils/constants'

export const movieAPISlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createMovie: builder.mutation({
      query: (data) => ({
        url: `${API_ROOT}/api/v1/movie/create`,
        method: 'POST',
        body: data,
      }),
    }),
    getMovie: builder.query({
      query: (id) => ({
        url: `${API_ROOT}/api/v1/movie/get/${id}`,
      }),
    }),
    getMovies: builder.query({
      query: () => ({
        url: `${API_ROOT}/api/v1/movie/get-all`,
      }),
    }),
    updateMovie: builder.mutation({
      query: (data) => ({
        url: `${API_ROOT}/api/v1/movie/update/${data.id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    hideMovie: builder.mutation({
      query: (id) => ({
        url: `${API_ROOT}/api/v1/movie/hide/${id}`,
        method: 'PUT',
      }),
    }),
    showMovie: builder.mutation({
      query: (id) => ({
        url: `${API_ROOT}/api/v1/movie/show/${id}`,
        method: 'PUT',
      }),
    }),
    uploadPosterMovie: builder.mutation({
      query: (data) => ({
        url: `${API_ROOT}/api/v1/upload/poster`,
        method: 'POST',
        body: data,
      }),
    }),
    uploadBannerMovie: builder.mutation({
      query: (data) => ({
        url: `${API_ROOT}/api/v1/upload/banner`,
        method: 'POST',
        body: data,
      }),
    }),
  }),
})

export const {
  useCreateMovieMutation,
  useGetMoviesQuery,
  useGetMovieQuery,
  useUpdateMovieMutation,
  useHideMovieMutation,
  useShowMovieMutation,
  useUploadPosterMovieMutation,
  useUploadBannerMovieMutation,
} = movieAPISlice
