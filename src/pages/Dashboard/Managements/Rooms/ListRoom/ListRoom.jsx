import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { SquarePen } from 'lucide-react'
import ReactPaginate from 'react-paginate'

import { useGetRoomsQuery } from '~/services/room.service'
import { useGetCinemasQuery } from '~/services/cinema.service'
import useTitle from '~/hooks/useTitle'

const ListRoom = () => {
  useTitle('Admin | Danh sách phòng')

  const {
    data: rooms,
    isLoading: isLoadingRooms,
    isSuccess: isSuccessRooms,
    refetch: refetchRooms,
  } = useGetRoomsQuery({})
  console.log(rooms)

  const { data: cinemas } = useGetCinemasQuery({})

  useEffect(() => {
    refetchRooms()
  }, [refetchRooms])

  const [selectedCinema, setSelectedCinema] = useState('')

  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 10
  const offset = currentPage * itemsPerPage

  const filteredRooms = rooms
    ? rooms?.data?.filter((room) =>
        selectedCinema ? room.cinemaId._id === selectedCinema : true,
      )
    : []

  const currentItems = filteredRooms?.slice(offset, offset + itemsPerPage)

  const handlePageClick = (event) => {
    setCurrentPage(event.selected)
  }

  const handleCinemaChange = (event) => {
    setSelectedCinema(event.target.value)
  }

  let content
  if (isLoadingRooms) content = <div>Loading...</div>
  if (isSuccessRooms) {
    content = (
      <div className='relative h-fit w-full rounded-xl border bg-white p-4 shadow-md'>
        <div className='mb-5 rounded-xl bg-[#289ae7] py-5 text-center text-xl font-semibold capitalize text-white'>
          danh sách phòng
        </div>

        <div className='mb-4'>
          <label htmlFor='cinema-select' className='mr-2 capitalize'>
            Chọn rạp
          </label>
          <select
            id='cinema-select'
            value={selectedCinema}
            onChange={handleCinemaChange}
            className='rounded border px-3 py-2 capitalize'
          >
            <option value=''>Tất cả rạp</option>
            {cinemas?.data?.map((cinema, index) => (
              <option key={index} value={cinema._id}>
                {cinema.name}
              </option>
            ))}
          </select>
        </div>

        {rooms ? (
          <>
            <table>
              <thead>
                <tr>
                  <th className='w-[100px]'>no.</th>
                  <th>tên</th>
                  <th>sức chứa</th>
                  <th>tình trạng</th>
                  <th>rạp</th>
                  <th>quản lý</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, index) => (
                  <tr key={index}>
                    <td>{index + offset}</td>
                    <td className='capitalize'>{item.name}</td>
                    <td>{item.opacity}</td>
                    <td>{item.status}</td>
                    <td className='capitalize'>{item.cinemaId.name}</td>
                    <td>
                      <div className='flex items-center justify-center'>
                        <Link
                          to={`/update-room/${item._id}`}
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
              pageCount={Math.ceil(rooms?.data?.length / itemsPerPage)}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageClick}
              containerClassName={'pagination'}
              activeClassName={'active'}
            />
          </>
        ) : (
          <div>Danh sách phòng trống!</div>
        )}
      </div>
    )
  }

  return content
}

export default ListRoom
