import { apiSlice } from '~/redux/apiSlice'
import { API_ROOT } from '~/utils/constants'

export const productCategoryAPISlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createProductCategory: builder.mutation({
      query: (data) => ({
        url: `https://cinegalaxy-server.onrender.com/api/v1/product-category/create`,
        method: 'POST',
        body: data,
      }),
    }),
    getProductCategory: builder.query({
      query: (id) => ({
        url: `https://cinegalaxy-server.onrender.com/api/v1/product-category/get/${id}`,
      }),
    }),
    getProductCategories: builder.query({
      query: () => ({
        url: `https://cinegalaxy-server.onrender.com/api/v1/product-category/get-all`,
      }),
    }),
    updateProductCategory: builder.mutation({
      query: (data) => ({
        url: `https://cinegalaxy-server.onrender.com/api/v1/product-category/update/${data.id}`,
        method: 'PUT',
        body: data,
      }),
    }),
  }),
})

export const {
  useCreateProductCategoryMutation,
  useGetProductCategoriesQuery,
  useGetProductCategoryQuery,
  useUpdateProductCategoryMutation,
} = productCategoryAPISlice
