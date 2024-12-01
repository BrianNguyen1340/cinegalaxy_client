import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { HashLoader } from 'react-spinners'
import Swal from 'sweetalert2'
import nProgress from 'nprogress'

import { paths } from '~/utils/paths'
import { useCreatePromotionMutation } from '~/services/promotion.service'
import { FormInputGroup } from '~/components'
import { randomString } from '~/utils/randomString'
import useTitle from '~/hooks/useTitle'
import { useSelector } from 'react-redux'

const CreatePromotion = () => {
  useTitle('Manager | Tạo mã khuyến mãi')
  const { user } = useSelector((state) => state.user)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const [createApi, { isLoading: isLoadingCreate }] =
    useCreatePromotionMutation()

  const handleCreate = async (reqBody) => {
    try {
      nProgress.start()

      const { type, value, description } = reqBody

      const response = await createApi({
        createdBy: user._id,
        cinemaId: user.cinemaId,
        name: randomString(10),
        type,
        value,
        description,
      }).unwrap()

      Swal.fire('', response.message, 'success')
      navigate(paths.dashboardPaths.managements.promotions.list)
    } catch (error) {
      Swal.fire('Thất bại', error?.data?.message, 'error')
    } finally {
      nProgress.done()
    }
  }

  return (
    <div className='relative h-fit w-full rounded-xl border bg-white p-4 shadow-md'>
      <div className='mb-5 rounded-xl bg-[#289ae7] py-5 text-center text-xl font-semibold capitalize text-white'>
        tạp mã khuyến mãi
      </div>

      <form onSubmit={handleSubmit(handleCreate)} className='mx-auto w-[500px]'>
        <div className='mb-4'>
          <label
            htmlFor='type'
            className='mb-2 block text-sm font-medium text-gray-700'
          >
            Loại khuyến mãi
          </label>
          <select
            id='type'
            {...register('type', {
              required: 'Vui lòng chọn loại khuyến mãi!',
            })}
            className='block w-full rounded border px-3 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500'
            name='type'
          >
            <option value=''>Chọn loại</option>
            <option value='percentage'>Giảm theo phần trăm</option>
            <option value='fixed'>Giảm theo giá cố định</option>
          </select>
          {errors.type && (
            <p className='mt-1 text-sm text-red-600'>{errors.type.message}</p>
          )}
        </div>

        <FormInputGroup
          register={register}
          errors={errors}
          validation={{
            required: 'Vui lòng nhập giá trị!',
          }}
          labelChildren='giá trị'
          htmlFor='value'
          id='value'
          placeholder='Nhập giá trị giảm'
          type='number'
          name='value'
        />

        <div className='mb-5'>
          <label
            htmlFor='description'
            className='mb-1 block font-semibold capitalize'
          >
            mô tả
          </label>
          <textarea
            id='description'
            name='description'
            className='h-[300px] w-full rounded border-2 p-3 text-base outline-none'
          />
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

export default CreatePromotion
