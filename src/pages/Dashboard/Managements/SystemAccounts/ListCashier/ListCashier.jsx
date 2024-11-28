import { useEffect, useState } from 'react'
import { BeatLoader } from 'react-spinners'
import ReactPaginate from 'react-paginate'

import { useGetCashiersQuery } from '~/services/user.service'
import useTitle from '~/hooks/useTitle'
import { useSelector } from 'react-redux'

const ListCashier = () => {
  useTitle('Manager | Danh sách thu ngân')
  const { user } = useSelector((state) => state.user)

  const {
    data: users,
    isLoading: isLoadingUsers,
    isSuccess: isSuccessUsers,
    refetch: refetchUsers,
  } = useGetCashiersQuery({})
  console.log(users)

  useEffect(() => {
    refetchUsers()
  }, [refetchUsers])

  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 10

  const filteredUsers = users?.data?.filter(
    (item) => item.cinemaId?._id === user?.cinemaId,
  )

  const offset = currentPage * itemsPerPage
  const currentItems = filteredUsers
    ? filteredUsers
        ?.slice()
        ?.reverse()
        ?.slice(offset, offset + itemsPerPage)
    : []

  const handlePageClick = (event) => {
    setCurrentPage(event.selected)
  }

  let content

  if (isLoadingUsers)
    content = (
      <div className='flex h-screen w-full items-center justify-center'>
        <BeatLoader />
      </div>
    )

  if (isSuccessUsers) {
    content = (
      <div className='relative h-fit w-full rounded-xl border bg-white p-4 shadow-md'>
        <div className='mb-5 rounded-xl bg-[#289ae7] py-5 text-center text-xl font-semibold capitalize text-white'>
          danh sách tài khoản
        </div>

        {users && (
          <>
            <table>
              <thead>
                <tr>
                  <th>no.</th>
                  <th>email</th>
                  <th>tên</th>
                  <th>ảnh</th>
                  <th>lần đăng nhập cuối</th>
                  <th>làm việc ở</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, index) => (
                  <tr key={index}>
                    <td>{index + offset}</td>
                    <td>{item.email}</td>
                    <td>{item.name}</td>
                    <td>
                      <div className='flex items-center justify-center'>
                        <img
                          src={item.photoURL}
                          alt='avatar'
                          className='h-[70px] w-[70px] rounded-full object-cover'
                        />
                      </div>
                    </td>
                    <td>
                      {new Date(item.lastLogin).toLocaleTimeString('vi-VN')}
                      {' - '}
                      {new Date(item.lastLogin).toLocaleDateString('vi-VN')}
                    </td>
                    <td className='capitalize'>{item.cinemaId.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <ReactPaginate
              previousLabel={'<'}
              nextLabel={'>'}
              breakLabel={'...'}
              breakClassName={'break-me'}
              pageCount={Math.ceil(users?.data?.length / itemsPerPage)}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageClick}
              containerClassName={'pagination'}
              activeClassName={'active'}
            />
          </>
        )}
      </div>
    )
  }

  return content
}

export default ListCashier
