import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { SquarePen } from 'lucide-react'
import { BeatLoader } from 'react-spinners'
import ReactPaginate from 'react-paginate'

import { useGetCinemasQuery } from '~/services/cinema.service'
import { useGetCinemaComplexesQuery } from '~/services/cinemaComplex.service'
import useTitle from '~/hooks/useTitle'

const ListCinema = () => {
  useTitle('Admin | Danh sách rạp')

  const {
    data: cinemas,
    isLoading: isLoadingCinemas,
    isSuccess: isSuccessCinemas,
    refetch: refetchCinemas,
  } = useGetCinemasQuery({})

  const { data: cinemaComplexes } = useGetCinemaComplexesQuery({})

  useEffect(() => {
    refetchCinemas()
  }, [refetchCinemas])

  const [currentPage, setCurrentPage] = useState(0)
  const [selectedCinemaComplex, setSelectedCinemaComplex] = useState('')

  const itemsPerPage = 10
  const offset = currentPage * itemsPerPage

  const filteredCinemas =
    cinemas?.data?.filter((cinema) => {
      if (!selectedCinemaComplex) return true
      return cinema.cinemaComplexId._id === selectedCinemaComplex
    }) || []

  const currentItems = filteredCinemas.slice(offset, offset + itemsPerPage)

  const handlePageClick = (event) => {
    setCurrentPage(event.selected)
  }

  const handleCinemaComplexChange = (event) => {
    setSelectedCinemaComplex(event.target.value)
  }

  let content

  if (isLoadingCinemas)
    content = (
      <div className='flex h-screen w-full items-center justify-center'>
        <BeatLoader />
      </div>
    )

  if (isSuccessCinemas) {
    content = (
      <div className='relative h-fit w-full rounded-xl border bg-white p-4 shadow-md'>
        <div className='mb-5 rounded-xl bg-[#289ae7] py-5 text-center text-xl font-semibold capitalize text-white'>
          danh sách rạp
        </div>

        <div className='mb-4'>
          <label htmlFor='cinemaComplex' className='mr-2 text-lg font-semibold'>
            Lọc theo cụm rạp:
          </label>
          <select
            id='cinemaComplex'
            value={selectedCinemaComplex}
            onChange={handleCinemaComplexChange}
            className='rounded border px-3 py-1 text-sm capitalize'
          >
            <option value=''>Tất cả cụm rạp</option>
            {cinemaComplexes?.data?.map((item, index) => (
              <option key={index} value={item._id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        {filteredCinemas.length > 0 ? (
          <>
            <table>
              <thead>
                <tr>
                  <th className='w-[100px]'>no.</th>
                  <th>tên rạp</th>
                  <th>địa chỉ</th>
                  <th>số điện thoại</th>
                  <th>cụm rạp</th>
                  <th>hành động</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, index) => (
                  <tr key={index}>
                    <td>{index + offset}</td>
                    <td className='capitalize'>{item.name}</td>
                    <td className='text-wrap capitalize'>{item.address}</td>
                    <td className='text-wrap capitalize'>{item.phone}</td>
                    <td className='capitalize'>{item.cinemaComplexId.name}</td>
                    <td>
                      <div className='flex items-center justify-center'>
                        <Link
                          to={`/update-cinema/${item._id}`}
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
              pageCount={Math.ceil(cinemas?.data?.length / itemsPerPage)}
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

  return content
}

export default ListCinema
