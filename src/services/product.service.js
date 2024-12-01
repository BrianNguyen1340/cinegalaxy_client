import { apiSlice } from '~/redux/apiSlice'
import { API_ROOT } from '~/utils/constants'

export const productAPISlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createProduct: builder.mutation({
      query: (data) => ({
        url: `https://cinegalaxy-server.onrender.com/api/v1/product/create`,
        method: 'POST',
        body: data,
      }),
    }),
    getProduct: builder.query({
      query: (id) => ({
        url: `https://cinegalaxy-server.onrender.com/api/v1/product/get/${id}`,
      }),
    }),
    getProducts: builder.query({
      query: () => ({
        url: `https://cinegalaxy-server.onrender.com/api/v1/product/get-all`,
      }),
    }),
    updateProduct: builder.mutation({
      query: (data) => ({
        url: `https://cinegalaxy-server.onrender.com/api/v1/product/update/${data.id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    uploadProduct: builder.mutation({
      query: (data) => ({
        url: `https://cinegalaxy-server.onrender.com/api/v1/upload/product`,
        method: 'POST',
        body: data,
      }),
    }),
  }),
})

export const {
  useCreateProductMutation,
  useGetProductQuery,
  useGetProductsQuery,
  useUpdateProductMutation,
  useUploadProductMutation,
} = productAPISlice
