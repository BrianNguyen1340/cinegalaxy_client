import { useEffect } from 'react'
import { useSelector } from 'react-redux'

import { useTotalUserQuery } from '~/services/user.service'

const Dashboard = () => {
  const { user } = useSelector((state) => state.user)

  const { data: totalUsers, refetch: refetchTotalUsers } = useTotalUserQuery()

  useEffect(() => {
    refetchTotalUsers()
  }, [refetchTotalUsers])

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
            <div className='rounded-lg bg-white p-6 shadow-lg'>
              <div className='text-2xl font-semibold text-gray-800'>
                Total Users
              </div>
              <div className='text-4xl font-bold text-blue-600'>
                {totalUsers?.data}
              </div>
            </div>
          )}
          {user.role === 1 && (
            <div className='rounded-lg bg-white p-6 shadow-lg'>
              <div className='text-2xl font-semibold text-gray-800'>
                Total showtimes
              </div>
              <div className='text-4xl font-bold text-green-600'></div>
            </div>
          )}
          <div className='rounded-lg bg-white p-6 shadow-lg'>
            <div className='text-2xl font-semibold text-gray-800'>Revenue</div>
            <div className='text-4xl font-bold text-yellow-600'>$12,500</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
