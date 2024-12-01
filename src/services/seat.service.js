import { apiSlice } from '~/redux/apiSlice'
import { API_ROOT } from '~/utils/constants'

export const seatAPISlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createSeat: builder.mutation({
      query: (data) => ({
        url: `${API_ROOT}/api/v1/seat/create`,
        method: 'POST',
        body: data,
      }),
    }),
    getSeat: builder.query({
      query: (id) => ({
        url: `${API_ROOT}/api/v1/seat/get/${id}`,
      }),
    }),
    getSeats: builder.query({
      query: () => ({
        url: `${API_ROOT}/api/v1/seat/get-all`,
      }),
    }),
    updateSeat: builder.mutation({
      query: (data) => ({
        url: `${API_ROOT}/api/v1/seat/update/${data.id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    deleteSeat: builder.mutation({
      query: (id) => ({
        url: `${API_ROOT}/api/v1/seat/delete/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
})

export const {
  useCreateSeatMutation,
  useGetSeatQuery,
  useGetSeatsQuery,
  useUpdateSeatMutation,
  useDeleteSeatMutation,
} = seatAPISlice
