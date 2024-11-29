import { useEffect } from 'react'
import { useSelector } from 'react-redux'

import {
  useTotalSystemUsersQuery,
  useTotalUsersQuery,
} from '~/services/user.service'
import { useGetShowtimesQuery } from '~/services/showtime.service'
import { useTotalCinemaComplexQuery } from '~/services/cinemaComplex.service'
import { useTotalCinemaQuery } from '~/services/cinema.service'
import { useCalculateTotalOrderRevenueQuery } from '~/services/revenue.service'

const Dashboard = () => {
  const { user } = useSelector((state) => state.user)

  const { data: totalSystemUsers, refetch: refetchTotalSystemUsers } =
    useTotalSystemUsersQuery()
  const { data: showtimes, refetch: refetchShowtimes } = useGetShowtimesQuery()
  const { data: orderRevenue, refetch: refetchOrderRevenue } =
    useCalculateTotalOrderRevenueQuery()
  const { data: totalCinamas, refetch: refetchCinemas } = useTotalCinemaQuery()
  const { data: totalUsers, refetch: refetchTotalUsers } = useTotalUsersQuery()
  const { data: totalCinemaComplex, refetch: refetchTotalCinemaComplexs } =
    useTotalCinemaComplexQuery()

  const userShowtimes = showtimes?.data.filter(
    (showtime) => showtime.cinemaId._id === user.cinemaId,
  )

  useEffect(() => {
    refetchTotalSystemUsers()
    refetchShowtimes()
    refetchTotalUsers()
    refetchTotalCinemaComplexs()
    refetchCinemas()
    refetchOrderRevenue()
  }, [
    refetchTotalSystemUsers,
    refetchShowtimes,
    refetchTotalUsers,
    refetchTotalCinemaComplexs,
    refetchCinemas,
    refetchOrderRevenue,
  ])

  return (
    <div className='flex'>
      <div className='flex-1 p-8'>
        <div className='mb-8 flex items-center justify-between'>
          <div className='text-3xl font-semibold text-gray-700'>
            Dashboard Overview
          </div>
        </div>
        <div className='mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {user.role === 0 && (
            <>
              <div className='rounded-lg bg-white p-6 shadow-custom'>
                <div className='text-xl font-semibold text-gray-800'>
                  Tổng số người dùng hệ thống
                </div>
                <div className='text-xl font-bold text-blue-600'>
                  {totalSystemUsers?.data}
                </div>
              </div>
              <div className='rounded-lg bg-white p-6 shadow-custom'>
                <div className='text-xl font-semibold text-gray-800'>
                  Tổng số người dùng thường
                </div>
                <div className='text-xl font-bold text-blue-600'>
                  {totalUsers?.data}
                </div>
              </div>
              <div className='rounded-lg bg-white p-6 shadow-custom'>
                <div className='text-xl font-semibold text-gray-800'>
                  Tổng số cụm rạp
                </div>
                <div className='text-xl font-bold text-blue-600'>
                  {totalCinemaComplex?.data}
                </div>
              </div>
              <div className='rounded-lg bg-white p-6 shadow-custom'>
                <div className='text-xl font-semibold text-gray-800'>
                  Tổng số rạp
                </div>
                <div className='text-xl font-bold text-blue-600'>
                  {totalCinamas?.data}
                </div>
              </div>
              <div className='rounded-lg bg-white p-6 shadow-custom'>
                <div className='text-xl font-semibold text-gray-800'>
                  Doanh thu khách hàng
                </div>
                <div className='text-xl font-bold text-blue-600'>
                  {orderRevenue?.data.toLocaleString('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  })}
                </div>
              </div>
            </>
          )}
          {user.role === 1 && (
            <div className='rounded-lg bg-white p-6 shadow-custom'>
              <div className='text-2xl font-semibold text-gray-800'>
                Total showtimes
              </div>
              <div className='text-xl font-bold text-green-600'>
                {userShowtimes?.length || 0}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
