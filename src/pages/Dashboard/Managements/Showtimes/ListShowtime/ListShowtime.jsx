import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { SquarePen } from 'lucide-react'
import ReactPaginate from 'react-paginate'
import nProgress from 'nprogress'
import Swal from 'sweetalert2'

import {
  useGetShowtimesQuery,
  useHideShowtimeMutation,
  useShowShowtimeMutation,
} from '~/services/showtime.service'
import { useGetMoviesQuery } from '~/services/movie.service'
import { useGetCinemaComplexesQuery } from '~/services/cinemaComplex.service'
import { useGetCinemasQuery } from '~/services/cinema.service'
import { useGetRoomsQuery } from '~/services/room.service'
import useTitle from '~/hooks/useTitle'

const ListShowtime = () => {
  useTitle('Manager | Danh sách suất chiếu')
  const { user } = useSelector((state) => state.user)

  const {
    data: showtimes,
    isLoading: isLoadingShowtimes,
    isSuccess: isSuccessShowtimes,
    refetch: refetchShowtimes,
  } = useGetShowtimesQuery({})
  console.log(showtimes)

  const {
    data: movies,
    isLoading: isLoadingMovies,
    isSuccess: isSuccessMovies,
    refetch: refetchMovies,
  } = useGetMoviesQuery({})

  const {
    data: cinemaCinemaComplexes,
    isLoading: isLoadingCinemaComplexes,
    isSuccess: isSuccessCinemaComplexes,
    refetch: refetchCinemaComplexes,
  } = useGetCinemaComplexesQuery({})

  const {
    data: cinemas,
    isLoading: isLoadingCinemas,
    isSuccess: isSuccessCinemas,
    refetch: refetchCinemas,
  } = useGetCinemasQuery({})

  const {
    data: rooms,
    isLoading: isLoadingRooms,
    isSuccess: isSuccessRooms,
    refetch: refetchRooms,
  } = useGetRoomsQuery({})

  useEffect(() => {
    refetchShowtimes()
    refetchMovies()
    refetchCinemaComplexes()
    refetchCinemas()
    refetchRooms()
  }, [
    refetchShowtimes,
    refetchMovies,
    refetchCinemaComplexes,
    refetchCinemas,
    refetchRooms,
  ])

  const [selectedMovie, setSelectedMovie] = useState(
    localStorage.getItem('selectedMovieShowtime') || null,
  )
  const [selectedRoom, setSelectedRoom] = useState(
    localStorage.getItem('selectedRoomShowtime') || null,
  )
  const [selectedCinema, setSelectedCinema] = useState(
    localStorage.getItem('selectedCinemaShowtime') || null,
  )

  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 10
  const offset = currentPage * itemsPerPage

  const filteredShowtimes = showtimes
    ? showtimes?.data?.filter((showtime) => {
        const matchMovie = selectedMovie
          ? showtime.movieId._id === selectedMovie
          : true
        const matchRoom = selectedRoom
          ? showtime.roomId._id === selectedRoom
          : true
        const matchCinema = selectedCinema
          ? showtime.cinemaId._id === selectedCinema
          : true
        const matchUserCinema =
          showtime?.cinemaId?._id?.toString() === user?.cinemaId?.toString()

        return matchMovie && matchRoom && matchCinema && matchUserCinema
      })
    : []

  const currentItems = filteredShowtimes.slice(offset, offset + itemsPerPage)

  const handlePageClick = (event) => {
    setCurrentPage(event.selected)
  }
  const handleMovieChange = (event) => {
    setSelectedMovie(event.target.value)
  }
  const handleRoomChange = (event) => {
    setSelectedRoom(event.target.value)
  }
  const handleCinemaChange = (event) => {
    setSelectedCinema(event.target.value)
  }

  const [hideShowtime] = useHideShowtimeMutation()
  const [showShowtime] = useShowShowtimeMutation()

  const handleHideMovie = async (_id) => {
    try {
      nProgress.start()
      const result = await Swal.fire({
        title: 'Bạn có chắc',
        text: 'Muốn ẩn suất chiếu này?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'OK!',
        cancelButtonText: 'Không!',
      })
      if (result.isConfirmed) {
        await hideShowtime(_id)
        Swal.fire('Thành công!', 'Ẩn suất chiếu thành công!', 'success')
        refetchShowtimes()
      }
    } catch (error) {
      Swal.fire('Thất bại', error.data.message, 'error')
    } finally {
      nProgress.done()
    }
  }

  const handleShowMovie = async (_id) => {
    try {
      nProgress.start()
      const result = await Swal.fire({
        title: 'Bạn có chắc',
        text: 'Muốn hiện suất chiếu này?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'OK!',
        cancelButtonText: 'Không!',
      })

      if (result.isConfirmed) {
        await showShowtime(_id)
        Swal.fire('Thành công!', 'Hiện suất chiếu thành công!', 'success')
        refetchShowtimes()
      }
    } catch (error) {
      Swal.fire('Thất bại', error?.data?.message, 'error')
    } finally {
      nProgress.done()
    }
  }

  let content

  if (
    isLoadingShowtimes ||
    isLoadingMovies ||
    isLoadingCinemas ||
    isLoadingCinemaComplexes ||
    isLoadingRooms
  )
    content = <div>Loading...</div>

  if (
    isSuccessShowtimes &&
    isSuccessMovies &&
    isSuccessCinemas &&
    isSuccessCinemaComplexes &&
    isSuccessRooms
  ) {
    content = (
      <div className='relative h-fit w-full rounded-xl border bg-white p-4 shadow-md'>
        <div className='mb-5 rounded-xl bg-[#289ae7] py-5 text-center text-xl font-semibold capitalize text-white'>
          danh sách suất chiếu
        </div>

        {showtimes ? (
          <>
            <table>
              <thead>
                <tr>
                  <th className='w-[100px]'>no.</th>
                  <th>ngày chiếu</th>
                  <th>thời gian bắt đầu</th>
                  <th>thời gian kết thúc</th>
                  <th>phim</th>
                  <th>phòng</th>
                  <th>rạp</th>
                  <th>trạng thái</th>
                  <th>mã khuyến mãi</th>
                  <th>hành động</th>
                </tr>
              </thead>
              <tbody>
                {currentItems?.map((item, index) => (
                  <tr key={index}>
                    <td>{index + offset}</td>
                    <td>{new Date(item.date).toLocaleDateString('vi-VN')}</td>
                    <td>
                      {new Date(item.timeStart).toLocaleTimeString('vi-VN')}
                    </td>
                    <td>
                      {new Date(item.timeEnd).toLocaleTimeString('vi-VN')}
                    </td>
                    <td>{item.movieId.name}</td>
                    <td className='capitalize'>{item.roomId.name}</td>
                    <td className='capitalize'>{item.cinemaId.name}</td>
                    <td>
                      {item.hidden === false ? (
                        <div className='flex items-center justify-center'>
                          <button
                            className='cursor-pointer rounded bg-[#70e000] p-1 capitalize text-white'
                            onClick={() => handleHideMovie(item?._id)}
                          >
                            show
                          </button>
                        </div>
                      ) : (
                        <div className='flex items-center justify-center'>
                          <button
                            className='ff006e cursor-pointer rounded bg-[#ff006e] p-1 capitalize text-white'
                            onClick={() => handleShowMovie(item?._id)}
                          >
                            hidden
                          </button>
                        </div>
                      )}
                    </td>
                    {item.promotionId ? (
                      <td>{item.promotionId.name}</td>
                    ) : (
                      <td>Không có khuyến mãi</td>
                    )}
                    <td>
                      <div className='flex items-center justify-center'>
                        <Link to={`/update-showtime/${item?._id}`}>
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
              pageCount={Math.ceil(showtimes.data.length / itemsPerPage)}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageClick}
              containerClassName={'pagination'}
              activeClassName={'active'}
            />
          </>
        ) : (
          <div>Danh sách suất chiếu trống!</div>
        )}
      </div>
    )
  }

  return content
}

export default ListShowtime
