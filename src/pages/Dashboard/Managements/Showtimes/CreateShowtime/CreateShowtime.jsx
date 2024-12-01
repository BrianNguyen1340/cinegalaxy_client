import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { HashLoader } from 'react-spinners'
import Flatpickr from 'react-flatpickr'
import Swal from 'sweetalert2'
import nProgress from 'nprogress'

import { useGetMoviesQuery } from '~/services/movie.service'
import { useGetRoomsQuery } from '~/services/room.service'
import { useCreateShowtimeMutation } from '~/services/showtime.service'
import { useGetPromotionsQuery } from '~/services/promotion.service'
import { paths } from '~/utils/paths'
import useTitle from '~/hooks/useTitle'

const CreateShowtime = () => {
  useTitle('Manager | Tạo suất chiếu')
  const { user } = useSelector((state) => state.user)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
  } = useForm()

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

  useEffect(() => {
    refetchMovies()
    refetchRooms()
    refetch()
  }, [refetchMovies, refetchRooms, refetch])

  const filteredRooms =
    rooms?.data?.filter((room) => room.cinemaId._id === user?.cinemaId) || []

  const [selectedDate, setSelectedDate] = useState()
  const [selectedTimeStart, setSelectedTimeStart] = useState()

  const [createApi, { isLoading: isLoadingCreate }] =
    useCreateShowtimeMutation()

  const handleCreate = async (reqBody) => {
    try {
      nProgress.start()
      const { roomId, movieId, date, timeStart, promotionId } = reqBody

      const timeStartDate =
        typeof timeStart === 'string' ? new Date(timeStart) : timeStart
      const currentDate = new Date()
      if (new Date(date) < currentDate) {
        Swal.fire('', 'Ngày chiếu không được nhỏ hơn ngày hiện tại!', 'error')
        return
      }
      const data = {
        createdBy: user._id,
        cinemaId: user?.cinemaId,
        roomId,
        movieId,
        date,
        timeStart: timeStartDate,
        promotionId: promotionId || null,
      }

      const response = await createApi(data).unwrap()
      Swal.fire('Thành công!', response.message, 'success')
      setSelectedDate('')
      setSelectedTimeStart('')
      navigate(paths.dashboardPaths.managements.showtimes.list)
    } catch (error) {
      Swal.fire('Thất bại', error?.data?.message, 'error')
    } finally {
      nProgress.done()
    }
  }

  let content
  if (isLoadingMovies || isLoadingRooms) content = <div>Loading...</div>
  if (isSuccessMovies && isSuccessRooms) {
    content = (
      <div className='relative h-fit w-full rounded-xl border bg-white p-4 shadow-md'>
        <div className='mb-5 rounded-xl bg-[#289ae7] py-5 text-center text-xl font-semibold capitalize text-white'>
          tạo suất chiếu
        </div>
        <form
          onSubmit={handleSubmit(handleCreate)}
          className='mx-auto w-[500px]'
        >
          <div className='mb-5 flex flex-col'>
            <label
              htmlFor='promotionId'
              className='mb-1 font-semibold capitalize'
            >
              mã khuyến mãi
            </label>
            <select
              id='promotionId'
              name='promotionId'
              className='p-2 capitalize'
              {...register('promotionId')}
            >
              <option value=''>Chọn mã khuyến mãi</option>
              {promotions?.data
                ?.filter((item) => item.cinemaId._id === user?.cinemaId)
                .map((item, index) => (
                  <option key={index} value={item._id}>
                    {item.name} -{' '}
                    {item.type === 'percentage'
                      ? `${item.value}%`
                      : item.type === 'fixed'
                        ? `${item.value}đ`
                        : ''}
                  </option>
                ))}
            </select>
          </div>

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
              onChange={([date]) => {
                setValue('date', date)
                clearErrors('date')
              }}
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

          <button
            type='submit'
            disabled={isLoadingCreate ? true : false}
            className='rounded bg-black px-4 py-3 font-semibold text-white transition duration-300 hover:opacity-70'
          >
            <div className='flex items-center justify-center gap-3'>
              {isLoadingCreate && <HashLoader size='20' color='#fff' />}
              <span className='capitalize'>
                {isLoadingCreate ? 'đang lưu' : 'lưu'}
              </span>
            </div>
          </button>
        </form>
      </div>
    )
  }

  return content
}

export default CreateShowtime
