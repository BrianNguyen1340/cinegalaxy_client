import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { BeatLoader } from 'react-spinners'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import Swal from 'sweetalert2'
import nProgress from 'nprogress'

import { useGetShowtimeQuery } from '~/services/showtime.service'
import { useGetSeatsQuery } from '~/services/seat.service'
import { useGetProductsQuery } from '~/services/product.service'
import { useCreateOrderMutation } from '~/services/order.service'
import { useGetAllShowtimeSeatStatusQuery } from '~/services/showtimeSeatStatus.service'
import { RowSeat } from '~/components'
import { paths } from '~/utils/paths'
import useTitle from '~/hooks/useTitle'

const ShowtimeDetails = () => {
  useTitle('Chọn ghế')
  const { user } = useSelector((state) => state.user)
  const { id } = useParams()
  const navigate = useNavigate()

  const {
    data: seats,
    isLoading: isLoadingSeats,
    isSuccess: isSuccessSeats,
    refetch: refetchSeats,
  } = useGetSeatsQuery({})

  const {
    data: products,
    isLoading: isLoadingProducts,
    isSuccess: isSuccessProducts,
    refetch: refetchProducts,
  } = useGetProductsQuery({})

  const {
    data: showtime,
    isLoading: isLoadingShowtime,
    isSuccess: isSuccessShowtime,
    refetch: refetchShowtime,
  } = useGetShowtimeQuery(id)

  const { data: status, refetch } = useGetAllShowtimeSeatStatusQuery({})

  useEffect(() => {
    refetchShowtime()
    refetchSeats()
    refetchProducts()
    refetch()
  }, [refetchShowtime, refetchSeats, refetchProducts, refetch])

  const filteredStatus = status?.data.filter(
    (item) => item?.showtimeId?._id === showtime?.data?._id,
  )

  const bookedSeatIds =
    filteredStatus?.flatMap((item) =>
      item?.seatIds.map((seat) => seat.seatId),
    ) || []

  const isBooked = (seatId) => {
    return bookedSeatIds.includes(seatId)
  }

  const filteredSeats = seats?.data?.filter(
    (seat) => seat?.roomId?._id === showtime?.data?.roomId?._id,
  )

  const [selectedSeats, setSelectedSeats] = useState([])
  const [selectedProducts, setSelectedProducts] = useState([])

  const handleSeatClick = (seat) => {
    const isSelected = selectedSeats.some(
      (selected) => selected._id === seat._id,
    )
    if (!isSelected && selectedSeats.length >= 8) {
      Swal.fire('', 'Chỉ được chọn tối đa 8 ghế!', 'warning')
      return
    }
    if (isSelected) {
      setSelectedSeats((prevSelected) =>
        prevSelected.filter((selected) => selected._id !== seat._id),
      )
    } else {
      setSelectedSeats((prevSelected) => [...prevSelected, seat])
    }
  }

  const groupProductsByCategory = (products) => {
    if (!products) return {}
    return products.reduce((acc, product) => {
      const categoryKey = product.categoryId.name
      if (!categoryKey) return acc
      if (!acc[categoryKey]) {
        acc[categoryKey] = []
      }
      acc[categoryKey].push(product)
      return acc
    }, {})
  }

  const groupedProducts = isSuccessProducts
    ? groupProductsByCategory(products?.data)
    : {}

  const handleProductSelection = (product, action) => {
    setSelectedProducts((prevProducts) => {
      const existingProduct = prevProducts.find(
        (item) => item.product._id === product._id,
      )
      if (existingProduct) {
        return prevProducts
          .map((item) =>
            item.product._id === product._id
              ? {
                  ...item,
                  quantity:
                    action === 'increase'
                      ? item.quantity + 1
                      : item.quantity - 1,
                }
              : item,
          )
          .filter((item) => item.quantity > 0)
      }
      if (action === 'increase') {
        return [
          ...prevProducts,
          {
            product,
            quantity: 1,
          },
        ]
      }
      return prevProducts
    })
  }

  const seatTotalPrice = useMemo(() => {
    return selectedSeats.reduce((total, seat) => total + seat.price, 0)
  }, [selectedSeats])

  const productTotalPrice = useMemo(() => {
    return selectedProducts.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0,
    )
  }, [selectedProducts])

  const taxRate = 0.1
  const taxPrice = (seatTotalPrice + productTotalPrice) * taxRate

  const calculateDiscount = useCallback(
    (promotion) => {
      const subtotal = seatTotalPrice + productTotalPrice
      if (!promotion) return 0
      if (promotion.type === 'percentage') {
        return (promotion.value / 100) * subtotal
      }
      if (promotion.type === 'fixed') {
        return promotion.value
      }
      return 0
    },
    [seatTotalPrice, productTotalPrice],
  )

  const discountPrice = useMemo(() => {
    return calculateDiscount(showtime?.data.promotionId)
  }, [calculateDiscount, showtime?.data.promotionId])

  const totalPrice =
    seatTotalPrice + productTotalPrice + taxPrice - discountPrice

  const [createApi] = useCreateOrderMutation()

  const handleProceedToCheckout = async (event) => {
    event.preventDefault()

    try {
      nProgress.start()

      if (selectedSeats.length === 0) {
        Swal.fire('', 'Vui lòng chọn ít nhất một ghế', 'warning')
        return
      }

      const checkoutData = {
        userId: user._id,
        showtimeId: showtime?.data?._id,
        seats: selectedSeats.map((seat) => ({
          seat: seat._id,
          number: seat.number,
          row: seat.row,
          price: seat.price,
        })),
        products: selectedProducts.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
          imageURL: item.product.imageURL,
          name: item.product.name,
          price: item.product.price,
        })),
        taxPrice,
        totalPrice,
        paymentMethod: 'Paypal',
      }

      localStorage.setItem('totalPrice', totalPrice)
      localStorage.setItem('showtimeId', showtime?.data?._id)
      localStorage.setItem(
        'seats',
        JSON.stringify(
          selectedSeats.map((seat) => ({
            seat: seat._id,
            number: seat.number,
            row: seat.row,
            price: seat.price,
            status: 'Booked',
          })),
        ),
      )

      const response = await createApi(checkoutData).unwrap()

      navigate(`/order/${response?.data?._id}`)
      localStorage.setItem('orderId', response?.data?._id)
    } catch (error) {
      Swal.fire('Thất bại', error?.data?.message, 'error')
    } finally {
      nProgress.done()
    }
  }

  let content

  if (isLoadingShowtime || isLoadingSeats || isLoadingProducts)
    content = (
      <div className='flex h-screen w-full items-center justify-center'>
        <BeatLoader />
      </div>
    )

  if (isSuccessShowtime && isSuccessSeats && isSuccessProducts) {
    content = (
      <div className='relative h-full w-full'>
        <div className='h-fit w-full bg-[#f9f6ec]'>
          <div className='mx-auto w-[1000px]'>
            <div className='py-6 text-center text-2xl font-semibold capitalize'>
              chọn ghế
            </div>
            <div className='pb-6 text-center text-sm text-[#777]'>
              Có thể chọn tối đa 8 người
            </div>
          </div>
        </div>
        <div className='my-4 h-fit w-full bg-white'>
          <div className='mx-auto w-[1000px]'>
            <div className='mb-4 bg-[#f9f8f3] text-center text-xl font-semibold capitalize'>
              màn hình
            </div>
            <div className='mb-4 h-full w-full bg-[#f9f6ec] py-6'>
              <div className='mx-auto flex w-[350px] items-start justify-between bg-[#f9f6ec]'>
                <RowSeat />
                <ul className='grid grid-cols-10 grid-rows-10 gap-2'>
                  {filteredSeats?.map((item, index) => {
                    const isSelected = selectedSeats.includes(item)
                    const isSeatBooked = isBooked(item._id)

                    return (
                      <li
                        key={index}
                        className={`${item.type === 'Standard' && 'bg-[#848484] text-white'} ${item.type === 'Vip' && 'bg-[#fca311] text-white'} ${item.type === 'Couple' && 'bg-[#ff8fab] text-white'} ${isSelected && 'bg-black text-white'} ${selectedSeats.length > 0 && !isSelected && 'opacity-30'} ${isSeatBooked ? 'cursor-not-allowed bg-[#b7b7b7] blur-sm' : 'cursor-pointer'} flex h-[24px] w-[24px] items-center justify-center border`}
                        onClick={() => !isSeatBooked && handleSeatClick(item)}
                      >
                        {item.number}
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
            <div>
              <div className='mb-4 text-sm text-gray-500'>
                Nhấp lại vào chỗ ngồi đã chọn để hủy.
              </div>
              <div className='flex items-center gap-4 text-sm'>
                <div className='flex items-center'>
                  <span>Ghế có thể chọn</span>
                  <span className='ml-4 h-6 w-6 bg-[#848484]'></span>
                </div>
                <div className='flex items-center'>
                  <span>Ghế VIP</span>
                  <span className='ml-4 h-6 w-6 bg-[#fca311]'></span>
                </div>
                <div className='flex items-center'>
                  <span>Ghế Couple</span>
                  <span className='ml-4 h-6 w-6 bg-[#ff8fab]'></span>
                </div>
                <div className='flex items-center'>
                  <span>Ghế đã được mua</span>
                  <span className='ml-4 h-6 w-6 bg-[#b7b7b7] blur-sm'></span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='h-fit w-full bg-[#f9f6ec]'>
          <div className='mx-auto w-[1000px] py-6'>
            <div className='mb-6 text-xl font-semibold'>Đặt hàng sản phẩm</div>
            <ul>
              {Object.entries(groupedProducts).map(([categoryName, items]) => (
                <li key={categoryName} className='mb-4'>
                  <h2 className='mb-2 font-bold capitalize'>{categoryName}</h2>
                  <ul>
                    <li className='grid grid-cols-[1fr_100px_100px] border-2 bg-white p-4 font-semibold'>
                      <div className='flex items-center justify-start font-semibold'>
                        Mô tả
                      </div>
                      <div className='flex items-center justify-center'>
                        Số lượng
                      </div>
                      <div className='flex items-center justify-center'>
                        Giá tiền
                      </div>
                    </li>
                    {items.map((item) => {
                      const selectedItem = selectedProducts.find(
                        (prod) => prod.product._id === item._id,
                      )
                      const quantity = selectedItem ? selectedItem.quantity : 0
                      return (
                        <li
                          key={item._id}
                          className='grid grid-cols-[1fr_100px_100px] border-2 bg-white p-4 font-semibold'
                        >
                          <div className='flex items-center justify-start text-sm capitalize'>
                            {item.name} ({item.size})
                          </div>
                          <div className='flex items-center justify-center'>
                            {item.price.toLocaleString('vi-VN', {
                              style: 'currency',
                              currency: 'VND',
                            })}
                          </div>
                          <div className='flex items-center justify-center gap-2 py-2'>
                            <button
                              onClick={() =>
                                handleProductSelection(item, 'decrease')
                              }
                              className='flex h-6 w-6 items-center justify-center rounded-full bg-[#efebdb] text-2xl'
                            >
                              -
                            </button>
                            <div className='flex h-4 w-4 items-center justify-center'>
                              {quantity}
                            </div>
                            <button
                              onClick={() =>
                                handleProductSelection(item, 'increase')
                              }
                              className='flex h-6 w-6 items-center justify-center rounded-full bg-[#efebdb] text-2xl'
                            >
                              +
                            </button>
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className='h-fit w-full bg-[#33373a]'>
          <div className='mx-auto grid w-[1000px] grid-cols-4'>
            <div className='border-l border-[#515151] p-4'>
              <div className='mb-4 font-semibold text-[#e5e0cb]'>
                Phim chiếu rạp
              </div>
              <div>
                <div className='mb-4 flex items-center justify-center'>
                  <img
                    src={showtime?.data?.movieId?.posterURL}
                    alt='poster'
                    className='w-[150px]'
                  />
                </div>
                <div className='flex flex-col items-start gap-2'>
                  <div className='font-semibold uppercase text-white'>
                    {showtime?.data?.movieId?.name}
                  </div>
                  <div className='uppercase text-white'>
                    {showtime?.data?.movieId?.movieFormat}
                  </div>
                  <div className='text-xs uppercase text-white'>
                    {showtime?.data?.movieId?.movieRating}
                  </div>
                </div>
              </div>
            </div>
            <div className='border-l border-[#515151] p-4'>
              <div className='mb-4 font-semibold text-[#e5e0cb]'>
                Thông tin vé đã đặt
              </div>
              <div>
                <div className='mb-2 flex items-start'>
                  <div className='w-[100px] text-[#a7a9ac]'>Ngày</div>
                  <div className='text-white'>
                    {new Date(showtime?.data?.date).toLocaleDateString('vi-VN')}
                  </div>
                </div>
                <div className='mb-2 flex items-start'>
                  <div className='w-[100px] text-[#a7a9ac]'>Giờ chiếu</div>
                  <div className='text-white'>
                    {new Date(showtime?.data?.timeStart).toLocaleTimeString(
                      'vi-VN',
                      {
                        hour: '2-digit',
                        minute: '2-digit',
                      },
                    )}
                    <span className='mx-1'>~</span>
                    {new Date(showtime?.data?.timeEnd).toLocaleTimeString(
                      'vi-VN',
                      {
                        hour: '2-digit',
                        minute: '2-digit',
                      },
                    )}
                  </div>
                </div>
                <div className='mb-2 flex items-start'>
                  <div className='w-[100px] text-[#a7a9ac]'>Rạp chiếu</div>
                  <div className='text-white'>
                    {showtime?.data?.cinemaId?.name}
                  </div>
                </div>
                <div className='mb-2 flex items-start'>
                  <div className='w-[100px] text-[#a7a9ac]'>Phòng chiếu</div>
                  <div className='capitalize text-white'>
                    {showtime?.data?.roomId?.name}
                  </div>
                </div>
                <div className='mb-2 flex items-start'>
                  <div className='w-[100px] text-[#a7a9ac]'>Ghế ngồi</div>
                  {selectedSeats.length > 0 ? (
                    <ul className='grid grid-cols-4 items-center gap-0.5 text-white'>
                      {selectedSeats.map((seat, index) => (
                        <li
                          key={seat._id || index}
                          className='flex items-center justify-center'
                        >
                          {seat.row}
                          {seat.number}
                          {index < selectedSeats.length - 1 && ', '}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className='text-white'>Chưa chọn ghế</div>
                  )}
                </div>
                <div className='flex items-start'>
                  <div className='w-[100px] text-[#a7a9ac]'>Tiền ghế</div>
                  <div className='text-xl text-white'>
                    {selectedSeats
                      .reduce((total, seat) => total + seat.price, 0)
                      .toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      })}
                  </div>
                </div>
              </div>
            </div>
            <div className='border-l border-[#515151] p-4'>
              <div className='mb-4 font-semibold text-[#e5e0cb]'>
                Thông tin sản phẩm
              </div>
              <ul>
                {selectedProducts.map(({ product, quantity }) => (
                  <li key={product._id} className='mb-4 border-b pb-2'>
                    <div className='flex items-center gap-2 capitalize text-white'>
                      {product.name}
                      <div className='px-0.5 text-sm'>x</div>
                      {quantity}
                    </div>
                    <div className='text-white'>
                      {(product.price * quantity).toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      })}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className='border-l border-r border-[#515151] p-4'>
              <div className='mb-4 font-semibold text-[#e5e0cb]'>
                Tổng tiền đơn hàng
              </div>
              <div className='text-white'>
                <div className='flex items-start gap-4'>
                  <div className='w-[100px]'>Tiền phim</div>
                  <div>
                    {seatTotalPrice.toLocaleString('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    })}
                  </div>
                </div>
                <div className='flex items-start gap-4'>
                  <div className='w-[100px]'>Mua hàng</div>
                  <div className='flex items-end'>
                    {productTotalPrice.toLocaleString('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    })}
                  </div>
                </div>
              </div>
              {discountPrice > 0 && (
                <div className='mt-2 flex items-start gap-4 text-white'>
                  <div className='w-[100px]'>Giảm giá:</div>
                  <div className='text-xl text-red-500'>
                    {discountPrice.toLocaleString('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    })}
                  </div>
                </div>
              )}
              <div className='mt-10 flex items-start gap-4 text-white'>
                <div className='w-[100px]'>Tổng tiền sau thuế 10%:</div>
                <div className='text-xl'>
                  {totalPrice.toLocaleString('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='h-fit w-full bg-[#cdc197]'>
          <div className='mx-auto flex w-[1000px] items-center justify-between p-6'>
            <Link to={paths.userPaths.showtimes} className='flex items-center'>
              <div className='mr-2 flex items-center justify-center'>
                <FaArrowLeft />
              </div>
              <div className='font-semibold'>Trở lại</div>
            </Link>
            <div className='cursor-pointer'>
              <div className='flex items-center'>
                <div className='mr-2 flex items-center justify-center'>
                  <FaArrowRight />
                </div>
                <button
                  type='button'
                  onClick={handleProceedToCheckout}
                  className='font-semibold'
                >
                  Tiếp tục
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return content
}

export default ShowtimeDetails
