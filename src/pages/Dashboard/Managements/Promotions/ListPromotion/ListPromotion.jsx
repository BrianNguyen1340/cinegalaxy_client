import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { SquarePen } from 'lucide-react'
import ReactPaginate from 'react-paginate'

import { useGetPromotionsQuery } from '~/services/promotion.service'
import useTitle from '~/hooks/useTitle'

const ListPromotion = () => {
  useTitle('Manager | Danh sách mã khuyến mãi')

  const { data: promotions, refetch } = useGetPromotionsQuery({})

  useEffect(() => {
    refetch()
  }, [refetch])

  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 10
  const offset = currentPage * itemsPerPage
  const currentItems = promotions
    ? promotions?.data
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
        danh sách mã khuyến mãi
      </div>

      {promotions ? (
        <>
          <table>
            <thead>
              <tr>
                <th className='w-[100px]'>no.</th>
                <th>Code</th>
                <th>nguời tạo</th>
                <th>loại khuyến mãi</th>
                <th>giá trị khuyến mãi</th>
                <th>ngày tạo</th>
                <th>ngày hết hạn</th>
                <th>hành động</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, index) => (
                <tr key={index}>
                  <td>{index + offset}</td>
                  <td className='capitalize'>{item.name}</td>
                  <td>{item.createdBy.name}</td>
                  <td>{item.type}</td>
                  {item.type === 'percentage' ? (
                    <td>{item.value} %</td>
                  ) : (
                    <td>
                      {item.value.toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      })}
                    </td>
                  )}
                  <td>{new Date(item.startDate).toLocaleDateString()}</td>
                  <td>{new Date(item.endDate).toLocaleDateString()}</td>
                  <td>
                    <div className='flex items-center justify-center'>
                      <Link
                        to={`/update-promotion/${item._id}`}
                        className='rounded p-1 transition duration-300 hover:bg-[#67349D] hover:text-white hover:shadow-custom'
                      >
                        <SquarePen />
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
            pageCount={Math.ceil(promotions?.data?.length / itemsPerPage)}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName={'pagination'}
            activeClassName={'active'}
          />
        </>
      ) : (
        <div>Danh sách cụm rạp trống!</div>
      )}
    </div>
  )
}

export default ListPromotion
