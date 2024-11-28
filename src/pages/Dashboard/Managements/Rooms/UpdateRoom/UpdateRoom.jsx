import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { HashLoader } from 'react-spinners'
import Swal from 'sweetalert2'
import nProgress from 'nprogress'

import { paths } from '~/utils/paths'
import { useUpdateRoomMutation, useGetRoomQuery } from '~/services/room.service'
import { useGetCinemasQuery } from '~/services/cinema.service'
import { FormInputGroup } from '~/components'
import useTitle from '~/hooks/useTitle'

const UpdateRoom = () => {
  useTitle('Admin | Cập nhật phòng')
  const { id } = useParams()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm()

  const {
    data: room,
    isLoading: isLoadingRoom,
    isSuccess: isSuccessRoom,
    refetch: refetchRoom,
  } = useGetRoomQuery(id)

  const {
    data: cinemas,
    isLoading: isLoadingCinemas,
    isSuccess: isSuccessCinemas,
    refetch: refetchCinema,
  } = useGetCinemasQuery({})

  useEffect(() => {
    if (room?.data) {
      setValue('name', room?.data?.name)
      setValue('opacity', room?.data?.opacity)
      setValue('status', room?.data?.status)
      setValue('cinemaId', room?.data?.cinemaId?._id)
    }
  }, [setValue, room])

  useEffect(() => {
    refetchCinema()
    refetchRoom()
  }, [refetchCinema, refetchRoom])

  const [updateApi, { isLoading: isLoadingUpdate }] = useUpdateRoomMutation()

  const handleUpdate = async (reqBody) => {
    try {
      const { name, opacity, status, cinemaId } = reqBody

      const response = await updateApi({
        id,
        name,
        opacity,
        status,
        cinemaId,
      }).unwrap()

      Swal.fire('Thành công', response.message, 'success')
      navigate(paths.dashboardPaths.managements.rooms.list)
    } catch (error) {
      Swal.fire('Thất bại', error?.data?.message, 'error')
    } finally {
      nProgress.done()
    }
  }

  let content
  if (isLoadingRoom || isLoadingUpdate || isLoadingCinemas)
    content = <div>Loading...</div>
  if (isSuccessRoom || isSuccessCinemas) {
    content = (
      <div className='relative h-fit w-full rounded-xl border bg-white p-4 shadow-md'>
        <div className='mb-5 rounded-xl bg-[#289ae7] py-5 text-center text-xl font-semibold capitalize text-white'>
          cập nhật phòng
        </div>
        <form
          onSubmit={handleSubmit(handleUpdate)}
          className='mx-auto w-[500px]'
        >
          <FormInputGroup
            register={register}
            errors={errors}
            validation={{
              required: 'Vui lòng nhập tên!',
            }}
            labelChildren='name'
            htmlFor='name'
            id='name'
            placeholder='Vui lòng nhập tên rạp'
            type='text'
            name='name'
          />

          <FormInputGroup
            register={register}
            errors={errors}
            validation={{
              required: 'Vui lòng sức chứa phòng!',
              pattern: {
                value: /^\d+$/,
                message: 'Chỉ được nhập số',
              },
            }}
            labelChildren='opacity'
            htmlFor='opacity'
            id='opacity'
            placeholder='Vui lòng sức chứa phòng'
            type='text'
            name='opacity'
          />

          <div className='mb-5 flex flex-col'>
            <label htmlFor='status' className='mb-1 font-semibold capitalize'>
              tình trạng
            </label>
            <select
              {...register('status', {
                required: 'Vui lòng chọn tình trạng',
              })}
              id='status'
              name='status'
              className='p-2 capitalize'
            >
              <option value=''>Chọn tình trạng</option>
              <option value='có sẵn'>có sẵn</option>
              <option value='bảo trì'>bảo trì</option>
            </select>
          </div>

          <div className='mb-5 flex flex-col'>
            <label htmlFor='cinemaId' className='mb-1 font-semibold capitalize'>
              rạp
            </label>
            <select
              {...register('cinemaId', {
                required: 'Vui lòng chọn rạp',
              })}
              id='cinemaId'
              name='cinemaId'
              className='p-2 capitalize'
            >
              <option value=''>Chọn rạp</option>
              {cinemas?.data?.map((item, index) => (
                <option key={index} value={item._id}>
                  {item.name}
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

export default UpdateRoom
