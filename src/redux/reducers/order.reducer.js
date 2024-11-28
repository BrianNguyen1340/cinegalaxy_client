import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  showtimeId: null,
  seats: null,
  products: null,
  seatsPrice: 0,
  productsPrice: 0,
  totalPrice: 0,
}

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrderDetails: (state, action) => {
      return { ...state, ...action.payload }
    },
    clearOrder: () => {
      return initialState
    },
  },
})

export const { setOrderDetails, clearOrder } = orderSlice.actions
export default orderSlice.reducer
