import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import Swal from 'sweetalert2'

import { useCreateShowtimeSeatStatusMutation } from '~/services/showtimeSeatStatus.service'
import { paths } from '~/utils/paths'
import useTitle from '~/hooks/useTitle'
import { useGetMovieTicketQuery } from '~/services/movieTicket.service'

const Payment = () => {
  useTitle('Xác nhận đơn hàng')
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    const timer = setTimeout(
      () => {
        alert(
          'Bạn sẽ bị chuyển về trang chọn suất chiếu sau 10 phút nếu không xác nhận thanh toán!',
        )
        navigate(paths.userPaths.showtimes)
      },
      10 * 60 * 1000,
    )
    return () => {
      clearTimeout(timer)
    }
  }, [dispatch, navigate])

  const { data: movieTicket, refetch } = useGetMovieTicketQuery(id)
  console.log(movieTicket)

  useEffect(() => {
    refetch()
  }, [refetch])

  const [createStatusSeat] = useCreateShowtimeSeatStatusMutation()

  const handleConfirmPayment = async () => {
    try {
      const showtimeId = localStorage.getItem('showtimeId')
      const seats = JSON.parse(localStorage.getItem('seats'))

      const seatsData = {
        showtimeId,
        seatIds: seats.map((seat) => ({
          seatId: seat.seat,
          number: seat.number,
          row: seat.row,
          price: seat.price,
          status: seat.status,
        })),
      }

      await createStatusSeat(seatsData)

      Swal.fire('', 'Xác nhận chọn ghế thành công!', 'success')
      navigate(paths.dashboardPaths.managements.movieTickets.create)
    } catch (error) {
      Swal.fire('Thất bại', error?.data?.message, 'error')
    }
  }

  return (
    <div className='relative h-fit w-full'>
      <div className='w-full bg-[#f9f6ec] py-10'>
        <div className='mx-auto w-[1000px]'>
          <div className='pb-10 text-[28px] font-semibold'>
            Đặt hàng/Thanh toán
          </div>
          <div className='border-t-2 border-black bg-white'>
            <div className='flex items-center justify-between border-b p-6'>
              <div className='flex items-center'>
                <div className='mr-4 flex items-center justify-center'>
                  <img
                    src={movieTicket?.data?.showtimeId?.movieId?.posterURL}
                    alt='poster'
                    className='max-w-[100px]'
                  />
                </div>
                <div>
                  <div className='mb-4 text-[18px] font-semibold'>
                    <span className='mr-2'>
                      {movieTicket?.data?.showtimeId?.movieId?.name}
                    </span>
                    ({movieTicket?.data?.showtimeId?.movieId?.movieFormat}) - (
                    {movieTicket?.data?.showtimeId?.movieId?.subtitle})
                  </div>
                  <div className='flex flex-wrap items-center text-sm'>
                    <div className='pr-2'>
                      <span className='mr-1'>Ngày chiếu</span>
                      {new Date(
                        movieTicket?.data?.showtimeId?.date,
                      ).toLocaleDateString('vi-VN')}
                    </div>
                    <div>|</div>
                    <div className='px-2'>
                      <span className='mr-1'>Thời gian chiếu</span>
                      {new Date(
                        movieTicket?.data?.showtimeId?.timeStart,
                      ).toLocaleTimeString('vi-VN')}
                    </div>
                    <div>|</div>
                    <div className='px-2'>
                      <span className='mr-1'>Rạp chiếu</span>
                      {movieTicket?.data?.showtimeId?.cinemaId?.name}
                    </div>
                    <div>|</div>
                    <div className='px-2'>
                      <span className='mr-1'>Phòng chiếu</span>
                      {movieTicket?.data?.showtimeId?.roomId?.name}
                    </div>
                    <div>|</div>
                    <div className='flex items-center px-2'>
                      <span className='mr-1'>Ghế đã chọn</span>
                      {movieTicket?.data?.seats?.map((seat, index) => (
                        <div key={index} className='px-1 capitalize'>
                          {seat.row}
                          {seat.number}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className='flex min-w-[100px] items-center justify-center text-xl font-semibold'>
                {/* {totalSeatPrice?.toLocaleString('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                })} */}
              </div>
            </div>
            {movieTicket?.data?.products?.map((product, index) => (
              <div
                key={index}
                className='flex items-center justify-between border-b p-6'
              >
                <div className='flex items-center'>
                  <div className='mr-4 flex items-center justify-center'>
                    <img
                      src={product?.imageURL}
                      alt='poster'
                      className='max-w-[100px]'
                    />
                  </div>
                  <div className='mb-4 text-[18px] font-semibold capitalize'>
                    {product.name}
                  </div>
                </div>
                <div className='flex w-[100px] items-center justify-center text-xl font-semibold'>
                  {(product?.price * product?.quantity)?.toLocaleString(
                    'vi-VN',
                    {
                      style: 'currency',
                      currency: 'VND',
                    },
                  )}
                </div>
              </div>
            ))}
            <div className='flex items-center justify-between p-6'>
              <div className='text-xl font-semibold'>Tổng số tiền đặt hàng</div>
              {movieTicket?.data?.showtimeId?.promotionId && (
                <div>
                  <span className='mr-2 font-semibold'>Số tiền giảm</span>
                  <span>
                    {movieTicket?.data?.showtimeId?.promotionId?.value}
                  </span>
                  <span>
                    {movieTicket?.data?.showtimeId?.promotionId?.type ===
                      'percentage' && <>%</>}
                    {movieTicket?.data?.showtimeId?.promotionId?.type ===
                      'fixed' && <>VND</>}
                  </span>
                </div>
              )}
              <div className='flex w-[150px] items-center justify-center text-xl font-semibold'>
                {movieTicket?.data?.totalPrice?.toLocaleString('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                })}
              </div>
            </div>
          </div>
        </div>
        <div className='flex items-center justify-center'>
          <button
            type='button'
            onClick={handleConfirmPayment}
            className='mt-5 w-fit rounded border bg-white p-3'
          >
            Xác nhận đặt vé
          </button>
        </div>
      </div>
    </div>
  )
}

export default Payment
