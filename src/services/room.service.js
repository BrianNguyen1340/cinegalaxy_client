import { apiSlice } from '~/redux/apiSlice'
import { API_ROOT } from '~/utils/constants'

export const roomAPISlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createRoom: builder.mutation({
      query: (data) => ({
        url: `${API_ROOT}/api/v1/room/create`,
        method: 'POST',
        body: data,
      }),
    }),
    getRoom: builder.query({
      query: (id) => ({
        url: `${API_ROOT}/api/v1/room/get/${id}`,
      }),
    }),
    getRooms: builder.query({
      query: () => ({
        url: `${API_ROOT}/api/v1/room/get-all`,
      }),
    }),
    updateRoom: builder.mutation({
      query: (data) => ({
        url: `${API_ROOT}/api/v1/room/update/${data.id}`,
        method: 'PUT',
        body: data,
      }),
    }),
  }),
})

export const {
  useCreateRoomMutation,
  useGetRoomsQuery,
  useGetRoomQuery,
  useUpdateRoomMutation,
} = roomAPISlice
