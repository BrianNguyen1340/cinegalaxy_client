import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { HashLoader } from 'react-spinners'
import { DayPicker } from 'react-day-picker'
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
    setValue,
  } = useForm()
  const [createApi, { isLoading: isLoadingCreate }] =
    useCreatePromotionMutation()

  const [endDate, setEndDate] = useState()
  const handleEndDateChange = (date) => {
    setEndDate(date)
    setValue('endDate', date, { shouldValidate: true })
  }

  const [promotionType, setPromotionType] = useState('')

  const handleCreate = async (reqBody) => {
    try {
      nProgress.start()
      
      const { type, value, description, endDate } = reqBody

      const response = await createApi({
        createdBy: user._id,
        name: randomString(10),
        type,
        value,
        description,
        startDate: new Date(),
        endDate,
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

        <div className='mb-5'>
          <label htmlFor='releaseDate' className='font-semibold capitalize'>
            Chọn ngày hết hạn
          </label>
          <DayPicker
            {...register('endDate', {
              required: 'Vui lòng chọn ngày hết hạn',
            })}
            id='endDate'
            mode='single'
            selected={endDate}
            onSelect={(date) => handleEndDateChange(date)}
          />
          {errors.endDate && (
            <div className='mt-1 pl-3 text-sm italic text-[red]'>
              {errors.endDate.message}
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

export default CreatePromotion