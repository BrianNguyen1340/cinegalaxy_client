import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { HashLoader } from 'react-spinners'
import Swal from 'sweetalert2'
import nProgress from 'nprogress'

import { randomString } from '~/utils/randomString'
import { paths } from '~/utils/paths'
import { FormInputGroup } from '~/components'
import {
  useUpdatePromotionMutation,
  useGetPromotionQuery,
} from '~/services/promotion.service'

const UpdatePromotion = () => {
  const { user } = useSelector((state) => state.user)
  const { id } = useParams()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm()
  const [updateApi, { isLoading: isLoadingUpdate }] =
    useUpdatePromotionMutation()

  const { data: promotion, refetch } = useGetPromotionQuery(id)

  useEffect(() => {
    if (promotion?.data) {
      setValue('type', promotion?.data?.type)
      setValue('value', promotion?.data?.value)
      setValue('endDate', promotion?.data?.endDate)
      setValue('description', promotion?.data?.description)
    }
  }, [promotion, setValue])

  useEffect(() => {
    refetch()
  }, [refetch])

  const [promotionType, setPromotionType] = useState('')

  const handleCreate = async (reqBody) => {
    try {
      nProgress.start()

      const { type, value, description } = reqBody

      const response = await updateApi({
        createdBy: user._id,
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

  const handlePromotionTypeChange = (e) => {
    const selectedType = e.target.value
    setPromotionType(selectedType)
    setValue('value', '')
  }

  return (
    <div className='relative h-fit w-full rounded-xl border bg-white p-4 shadow-md'>
      <div className='mb-5 rounded-xl bg-[#289ae7] py-5 text-center text-xl font-semibold capitalize text-white'>
        cập nhật mã khuyến mãi
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
            onChange={handlePromotionTypeChange}
            className='block w-full rounded border px-3 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500'
          >
            <option value=''>Chọn loại</option>
            <option value='percentage'>Giảm theo phần trăm</option>
            <option value='fixed'>Giảm theo giá cố định</option>
          </select>
          {errors.type && (
            <p className='mt-1 text-sm text-red-600'>{errors.type.message}</p>
          )}
        </div>
        {promotionType && (
          <div className='mb-4'>
            <FormInputGroup
              register={register}
              errors={errors}
              validation={{
                required: 'Vui lòng nhập giá trị!',
                pattern: {
                  value:
                    promotionType === 'percentage'
                      ? /^[1-9][0-9]?$|^100$/
                      : /^[1-9][0-9]*$/,
                  message:
                    promotionType === 'percentage'
                      ? 'Vui lòng nhập giá trị từ 1 đến 100!'
                      : 'Vui lòng nhập giá trị lớn hơn 0!',
                },
              }}
              labelChildren={
                promotionType === 'percentage'
                  ? 'Giá trị (%)'
                  : 'Giá trị giảm (VNĐ)'
              }
              htmlFor='value'
              id='value'
              placeholder={
                promotionType === 'percentage'
                  ? 'Nhập giá trị từ 1 đến 100'
                  : 'Nhập số tiền giảm'
              }
              type='number'
              name='value'
            />
          </div>
        )}

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

export default UpdatePromotion
