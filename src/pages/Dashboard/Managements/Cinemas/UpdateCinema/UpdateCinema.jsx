import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { BeatLoader, HashLoader } from 'react-spinners'
import Swal from 'sweetalert2'
import nProgress from 'nprogress'

import {
  useGetCinemaQuery,
  useUpdateCinemaMutation,
} from '~/services/cinema.service'
import { useGetCinemaComplexesQuery } from '~/services/cinemaComplex.service'
import { paths } from '~/utils/paths'
import { FormInputGroup } from '~/components'
import useTitle from '~/hooks/useTitle'

const UpdateCinema = () => {
  useTitle('Admin | Cập nhật rạp')
  const { id } = useParams()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm()

  const {
    data: cinema,
    isLoading: isLoadingCinema,
    isSuccess: isSuccessCinema,
    refetch: refetchCinema,
  } = useGetCinemaQuery(id)

  const {
    data: cinemaComplexes,
    isLoading: isLoadingCinemaComplexes,
    isSuccess: isSuccessCinemaComplexes,
    refetch: refetchCinemaComplexes,
  } = useGetCinemaComplexesQuery({})

  useEffect(() => {
    if (cinema?.data) {
      setValue('name', cinema?.data?.name)
      setValue('phone', cinema?.data?.phone)
      setValue('address', cinema?.data?.address)
      setValue('phone', cinema?.data?.phone)
      setValue('cinemaComplexId', cinema?.data?.cinemaComplexId?._id)
    }
  }, [cinema, setValue])

  useEffect(() => {
    refetchCinema()
    refetchCinemaComplexes()
  }, [refetchCinema, refetchCinemaComplexes])

  const [updateApi, { isLoading: isLoadingUpdate }] = useUpdateCinemaMutation()

  const handleUpdate = async (reqBody) => {
    try {
      const { name, address, cinemaComplexId } = reqBody

      const response = await updateApi({
        id,
        name,
        address,
        phone: '0123456789',
        cinemaComplexId,
      }).unwrap()

      Swal.fire('Thành công', response.message, 'success')
      navigate(paths.dashboardPaths.managements.cinemas.list)
    } catch (error) {
      Swal.fire('Thất bại', error?.data?.message, 'error')
    } finally {
      nProgress.done()
    }
  }

  let content

  if (isLoadingCinema || isLoadingCinemaComplexes)
    content = (
      <div className='flex h-screen w-full items-center justify-center'>
        <BeatLoader />
      </div>
    )

  if (isSuccessCinema && isSuccessCinemaComplexes) {
    content = (
      <div className='relative h-fit w-full rounded-xl border bg-white p-4 shadow-md'>
        <div className='mb-5 rounded-xl bg-[#289ae7] py-5 text-center text-xl font-semibold capitalize text-white'>
          cập nhật rạp
        </div>

        <form
          onSubmit={handleSubmit(handleUpdate)}
          className='mx-auto w-[500px]'
        >
          <FormInputGroup
            register={register}
            errors={errors}
            validation={{ required: 'Vui lòng nhập tên!' }}
            htmlFor='name'
            labelChildren='name'
            type='text'
            id='name'
            name='name'
          />

          <FormInputGroup
            register={register}
            errors={errors}
            validation={{
              required: 'Vui lòng nhập địa chỉ rạp!',
            }}
            labelChildren='địa chỉ rạp'
            htmlFor='address'
            id='address'
            placeholder='Vui lòng nhập địa chỉ rạp'
            type='text'
            name='address'
          />

          <div className='mb-5 flex flex-col'>
            <label
              htmlFor='cinemaComplexId'
              className='mb-1 font-semibold capitalize'
            >
              cụm rạp
            </label>
            <select
              {...register('cinemaComplexId', {
                required: 'Vui lòng chọn cụm rạp',
              })}
              id='cinemaComplexId'
              name='cinemaComplexId'
              className='p-2 capitalize'
            >
              <option value=''>Chọn cụm rạp</option>
              {cinemaComplexes?.data?.map((item, index) => (
                <option key={index} value={item._id}>
                  {item?.name}
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

export default UpdateCinema
