import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js'
import Swal from 'sweetalert2'

import { paths } from '~/utils/paths'
import {
  useGetOrderQuery,
  useMakeOrderAsPaidMutation,
  useGetPaypalClientIdQuery,
} from '~/services/order.service'
import { useCreateShowtimeSeatStatusMutation } from '~/services/showtimeSeatStatus.service'
import useTitle from '~/hooks/useTitle'

const Order = () => {
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

  const { data: order, refetch } = useGetOrderQuery(id)
  const [totalSeatPrice, setTotalSeatPrice] = useState(0)

  useEffect(() => {
    const total = order?.data?.seats?.reduce((total) => {
      const seatPrice = 100000
      return total + seatPrice
    }, 0)
    setTotalSeatPrice(total)
  }, [order])

  useEffect(() => {
    refetch()
  }, [refetch])

  const [makeOrderPaid] = useMakeOrderAsPaidMutation()

  const {
    data: paypal,
    isLoading: loadingPaPal,
    error: errorPayPal,
  } = useGetPaypalClientIdQuery()

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer()

  useEffect(() => {
    if (!errorPayPal && !loadingPaPal && paypal.clientId) {
      const loadingPaPalScript = async () => {
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': paypal.clientId,
            currency: 'USD',
          },
        })
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' })
      }

      if (order && !order?.data?.isPaid) {
        if (!window.paypal) {
          loadingPaPalScript()
        }
      }
    }
  }, [errorPayPal, loadingPaPal, order, paypal, paypalDispatch])

  const [createStatusSeat] = useCreateShowtimeSeatStatusMutation()

  const onApprove = async (data, actions) => {
    return actions.order.capture().then(async function (details) {
      try {
        const orderData = {
          id,
          details,
        }
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

        await Promise.all([
          makeOrderPaid(orderData),
          createStatusSeat(seatsData),
        ])

        Swal.fire('', 'Thanh toán thành công!', 'success')
        navigate(paths.userPaths.orderSuccess)
      } catch (error) {
        console.log(error)
      }
    })
  }

  const createOrder = (data, actions) => {
    const price = localStorage.getItem('totalPrice')
    const totalPrice = parseFloat(price).toFixed(2)
    if (isNaN(totalPrice) || totalPrice <= 0) {
      console.error('Invalid total price')
      return
    }
    return actions.order
      .create({
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: totalPrice,
            },
          },
        ],
      })
      .then((orderId) => {
        return orderId
      })
      .catch((error) => {
        console.error('Error during order creation:', error)
      })
  }

  const onError = (error) => {
    Swal.fire('', error.message, 'error')
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
                    src={order?.data?.showtimeId?.movieId?.posterURL}
                    alt='poster'
                    className='max-w-[100px]'
                  />
                </div>
                <div>
                  <div className='mb-4 text-[18px] font-semibold'>
                    <span className='mr-2'>
                      {order?.data?.showtimeId?.movieId?.name}
                    </span>
                    ({order?.data?.showtimeId?.movieId?.movieFormat}) - (
                    {order?.data?.showtimeId?.movieId?.subtitle})
                  </div>
                  <div className='flex flex-wrap items-center text-sm'>
                    <div className='pr-2'>
                      <span className='mr-1'>Ngày chiếu</span>
                      {new Date(
                        order?.data?.showtimeId?.date,
                      ).toLocaleDateString('vi-VN')}
                    </div>
                    <div>|</div>
                    <div className='px-2'>
                      <span className='mr-1'>Thời gian chiếu</span>
                      {new Date(
                        order?.data?.showtimeId?.timeStart,
                      ).toLocaleTimeString('vi-VN')}
                    </div>
                    <div>|</div>
                    <div className='px-2'>
                      <span className='mr-1'>Rạp chiếu</span>
                      {order?.data?.showtimeId?.cinemaId?.name}
                    </div>
                    <div>|</div>
                    <div className='px-2'>
                      <span className='mr-1'>Phòng chiếu</span>
                      {order?.data?.showtimeId?.roomId?.name}
                    </div>
                    <div>|</div>
                    <div className='flex items-center px-2'>
                      <span className='mr-1'>Ghế đã chọn</span>
                      {order?.data?.seats?.map((seat, index) => (
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
                {totalSeatPrice?.toLocaleString('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                })}
              </div>
            </div>
            {order?.data?.products?.map((product, index) => (
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
              {order?.data?.showtimeId?.promotionId && (
                <div>
                  <span className='mr-2 font-semibold'>Số tiền giảm</span>
                  <span>{order?.data?.showtimeId?.promotionId?.value}</span>
                  <span>
                    {order?.data?.showtimeId?.promotionId?.type ===
                      'percentage' && <>%</>}
                    {order?.data?.showtimeId?.promotionId?.type === 'fixed' && (
                      <>VND</>
                    )}
                  </span>
                </div>
              )}
              <div className='flex w-[150px] items-center justify-center text-xl font-semibold'>
                {order?.data?.totalPrice?.toLocaleString('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                })}
              </div>
            </div>
          </div>
          <div className='mt-10 flex items-center justify-center'>
            {isPending ? (
              <div className='h-16 w-16 animate-spin rounded-full border-t-4 border-pink-500 border-opacity-50'></div>
            ) : (
              <PayPalButtons
                onApprove={onApprove}
                createOrder={createOrder}
                onError={onError}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Order

// const [{ isPending }, paypalDispatch] = usePayPalScriptReducer()

// useEffect(() => {
//   if (!errorPayPal && !loadingPaPal && paypal.clientId) {
//     const loadingPaPalScript = async () => {
//       paypalDispatch({
//         type: 'resetOptions',
//         value: {
//           'client-id': paypal.clientId,
//           currency: 'USD',
//         },
//       })
//       paypalDispatch({ type: 'setLoadingStatus', value: 'pending' })
//     }
//     if (order && !order?.data?.isPaid) {
//       if (!window.paypal) {
//         loadingPaPalScript()
//       }
//     }
//   }
// }, [errorPayPal, loadingPaPal, order, paypal, paypalDispatch])
