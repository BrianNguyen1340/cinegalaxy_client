import { useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate'
import { useSelector } from 'react-redux'
import { useGetOrdersQuery } from '~/services/order.service'

const ListOrder = () => {
  const { user } = useSelector((state) => state.user)

  const { data: orders, refetch } = useGetOrdersQuery({})

  useEffect(() => {
    refetch()
  }, [refetch])

  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 10

  const filterOrders = orders?.data?.filter((item) => {
    return item.showtimeId.cinemaId._id === user.cinemaId
  })

  const offset = currentPage * itemsPerPage
  const currentItems = filterOrders?.slice(offset, offset + itemsPerPage)

  const handlePageClick = (event) => {
    setCurrentPage(event.selected)
  }

  return (
    <div className='relative h-fit w-full rounded-xl border bg-white p-4 shadow-md'>
      <div className='mb-5 rounded-xl bg-[#289ae7] py-5 text-center text-xl font-semibold capitalize text-white'>
        danh sách order
      </div>

      {orders ? (
        <>
          <table>
            <thead>
              <tr>
                <th className='w-[100px]'>no.</th>
                <th className='w-[100px]'>tài khoản</th>
                <th className='w-[100px]'>trạng thái</th>
                <th className='w-[100px]'>ngày đặt vé</th>
                <th className='w-[100px]'>rạp</th>
                <th className='w-[100px]'>phương thức thanh toán</th>
                <th className='w-[100px]'>tổng tiền đơn hàng</th>
              </tr>
            </thead>
            <tbody>
              {currentItems?.map((item, index) => (
                <tr key={index}>
                  <td>{index + offset}</td>
                  <td>{item.userId.email}</td>
                  <td>
                    {item.isPaid === true ? (
                      <>đã thanh toán</>
                    ) : (
                      <>chưa thanh toán</>
                    )}
                  </td>
                  <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                  <td className='capitalize'>
                    {item.showtimeId.cinemaId.name}
                  </td>
                  <td>{item.paymentMethod}</td>
                  <td>
                    {item.totalPrice.toLocaleString('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    })}
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
            pageCount={Math.ceil(orders.data.length / itemsPerPage)}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName={'pagination'}
            activeClassName={'active'}
          />
        </>
      ) : (
        <div>Danh sách phim trống!</div>
      )}
    </div>
  )
}

export default ListOrder
