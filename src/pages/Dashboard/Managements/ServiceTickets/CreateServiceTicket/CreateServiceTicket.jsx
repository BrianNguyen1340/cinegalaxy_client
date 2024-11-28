import { useForm } from 'react-hook-form'
import nProgress from 'nprogress'
import Swal from 'sweetalert2'

import { useGetProductsQuery } from '~/services/product.service'
import { useCreateServiceTicketMutation } from '~/services/serviceTicket.service'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { paths } from '~/utils/paths'
import useTitle from '~/hooks/useTitle'
import { useNavigate } from 'react-router-dom'

const CreateServiceTicket = () => {
  useTitle('Cashier | Tạo vé bán sản phẩm')
  const { user } = useSelector((state) => state.user)
  const navigate = useNavigate()

  const {
    handleSubmit,
    formState: { errors },
  } = useForm()

  const { data: products, isLoading } = useGetProductsQuery({})
  const [selectedProducts, setSelectedProducts] = useState([])
  const [cashReceived, setCashReceived] = useState()

  const calculateTotal = (quantity, price) => quantity * price

  const totalPrice = selectedProducts.reduce((sum, item) => sum + item.total, 0)

  const changeAmount = cashReceived - totalPrice

  const handleQuantityChange = (productId, quantity) => {
    const product = products?.data?.find((p) => p._id === productId)
    if (product) {
      const updatedProduct = {
        product: productId,
        name: product.name,
        quantity,
        total: calculateTotal(quantity, product.price),
      }
      setSelectedProducts((prev) =>
        prev.some((item) => item.product === productId)
          ? prev.map((item) =>
              item.product === productId ? updatedProduct : item,
            )
          : [...prev, updatedProduct],
      )
    }
  }

  const resetForm = () => {
    setSelectedProducts([])
    setCashReceived(0)
  }

  const [createApi] = useCreateServiceTicketMutation()

  const handleCreate = async () => {
    try {
      nProgress.start()

      const data = {
        createdBy: user?._id,
        cinemaId: user?.cinemaId,
        cashReceived,
        products: selectedProducts,
      }

      const response = await createApi(data).unwrap()

      Swal.fire('Thành công', response.message, 'success')
      navigate(paths.dashboardPaths.managements.serviceTickets.list)
      resetForm()
    } catch (error) {
      Swal.fire('Thất bại', error?.data?.message, 'error')
    } finally {
      nProgress.done()
    }
  }

  return (
    <div className='relative h-fit w-full rounded-xl border bg-white p-4 shadow-md'>
      <div className='mb-5 rounded-xl bg-[#289ae7] py-5 text-center text-xl font-semibold capitalize text-white'>
        tạo vé dịch vụ
      </div>

      <form onSubmit={handleSubmit(handleCreate)} className='mx-auto w-[500px]'>
        {isLoading ? (
          <p>Đang tải sản phẩm...</p>
        ) : (
          <>
            {products?.data?.map((product) => (
              <div
                key={product._id}
                className='mb-4 flex flex-col gap-2 border-b pb-4'
              >
                <div className='flex items-center gap-4'>
                  <img
                    src={product.imageURL}
                    alt='image product'
                    className='w-[100px] rounded'
                  />
                  <p className='flex-1 font-semibold capitalize'>
                    {product.name}
                  </p>
                  <p className='flex-1 text-right'>
                    {product.price.toLocaleString()} đ
                  </p>
                  <input
                    type='number'
                    min='0'
                    className='w-16 rounded border px-2 py-1 text-right outline-none'
                    onChange={(e) =>
                      handleQuantityChange(product._id, +e.target.value || 0)
                    }
                  />
                </div>
                <div className='mt-2 text-right text-sm font-medium text-gray-600'>
                  Tổng tiền sản phẩm:{' '}
                  {(
                    selectedProducts.find(
                      (item) => item.product === product._id,
                    )?.total || 0
                  ).toLocaleString()}{' '}
                  đ
                </div>
              </div>
            ))}
            <div className='mt-5'>
              <p className='text-lg font-semibold'>
                Tổng tiền: {totalPrice.toLocaleString()} đ
              </p>
            </div>
            <div className='mt-4'>
              <label htmlFor='cashReceived' className='block text-sm'>
                Tiền khách đưa:
              </label>
              <input
                type='text'
                id='cashReceived'
                className='mt-1 w-full rounded border px-2 py-1 outline-none'
                value={cashReceived}
                onChange={(e) => setCashReceived(e.target.value)}
              />
              {errors.cashReceived && (
                <span className='pl-3 text-sm italic text-[red]'>
                  {errors?.cashReceived?.message}
                </span>
              )}
            </div>
            <div className='mt-4'>
              <p className='text-lg font-semibold'>
                Tiền thối lại:{' '}
                {changeAmount >= 0
                  ? `${changeAmount.toLocaleString()} đ`
                  : 'Không đủ tiền!'}
              </p>
            </div>
            <button
              type='submit'
              disabled={changeAmount < 0 || totalPrice === 0}
              className='mt-6 w-full rounded bg-[#289ae7] py-2 text-white disabled:bg-gray-400'
            >
              Tạo vé
            </button>
          </>
        )}
      </form>
    </div>
  )
}

export default CreateServiceTicket
