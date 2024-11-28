import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { HashLoader } from 'react-spinners'
import { FaRegStar } from 'react-icons/fa'
import Swal from 'sweetalert2'
import nProgress from 'nprogress'

import { useCreateSeatMutation } from '~/services/seat.service'
import { useGetRoomsQuery } from '~/services/room.service'
import { paths } from '~/utils/paths'
import { FormInputGroup } from '~/components'
import useTitle from '~/hooks/useTitle'

const CreateSeat = () => {
  useTitle('Admin | Tạp ghế')
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const {
    data: rooms,
    isLoading: isLoadingRooms,
    isSuccess: isSuccessRooms,
    refetch: refetchRooms,
  } = useGetRoomsQuery({})

  useEffect(() => {
    refetchRooms()
  }, [refetchRooms])

  const [createApi, { isLoading: isLoadingCreate }] = useCreateSeatMutation()

  const handleCreate = async (reqBody) => {
    try {
      nProgress.start()
      const { row, number, type, price, roomId } = reqBody

      const response = await createApi({
        row,
        number,
        type,
        price,
        roomId,
      }).unwrap()

      // Swal.fire('Thành công', response.message, 'success')
      // navigate(paths.dashboardPaths.managements.seats.list)
    } catch (error) {
      Swal.fire('Thất bại', error?.data?.message, 'error')
    } finally {
      nProgress.done()
    }
  }

  let content
  if (isLoadingRooms) content = <div>Loading...</div>
  if (isSuccessRooms) {
    content = (
      <div className='relative h-fit w-full rounded-xl border bg-white p-4 shadow-md'>
        <div className='mb-5 rounded-xl bg-[#289ae7] py-5 text-center text-xl font-semibold capitalize text-white'>
          tạo ghế
        </div>
        <form
          onSubmit={handleSubmit(handleCreate)}
          className='mx-auto w-[500px]'
        >
          <div className='mb-5 flex flex-col'>
            <label className='mb-1 font-semibold capitalize'>hàng ghế</label>
            <select
              {...register('row', {
                required: 'Vui lòng chọn hàng ghế',
              })}
              id='row'
              name='row'
              className='p-2 capitalize'
            >
              <option value=''>Chọn hàng ghế</option>
              <option value='A'>A</option>
              <option value='B'>B</option>
              <option value='C'>C</option>
              <option value='D'>D</option>
              <option value='E'>E</option>
              <option value='F'>F</option>
              <option value='G'>G</option>
              <option value='H'>H</option>
              <option value='I'>I</option>
              <option value='J'>J</option>
            </select>
          </div>

          <FormInputGroup
            register={register}
            errors={errors}
            validation={{
              required: 'Vui lòng nhập số ghế!',
            }}
            labelChildren='số ghế'
            htmlFor='number'
            id='number'
            placeholder='Vui lòng nhập số ghế'
            type='text'
            name='number'
            icon={<FaRegStar color='red' />}
          />

          <div className='mb-5 flex flex-col'>
            <label htmlFor='subtitle' className='mb-1 font-semibold capitalize'>
              loại ghế
            </label>
            <select
              {...register('type', {
                required: 'Vui lòng chọn loại ghế',
              })}
              id='type'
              name='type'
              className='p-2 capitalize'
            >
              <option value=''>Chọn loại ghế</option>
              <option value='Standard'>Standard</option>
              <option value='Vip'>Vip</option>
              <option value='Kid'>Kid</option>
              <option value='Couple'>Couple</option>
            </select>
          </div>

          <FormInputGroup
            register={register}
            errors={errors}
            validation={{
              required: 'Vui lòng nhập giá tiền ghế!',
            }}
            labelChildren='giá tiền ghế'
            htmlFor='price'
            id='price'
            placeholder='Vui lòng nhập giá tiền ghế'
            type='text'
            name='price'
            icon={<FaRegStar color='red' />}
          />

          <div className='mb-5 flex flex-col'>
            <label htmlFor='roomId' className='mb-1 font-semibold capitalize'>
              phòng
            </label>
            <select
              {...register('roomId', {
                required: 'Vui lòng chọn loại ghế',
              })}
              id='roomId'
              name='roomId'
              className='p-2 capitalize'
            >
              <option value=''>Chọn phòng</option>
              {rooms?.data?.map((room, index) => (
                <option key={index} value={room._id}>
                  {room.name} - {room.cinemaId.name}
                </option>
              ))}
            </select>
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

export default CreateSeat
