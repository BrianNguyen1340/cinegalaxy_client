const Dashboard = () => {
  return (
    <div className='flex'>
      <div className='flex-1 p-8'>
        <div className='mb-8 flex items-center justify-between'>
          <div className='text-3xl font-semibold text-gray-700'>
            Dashboard Overview
          </div>
          <div className='flex space-x-4'>
            <button className='rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700'>
              Add User
            </button>
            <button className='rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700'>
              New Post
            </button>
          </div>
        </div>

        <div className='mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          <div className='rounded-lg bg-white p-6 shadow-lg'>
            <div className='text-2xl font-semibold text-gray-800'>
              Total Users
            </div>
            <div className='text-4xl font-bold text-blue-600'>1,250</div>
          </div>
          <div className='rounded-lg bg-white p-6 shadow-lg'>
            <div className='text-2xl font-semibold text-gray-800'>Posts</div>
            <div className='text-4xl font-bold text-green-600'>890</div>
          </div>
          <div className='rounded-lg bg-white p-6 shadow-lg'>
            <div className='text-2xl font-semibold text-gray-800'>Revenue</div>
            <div className='text-4xl font-bold text-yellow-600'>$12,500</div>
          </div>
        </div>

        <div className='rounded-lg bg-white p-6 shadow-lg'>
          <div className='mb-4 text-2xl font-semibold text-gray-800'>
            Recent Activity
          </div>
          <ul>
            <li className='mb-3 flex justify-between'>
              <span className='text-gray-700'>
                User John Doe created a post
              </span>
              <span className='text-sm text-gray-500'>2 mins ago</span>
            </li>
            <li className='mb-3 flex justify-between'>
              <span className='text-gray-700'>
                User Jane Smith commented on a post
              </span>
              <span className='text-sm text-gray-500'>15 mins ago</span>
            </li>
            <li className='mb-3 flex justify-between'>
              <span className='text-gray-700'>Admin updated site settings</span>
              <span className='text-sm text-gray-500'>30 mins ago</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
