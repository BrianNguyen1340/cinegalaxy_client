import { useEffect } from 'react'
import { useSelector } from 'react-redux'

import { useGetOrdersQuery } from '~/services/order.service'

const WatchedMovies = () => {
  const { user } = useSelector((state) => state.user)

  const { data: orders, refetch } = useGetOrdersQuery()

  const userPaidOrders = orders?.data.filter(
    (order) => order.userId._id === user?._id && order.isPaid === true,
  )

  useEffect(() => {
    if (user) {
      refetch()
    }
  }, [refetch, user])

  useEffect(() => {
    refetch()
  }, [refetch])

  return (
    <div className='relative h-fit w-full'>
      <div className='mx-auto w-[1000px] py-10'>
        <div className='mb-6 text-center text-3xl font-semibold'>Vé đã đặt</div>
        {userPaidOrders?.length > 0 ? (
          <ul className='grid grid-cols-3 gap-3'>
            {userPaidOrders.map((order) => (
              <li key={order._id} className='rounded-xl p-2 shadow-custom'>
                <p>Movie: {order.showtimeId.movieId.name}</p>
                <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                <p>
                  Thời gian chiếu:
                  {new Date(order.showtimeId.timeStart).toLocaleTimeString()}~
                  {new Date(order.showtimeId.timeEnd).toLocaleTimeString()}
                </p>
                <p className='flex items-center gap-2'>
                  Ghế đã mua:
                  {order.seats.map((seat) => (
                    <div key={seat._id}>
                      {seat.number}
                      {seat.row}
                    </div>
                  ))}
                </p>
                <p className='flex items-center gap-2'>
                  Sản phẩm đã mua:
                  {order.products.map((product) => (
                    <div key={product._id}>{product.name}</div>
                  ))}
                </p>
                <p>
                  Tổng tiền:{' '}
                  {order.totalPrice.toLocaleString('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  })}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No orders found.</p>
        )}
      </div>
    </div>
  )
}

export default WatchedMovies
