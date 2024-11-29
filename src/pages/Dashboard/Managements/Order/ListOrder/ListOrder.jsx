import { useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate'
import { useGetOrdersQuery } from '~/services/order.service'

const ListOrder = () => {
  const { data: orders, refetch } = useGetOrdersQuery({})
  console.log(orders)

  useEffect(() => {
    refetch()
  }, [refetch])

  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 10
  const offset = currentPage * itemsPerPage
  const currentItems = orders
    ? orders?.data
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
        danh sách order
      </div>

      {orders ? (
        <>
          <table>
            <thead>
              <tr>
                <th className='w-[100px]'>no.</th>
              </tr>
            </thead>
            <tbody>
              {currentItems?.map((item, index) => (
                <tr key={index}>
                  <td>{index + offset}</td>
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
