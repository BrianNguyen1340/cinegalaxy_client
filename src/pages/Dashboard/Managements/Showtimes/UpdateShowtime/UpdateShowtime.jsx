import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { HashLoader } from 'react-spinners'
import Flatpickr from 'react-flatpickr'
import Swal from 'sweetalert2'
import nProgress from 'nprogress'

import { useGetMoviesQuery } from '~/services/movie.service'
import { useGetRoomsQuery } from '~/services/room.service'
import {
  useUpdateShowtimeMutation,
  useGetShowtimeQuery,
} from '~/services/showtime.service'
import { useGetPromotionsQuery } from '~/services/promotion.service'
import { paths } from '~/utils/paths'
import useTitle from '~/hooks/useTitle'

const UpdateShowtime = () => {
  useTitle('Manager | Cập nhật suất chiếu')
  const { user } = useSelector((state) => state.user)
  const { id } = useParams()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
  } = useForm()

  const {
    data: showtime,
    isLoading: isLoadingShowtime,
    isSuccess: isSuccessShowtime,
    refetch: refetchShowtime,
  } = useGetShowtimeQuery(id)

  const {
    data: movies,
    isLoading: isLoadingMovies,
    isSuccess: isSuccessMovies,
    refetch: refetchMovies,
  } = useGetMoviesQuery({})

  const {
    data: rooms,
    isLoading: isLoadingRooms,
    isSuccess: isSuccessRooms,
    refetch: refetchRooms,
  } = useGetRoomsQuery({})

  const { data: promotions, refetch } = useGetPromotionsQuery({})

  const filteredRooms =
    rooms?.data?.filter((room) => room.cinemaId._id === user?.cinemaId) || []

  const [selectedDate, setSelectedDate] = useState()
  const [selectedTimeStart, setSelectedTimeStart] = useState()

  useEffect(() => {
    refetchShowtime()
    refetchMovies()
    refetchRooms()
    refetch()
  }, [refetchShowtime, refetchMovies, refetchRooms, refetch])

  useEffect(() => {
    if (showtime?.data) {
      const showtimeDate = new Date(showtime?.data?.date)
      setSelectedDate(showtimeDate)
      setValue('date', showtimeDate)

      const showtimeTimeStart = new Date(showtime?.data?.timeStart)
      setSelectedTimeStart(showtimeTimeStart)
      setValue('timeStart', showtimeTimeStart)

      setValue('roomId', showtime?.data?.roomId?._id)
      setValue('movieId', showtime?.data?.movieId?._id)
      setValue('promotionId', showtime?.data?.promotionId?._id)
    }
  }, [showtime, setValue])

  const [updateApi, { isLoading: isLoadingUpdate }] =
    useUpdateShowtimeMutation()

  const handleUpdate = async (reqBody) => {
    try {
      nProgress.start()
      const { roomId, movieId, date, timeStart } = reqBody

      const timeStartDate =
        typeof timeStart === 'string' ? new Date(timeStart) : timeStart

      const response = await updateApi({
        id,
        cinemaId: user?.cinemaId,
        roomId,
        movieId,
        date,
        timeStart: timeStartDate,
      }).unwrap()

      Swal.fire('Thành công!', response.message, 'success')
      navigate(paths.dashboardPaths.managements.showtimes.list)
    } catch (error) {
      Swal.fire('Thất bại', error?.data?.message, 'error')
    } finally {
      nProgress.done()
    }
  }

  let content
  if (isLoadingShowtime || isLoadingMovies || isLoadingRooms)
    content = <div>Loading...</div>
  if (isSuccessShowtime && isSuccessMovies && isSuccessRooms) {
    content = (
      <div className='relative h-fit w-full rounded-xl border bg-white p-4 shadow-md'>
        <div className='mb-5 rounded-xl bg-[#289ae7] py-5 text-center text-xl font-semibold capitalize text-white'>
          cập nhật suất chiếu
        </div>

        <form
          onSubmit={handleSubmit(handleUpdate)}
          className='mx-auto w-[500px]'
        >
          <div className='mb-5 flex flex-col'>
            <label htmlFor='roomId' className='mb-1 font-semibold capitalize'>
              phòng
            </label>
            <select
              {...register('roomId', {
                required: 'Vui lòng chọn phòng',
              })}
              id='roomId'
              name='roomId'
              className='p-2 capitalize'
            >
              <option value=''>Chọn phòng</option>
              {filteredRooms?.map((item, index) => (
                <option key={index} value={item._id} className='capitalize'>
                  {item.name}
                </option>
              ))}
            </select>
            {errors.roomId && (
              <div className='text-sm text-[red]'>{errors.roomId.message}</div>
            )}
          </div>

          <div className='mb-5 flex flex-col'>
            <label htmlFor='movieId' className='mb-1 font-semibold capitalize'>
              phim
            </label>
            <select
              {...register('movieId', {
                required: 'Vui lòng chọn phim',
              })}
              id='movieId'
              name='movieId'
              className='p-2 capitalize'
            >
              <option value=''>Chọn phim</option>
              {movies?.data?.map((item, index) => (
                <option
                  key={index}
                  value={item._id}
                  className='text-sm font-semibold capitalize'
                >
                  {item.name}
                </option>
              ))}
            </select>
            {errors.movieId && (
              <div className='text-sm text-[red]'>{errors.movieId.message}</div>
            )}
          </div>

          <div className='mb-5 flex flex-col'>
            <label htmlFor='date' className='mb-1 font-semibold capitalize'>
              ngày chiếu
            </label>
            <Flatpickr
              value={selectedDate}
              onChange={([date]) => setValue('date', date)}
              options={{
                dateFormat: 'Y-m-d',
              }}
              className='w-full cursor-pointer rounded border-2 p-2 focus:outline-[#AF47D2]'
              id='date'
              name='date'
              placeholder='Chọn ngày chiếu'
            />
            {errors.date && (
              <div className='text-sm text-[red]'>{errors.date.message}</div>
            )}
          </div>

          <div className='mb-5 flex flex-col'>
            <label
              htmlFor='timeStart'
              className='mb-1 font-semibold capitalize'
            >
              giờ bắt đầu suất chiếu
            </label>
            <Flatpickr
              value={selectedTimeStart}
              onChange={([timeStart]) => {
                setValue('timeStart', timeStart)
                clearErrors('timeStart')
              }}
              options={{
                enableTime: true,
                noCalendar: true,
                dateFormat: 'H:i',
                time_24hr: true,
              }}
              id='timeStart'
              name='timeStart'
              placeholder='Chọn giờ bắt đầu suất chiếu'
              className='w-full cursor-pointer rounded border-2 p-2 focus:outline-[#AF47D2]'
            />
            {errors.timeStart && (
              <div className='text-sm text-[red]'>
                {errors.timeStart.message}
              </div>
            )}
          </div>

          <div className='mb-5 flex flex-col'>
            <label
              htmlFor='promotionId'
              className='mb-1 font-semibold capitalize'
            >
              mã khuyến mãi
            </label>
            <select
              {...register('promotionId', {
                required: 'Vui lòng chọn rạp',
              })}
              id='promotionId'
              name='promotionId'
              className='p-2 capitalize'
            >
              <option value=''>Chọn mã khuyến mãi</option>
              {promotions?.data?.map((item, index) => (
                <option key={index} value={item._id}>
                  {item?.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type='submit'
            disabled={isLoadingUpdate ? true : false}
            className='rounded bg-black px-4 py-3 font-semibold text-white transition duration-300 hover:opacity-70'
          >
            <div className='flex items-center justify-center gap-3'>
              {isLoadingUpdate && <HashLoader size='20' color='#fff' />}
              <span className='capitalize'>
                {isLoadingUpdate ? 'đang lưu' : 'lưu'}
              </span>
            </div>
          </button>
        </form>
      </div>
    )
  }

  return content
}

export default UpdateShowtime
