import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BeatLoader } from 'react-spinners'
import { FaTimes } from 'react-icons/fa'
import { SquarePen } from 'lucide-react'
import ReactPaginate from 'react-paginate'
import Swal from 'sweetalert2'
import nProgress from 'nprogress'

import {
  useGetUsersQuery,
  useBlockAccountMutation,
  useUnblockAccountMutation,
} from '~/services/user.service'
import useTitle from '~/hooks/useTitle'

const ListSystemAccount = () => {
  useTitle('Admin | Danh sách tài khoản hệ thống')

  const {
    data: users,
    isLoading: isLoadingUsers,
    isSuccess: isSuccessUsers,
    refetch: refetchUsers,
  } = useGetUsersQuery({})

  useEffect(() => {
    refetchUsers()
  }, [refetchUsers])

  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 10

  const [selectedRole, setSelectedRole] = useState(null)

  const filteredUsers = users
    ? users.data.filter((user) => [0, 1, 2].includes(user.role))
    : []

  const roleFilteredUsers =
    selectedRole !== null
      ? filteredUsers.filter((user) => user.role === selectedRole)
      : filteredUsers

  const offset = currentPage * itemsPerPage
  const currentItems = roleFilteredUsers.slice(offset, offset + itemsPerPage)

  const handlePageClick = (event) => {
    setCurrentPage(event.selected)
  }

  const handleRoleChange = (event) => {
    const role = event.target.value === '' ? null : parseInt(event.target.value)
    setSelectedRole(role)
    setCurrentPage(0)
  }

  const [blockAccount] = useBlockAccountMutation()
  const [unblockAccount] = useUnblockAccountMutation()

  const handleBlockAccount = async (id) => {
    try {
      nProgress.start()
      const result = await Swal.fire({
        title: 'Bạn có chắc',
        text: 'Muốn khóa tài khoản này?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'OK!',
        cancelButtonText: 'Không!',
      })

      if (result.isConfirmed) {
        await blockAccount(id)
        Swal.fire('Thành công!', 'Khóa tài khoản thành công!', 'success')
        refetchUsers()
      }
    } catch (error) {
      Swal.fire('Thất bại', error?.data?.message, 'error')
    } finally {
      nProgress.done()
    }
  }

  const handleUnblockAccount = async (id) => {
    try {
      nProgress.start()
      const result = await Swal.fire({
        title: 'Bạn có chắc',
        text: 'Muốn mở khóa tài khoản này?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'OK!',
        cancelButtonText: 'Không!',
      })

      if (result.isConfirmed) {
        await unblockAccount(id)
        Swal.fire('Thành công!', 'Mở khóa tài khoản thành công!', 'success')
        refetchUsers()
      }
    } catch (error) {
      Swal.fire('Thất bại', error?.data?.message, 'error')
    } finally {
      nProgress.done()
    }
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

        <select
          id='roleSelect'
          onChange={handleRoleChange}
          value={selectedRole ?? ''}
          className='mb-5 p-2 capitalize'
        >
          <option value=''>Tất cả</option>
          <option value='0'>Role 0</option>
          <option value='1'>Role 1</option>
          <option value='2'>Role 2</option>
        </select>

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
                  <th>trạng thái</th>
                  <th>vai trò</th>
                  <th>hành động</th>
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
                    <td className='capitalize'>
                      {item.role === 0 ? (
                        <div className='flex items-center justify-center'>
                          <FaTimes size='20' color='red' />
                        </div>
                      ) : (
                        <>{item?.cinemaId?.name}</>
                      )}
                    </td>
                    <td>
                      {item.role === 0 ? (
                        <div className='flex items-center justify-center'>
                          <FaTimes size='20' color='red' />
                        </div>
                      ) : (
                        <>
                          {item.isBlocked === false ? (
                            <div className='flex items-center justify-center'>
                              <button
                                className='cursor-pointer rounded bg-[#00b4d8] p-1 capitalize text-white shadow-custom'
                                onClick={() => handleBlockAccount(item._id)}
                              >
                                active
                              </button>
                            </div>
                          ) : (
                            <div className='flex items-center justify-center'>
                              <button
                                className='ff006e cursor-pointer rounded bg-[#ff006e] p-1 capitalize text-white shadow-custom'
                                onClick={() => handleUnblockAccount(item._id)}
                              >
                                unactive
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </td>
                    {item.role === 0 && (
                      <td className='capitalize text-[#0d6efd]'>admin</td>
                    )}
                    {item.role === 1 && (
                      <td className='capitalize text-[#fb8500]'>quản lý</td>
                    )}
                    {item.role === 2 && (
                      <td className='capitalize text-[#2a9d8f]'>thu ngân</td>
                    )}
                    {item.role === 3 && (
                      <td className='capitalize text-[#fb6f92]'>khách hàng</td>
                    )}
                    <td>
                      {item.role === 0 ? (
                        <div className='flex items-center justify-center'>
                          <FaTimes size='20' color='red' />
                        </div>
                      ) : (
                        <div className='flex items-center justify-center'>
                          <Link
                            to={`/update-system-account/${item._id}`}
                            className='rounded p-1 transition duration-300 hover:bg-[#67349D] hover:text-white hover:shadow-custom'
                          >
                            <SquarePen />
                          </Link>
                        </div>
                      )}
                    </td>
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

export default ListSystemAccount
