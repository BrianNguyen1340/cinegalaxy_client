import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaEye } from 'react-icons/fa'
import ReactPaginate from 'react-paginate'

import { useGetServiceTicketsQuery } from '~/services/serviceTicket.service'

const ListServiceTicket = () => {
  const { data: serviceTickets, refetch } = useGetServiceTicketsQuery({})

  useEffect(() => {
    refetch()
  }, [refetch])

  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 2
  const offset = currentPage * itemsPerPage
  const currentItems = serviceTickets
    ? serviceTickets?.data
        ?.slice()
        ?.reverse()
        ?.slice(offset, offset + itemsPerPage)
    : []

  const handlePageClick = (event) => {
    setCurrentPage(event.selected)
  }

  return (
    <div className='relative h-fit w-full rounded-xl border bg-white p-4 shadow-md'>
      <div className='mb-5 rounded-xl bg-[#289ae7] py-5 text-center text-xl font-semibold capitalize text-white'>
        danh sách vé dịch vụ
      </div>

      {serviceTickets && (
        <>
          <table>
            <thead>
              <tr>
                <th className='w-[100px]'>no.</th>
                <th>người tạo</th>
                <th>ngày tạo vé</th>
                <th>tiền khách đưa</th>
                <th>tiền thối lại</th>
                <th>mã hóa đơn</th>
                <th>sản phẩm</th>
                <th>tổng tiền</th>
                <th>hành động</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, index) => (
                <tr key={index}>
                  <td>{index + offset}</td>
                  <td className='capitalize'>{item.createdBy.name}</td>
                  <td>
                    {new Date(item.createdAt).toLocaleDateString()}
                    <span className='px-2'>-</span>
                    {new Date(item.createdAt).toLocaleTimeString()}
                  </td>
                  <td>
                    {item.cashReceived.toLocaleString('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    })}
                  </td>
                  <td>
                    {item.changeAmount.toLocaleString('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    })}
                  </td>
                  <td>{item.invoiceCode}</td>
                  <td className='px-4 py-2'>
                    <ul>
                      {item.products.map((product, index) => (
                        <li key={index} className='flex justify-between'>
                          <span className='capitalize'>{product.name}</span>
                          <span>
                            {product.total.toLocaleString('vi-VN', {
                              style: 'currency',
                              currency: 'VND',
                            })}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>
                    {item.totalPrice.toLocaleString('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    })}
                  </td>
                  <td>
                    <div className='flex items-center justify-center'>
                      <Link
                        to={`/detail-service-ticket/${item._id}`}
                        className='rounded p-1 transition duration-300 hover:bg-[#67349D] hover:text-white hover:shadow-custom'
                      >
                        <FaEye size='24' />
                      </Link>
                    </div>
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
            pageCount={Math.ceil(serviceTickets?.data?.length / itemsPerPage)}
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

export default ListServiceTicket
