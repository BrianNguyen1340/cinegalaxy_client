import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { HashLoader } from 'react-spinners'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import nProgress from 'nprogress'

import { useCreateRoomMutation } from '~/services/room.service'
import { useGetCinemasQuery } from '~/services/cinema.service'
import { paths } from '~/utils/paths'
import { FormInputGroup } from '~/components'
import useTitle from '~/hooks/useTitle'

const CreateRoom = () => {
  useTitle('Admin | Tạo phòng')
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const {
    data: cinemas,
    isLoading: isLoadingCinemas,
    isSuccess: isSuccessCinemas,
    refetch: refetchCinemas,
  } = useGetCinemasQuery({})

  useEffect(() => {
    refetchCinemas()
  }, [refetchCinemas])

  const [createApi, { isLoading: isLoadingCreate }] = useCreateRoomMutation()

  const handleCreate = async (reqBody) => {
    try {
      nProgress.start()
      const { name, opacity, status, cinemaId } = reqBody

      const response = await createApi({
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
  if (isLoadingCinemas) content = <div>Loading...</div>
  if (isSuccessCinemas) {
    content = (
      <div className='relative h-fit w-full rounded-xl border bg-white p-4 shadow-md'>
        <div className='mb-5 rounded-xl bg-[#289ae7] py-5 text-center text-xl font-semibold capitalize text-white'>
          tạp phòng
        </div>

        <form
          onSubmit={handleSubmit(handleCreate)}
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
                  {item?.name}
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

export default CreateRoom
