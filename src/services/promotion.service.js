import { apiSlice } from '~/redux/apiSlice'

export const promotionAPISlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createPromotion: builder.mutation({
      query: (data) => ({
        url: `/api/v1/promotion/create`,
        method: 'POST',
        body: data,
      }),
    }),
    getPromotion: builder.query({
      query: (id) => ({
        url: `/api/v1/promotion/get/${id}`,
      }),
    }),
    getPromotions: builder.query({
      query: () => ({
        url: `/api/v1/promotion/get-all`,
      }),
    }),
    updatePromotion: builder.mutation({
      query: (data) => ({
        url: `/api/v1/promotion/update/${data.id}`,
        method: 'PUT',
        body: data,
      }),
    }),
  }),
})

export const {
  useCreatePromotionMutation,
  useGetPromotionsQuery,
  useGetPromotionQuery,
  useUpdatePromotionMutation,
} = promotionAPISlice
