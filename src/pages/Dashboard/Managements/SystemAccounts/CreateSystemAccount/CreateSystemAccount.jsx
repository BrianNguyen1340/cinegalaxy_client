/* eslint-disable react/no-children-prop */
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { HashLoader } from 'react-spinners'
import { Eye, EyeOff } from 'lucide-react'
import nProgress from 'nprogress'
import Swal from 'sweetalert2'

import { useCreateEmployeeMutation } from '~/services/user.service'
import { useGetCinemasQuery } from '~/services/cinema.service'
import { paths } from '~/utils/paths'
import { FormInputGroup, PasswordStrength } from '~/components'
import useTitle from '~/hooks/useTitle'

const CreateSystemAccount = () => {
  useTitle('Admin | Tạo tài khoản hệ thống')
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm()

  const { data: cinemas } = useGetCinemasQuery({})

  const password = watch('password')

  const [showHidePassword, setShowHidePassword] = useState(false)
  const handleShowHidePassword = () => {
    setShowHidePassword((prevState) => !prevState)
  }

  const [createApi, { isLoading: isLoadingCreate }] =
    useCreateEmployeeMutation()

  const handleCreate = async (reqBody) => {
    try {
      nProgress.start()
      const { email, name, password, role, cinemaId } = reqBody

      const response = await createApi({
        email,
        name,
        password,
        role,
        cinemaId,
      }).unwrap()

      Swal.fire('Thành công', response.message, 'success')
      navigate(paths.dashboardPaths.managements.systemAccounts.list)
    } catch (error) {
      Swal.fire('Thất bại', error?.data?.message, 'error')
    } finally {
      nProgress.done()
    }
  }

  return (
    <div className='relative h-fit w-full rounded-xl border bg-white p-4 shadow-md'>
      <div className='mb-5 rounded-xl bg-[#289ae7] py-5 text-center text-xl font-semibold capitalize text-white'>
        tạo tài khoản
      </div>

      <form onSubmit={handleSubmit(handleCreate)} className='mx-auto w-[500px]'>
        <FormInputGroup
          register={register}
          errors={errors}
          validation={{
            required: 'Vui lòng nhập tên người dùng!',
          }}
          labelChildren='tên người dùng'
          htmlFor='name'
          id='name'
          placeholder='Vui lòng nhập tên người dùng'
          type='text'
          name='name'
        />

        <FormInputGroup
          register={register}
          errors={errors}
          validation={{
            required: 'Vui lòng nhập email!',
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: 'Vui lòng nhập đúng định dạng email!',
            },
          }}
          htmlFor='email'
          labelChildren='email'
          type='text'
          id='email'
          name='email'
          placeholder='example@.com'
        />

        <FormInputGroup
          register={register}
          errors={errors}
          validation={{
            required: 'Vui lòng nhập mật khẩu!',
          }}
          htmlFor='password'
          labelChildren='mật khẩu'
          type={showHidePassword ? 'text' : 'password'}
          id='password'
          name='password'
          children={
            <button
              type='button'
              className='absolute right-3 top-[50%] z-10 flex translate-y-[-50%] cursor-pointer items-center justify-center rounded-full bg-white p-3'
              onClick={handleShowHidePassword}
            >
              {showHidePassword ? <Eye size='18' /> : <EyeOff size='18' />}
            </button>
          }
          placeholder='Vui lòng nhập mật khẩu'
        />
        <PasswordStrength password={password} />

        <div className='mb-5 flex flex-col'>
          <label htmlFor='role' className='mb-1 font-semibold capitalize'>
            vai trò
          </label>
          <select
            {...register('role', {
              required: 'Vui lòng chọn vai trò!',
            })}
            id='role'
            name='role'
            className='p-2 capitalize'
          >
            <option value=''>Chọn vai trò</option>
            <option value='1'>1</option>
            <option value='2'>2</option>
          </select>
          {errors.role && (
            <div className='mt-1 pl-3 text-sm italic text-[red]'>
              {errors.role.message}
            </div>
          )}
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
              <option key={index} value={item._id} className='capitalize'>
                {item.name}
              </option>
            ))}
          </select>
          {errors.cinemaId && (
            <span className='pl-3 text-sm italic text-[red]'>
              {errors.cinemaId.message}
            </span>
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

export default CreateSystemAccount
