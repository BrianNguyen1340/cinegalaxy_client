import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Line, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
)

import {
  useTotalSystemUsersQuery,
  useTotalUsersQuery,
} from '~/services/user.service'
import { useGetShowtimesQuery } from '~/services/showtime.service'
import { useTotalCinemaComplexQuery } from '~/services/cinemaComplex.service'
import { useTotalCinemaQuery } from '~/services/cinema.service'
import {
  useCalculateTotalOrderRevenueQuery,
  useCalculateTotalMovieTicketRevenueQuery,
} from '~/services/revenue.service'

const Dashboard = () => {
  const { user } = useSelector((state) => state.user)

  const { data: totalSystemUsers, refetch: refetchTotalSystemUsers } =
    useTotalSystemUsersQuery()
  const { data: showtimes, refetch: refetchShowtimes } = useGetShowtimesQuery()
  const { data: movieTicketRevenue, refetch: refetchCinemaRevenue } =
    useCalculateTotalMovieTicketRevenueQuery()
  const { data: orderRevenue, refetch: refetchOrderRevenue } =
    useCalculateTotalOrderRevenueQuery()
  const { data: totalCinamas, refetch: refetchCinemas } = useTotalCinemaQuery()
  const { data: totalUsers, refetch: refetchTotalUsers } = useTotalUsersQuery()
  const { data: totalCinemaComplex, refetch: refetchTotalCinemaComplexs } =
    useTotalCinemaComplexQuery()

  const userShowtimes = showtimes?.data.filter(
    (showtime) => showtime.cinemaId._id === user.cinemaId,
  )

  const [dateFilter, setDateFilter] = useState('daily')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const revenueData = {
    daily: {
      productA: [120, 150, 180, 130, 200, 250, 300],
      productB: [100, 130, 150, 110, 160, 200, 250],
      productC: [50, 80, 120, 90, 150, 190, 240],
    },
    monthly: {
      productA: [3000, 3500, 4000, 2500, 3200, 5000],
      productB: [2500, 3000, 3500, 2200, 2800, 4200],
      productC: [1200, 1500, 1800, 1400, 2000, 3000],
    },
    yearly: {
      productA: [35000, 40000, 45000, 30000],
      productB: [30000, 35000, 40000, 25000],
      productC: [15000, 18000, 22000, 17000],
    },
  }

  const chartData = {
    labels:
      dateFilter === 'daily'
        ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        : dateFilter === 'monthly'
          ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
          : ['2021', '2022', '2023', '2024'],
    datasets: [
      {
        label: 'Sản phẩm A',
        data: revenueData[dateFilter].productA,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
      {
        label: 'Sản phẩm B',
        data: revenueData[dateFilter].productB,
        fill: false,
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
      },
      {
        label: 'Sản phẩm C',
        data: revenueData[dateFilter].productC,
        fill: false,
        borderColor: 'rgb(53, 162, 235)',
        tension: 0.1,
      },
    ],
  }

  const regionData = {
    labels:
      dateFilter === 'daily'
        ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        : dateFilter === 'monthly'
          ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
          : ['2021', '2022', '2023', '2024'],
    datasets: [
      {
        label: 'Khu vực 1',
        data: [200, 250, 300, 350, 400, 450, 500], // dữ liệu khu vực 1
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1,
      },
      {
        label: 'Khu vực 2',
        data: [150, 200, 250, 280, 350, 400, 460], // dữ liệu khu vực 2
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgb(255, 99, 132)',
        borderWidth: 1,
      },
      {
        label: 'Khu vực 3',
        data: [100, 120, 150, 170, 200, 250, 300], // dữ liệu khu vực 3
        backgroundColor: 'rgba(53, 162, 235, 0.2)',
        borderColor: 'rgb(53, 162, 235)',
        borderWidth: 1,
      },
    ],
  }

  const handleFilterChange = (e) => {
    setDateFilter(e.target.value)
  }

  useEffect(() => {
    refetchTotalSystemUsers()
    refetchShowtimes()
    refetchTotalUsers()
    refetchTotalCinemaComplexs()
    refetchCinemas()
    refetchOrderRevenue()
    refetchCinemaRevenue()
  }, [
    refetchTotalSystemUsers,
    refetchShowtimes,
    refetchTotalUsers,
    refetchTotalCinemaComplexs,
    refetchCinemas,
    refetchOrderRevenue,
    refetchCinemaRevenue,
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
              <div className='rounded-lg bg-white p-6 shadow-custom'>
                <div className='text-xl font-semibold text-gray-800'>
                  Doanh thu bán vé tất cả các rạp
                </div>
                <div className='text-xl font-bold text-blue-600'>
                  {movieTicketRevenue?.data.toLocaleString('vi-VN', {
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
        <div className='p-8'>
          <div className='mb-6 flex items-center justify-between'>
            <h2 className='text-2xl font-semibold'>Dashboard - Doanh Thu</h2>
            <div className='flex space-x-4'>
              <select
                value={dateFilter}
                onChange={handleFilterChange}
                className='rounded border p-2'
              >
                <option value='daily'>Ngày</option>
                <option value='monthly'>Tháng</option>
                <option value='yearly'>Năm</option>
              </select>
              <input
                type='date'
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className='rounded border p-2'
              />
              <input
                type='date'
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className='rounded border p-2'
              />
            </div>
          </div>

          <div className='mb-8 rounded bg-white p-6 shadow-lg'>
            <h3 className='mb-4 text-xl font-semibold'>
              Biểu đồ Doanh Thu theo Sản Phẩm
            </h3>
            <Line data={chartData} />
          </div>

          <div className='rounded bg-white p-6 shadow-lg'>
            <h3 className='mb-4 text-xl font-semibold'>
              Biểu đồ Doanh Thu theo Khu Vực
            </h3>
            <Bar data={regionData} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
