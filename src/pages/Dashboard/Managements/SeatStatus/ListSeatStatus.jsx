import { useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate'

import { useGetAllShowtimeSeatStatusQuery } from '~/services/showtimeSeatStatus.service'
import { useGetCinemasQuery } from '~/services/cinema.service'
import { useGetRoomsQuery } from '~/services/room.service'
import { useGetShowtimesQuery } from '~/services/showtime.service'
import { useGetMoviesQuery } from '~/services/movie.service'

const ListSeatStatus = () => {
  const { data, refetch } = useGetAllShowtimeSeatStatusQuery({})
  const { data: rooms, refetch: refetchRooms } = useGetRoomsQuery({})
  const { data: cinemas, refetch: refetchCinemas } = useGetCinemasQuery({})
  const { data: movies, refetch: refetchMovies } = useGetMoviesQuery({})
  const { data: showtimes, refetch: refetchShowtimes } = useGetShowtimesQuery(
    {},
  )

  useEffect(() => {
    refetch()
    refetchRooms()
    refetchCinemas()
    refetchShowtimes()
    refetchMovies()
  }, [refetch, refetchRooms, refetchCinemas, refetchShowtimes, refetchMovies])

  const filteredData = data?.data?.filter((seatStatus) =>
    showtimes?.data?.some(
      (showtime) => showtime._id === seatStatus.showtimeId._id,
    ),
  )

  const getMovieName = (movieId) => {
    const movie = movies?.data.find((m) => m._id === movieId)
    return movie ? movie.name : 'Không xác định'
  }

  const getCinemaName = (cinemaId) => {
    const cinema = cinemas?.data.find((c) => c._id === cinemaId)
    return cinema ? cinema.name : 'Không xác định'
  }

  const getRoomName = (roomId) => {
    const room = rooms?.data.find((r) => r._id === roomId)
    return room ? room.name : 'Không xác định'
  }

  const getShowtimeInfo = (showtimeId) => {
    const showtime = showtimes?.data.find((s) => s._id === showtimeId._id)
    if (!showtime)
      return { date: 'Không xác định', timeStart: '-', timeEnd: '-' }
    const { date, timeStart, timeEnd } = showtime
    return { date, timeStart, timeEnd }
  }

  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 10
  const offset = currentPage * itemsPerPage
  const currentItems = data
    ? data?.data
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
        danh sách trạng thái ghế
      </div>

      {data ? (
        <>
          <table>
            <thead>
              <tr className='bg-gray-200'>
                <th className='border px-4 py-2'>No.</th>
                <th className='border px-4 py-2'>Tên phim</th>
                <th className='border px-4 py-2'>Cụm rạp</th>
                <th className='border px-4 py-2'>Phòng</th>
                <th className='border px-4 py-2'>Ngày chiếu</th>
                <th className='border px-4 py-2'>Thời gian bắt đầu</th>
                <th className='border px-4 py-2'>Thời gian kết thúc</th>
                <th className='border px-4 py-2'>Hàng ghế</th>
                <th className='border px-4 py-2'>Số ghế</th>
                <th className='border px-4 py-2'>Giá</th>
                <th className='border px-4 py-2'>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, index) =>
                item.seatIds.map((seat, seatIndex) => {
                  const showtimeInfo = getShowtimeInfo(item.showtimeId)
                  return (
                    <tr key={`${index}-${seatIndex}`} className='text-center'>
                      <td className='border px-4 py-2'>
                        {index * item.seatIds.length + seatIndex + 1 + offset}
                      </td>
                      <td className='border px-4 py-2 text-xs capitalize'>
                        {getMovieName(item.showtimeId.movieId)}
                      </td>
                      <td className='border px-4 py-2 capitalize'>
                        {getCinemaName(item.showtimeId.cinemaId)}
                      </td>
                      <td className='border px-4 py-2 capitalize'>
                        {getRoomName(item.showtimeId.roomId)}
                      </td>
                      <td className='border px-4 py-2'>
                        {new Date(showtimeInfo.date).toLocaleDateString(
                          'vi-VN',
                        )}
                      </td>
                      <td className='border px-4 py-2'>
                        {new Date(showtimeInfo.timeStart).toLocaleTimeString(
                          'vi-VN',
                        )}
                      </td>
                      <td className='border px-4 py-2'>
                        {new Date(showtimeInfo.timeEnd).toLocaleTimeString(
                          'vi-VN',
                        )}
                      </td>
                      <td className='border px-4 py-2'>{seat.row}</td>
                      <td className='border px-4 py-2'>{seat.number}</td>
                      <td className='border px-4 py-2'>
                        {seat.price.toLocaleString()} VND
                      </td>
                      <td className='border px-4 py-2'>{seat.status}</td>
                    </tr>
                  )
                }),
              )}
            </tbody>
          </table>

          <ReactPaginate
            previousLabel={'<'}
            nextLabel={'>'}
            breakLabel={'...'}
            breakClassName={'break-me'}
            pageCount={Math.ceil(filteredData?.data?.length / itemsPerPage)}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName={'pagination'}
            activeClassName={'active'}
          />
        </>
      ) : (
        <div>Danh sách trạng thái ghế trống!</div>
      )}
    </div>
  )
}

export default ListSeatStatus
