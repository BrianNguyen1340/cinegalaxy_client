/* eslint-disable react/no-children-prop */
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { HashLoader } from 'react-spinners'
import { Eye, EyeOff } from 'lucide-react'
import nProgress from 'nprogress'
import Swal from 'sweetalert2'

import { useCreateUserMutation } from '~/services/user.service'
import { paths } from '~/utils/paths'
import { FormInputGroup, PasswordStrength } from '~/components'
import useTitle from '~/hooks/useTitle'

const CreateAccount = () => {
  useTitle('Admin | Tạo tài khoản người dùng')
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm()

  const password = watch('password')

  const [showHidePassword, setShowHidePassword] = useState(false)
  const handleShowHidePassword = () => {
    setShowHidePassword((prevState) => !prevState)
  }

  const [createApi, { isLoading: isLoadingCreate }] = useCreateUserMutation()

  const handleCreate = async (reqBody) => {
    try {
      nProgress.start()
      const { email, name, password } = reqBody

      const response = await createApi({
        email,
        name,
        password,
      }).unwrap()

      Swal.fire('Thành công', response.message, 'success')
      navigate(paths.dashboardPaths.managements.accounts.list)
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

export default CreateAccount
