import { apiSlice } from '~/redux/apiSlice'
import { API_ROOT } from '~/utils/constants'

export const promotionAPISlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createPromotion: builder.mutation({
      query: (data) => ({
        url: `https://cinegalaxy-server.onrender.com/api/v1/promotion/create`,
        method: 'POST',
        body: data,
      }),
    }),
    getPromotion: builder.query({
      query: (id) => ({
        url: `https://cinegalaxy-server.onrender.com/api/v1/promotion/get/${id}`,
      }),
    }),
    getPromotions: builder.query({
      query: () => ({
        url: `https://cinegalaxy-server.onrender.com/api/v1/promotion/get-all`,
      }),
    }),
    updatePromotion: builder.mutation({
      query: (data) => ({
        url: `https://cinegalaxy-server.onrender.com/api/v1/promotion/update/${data.id}`,
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
