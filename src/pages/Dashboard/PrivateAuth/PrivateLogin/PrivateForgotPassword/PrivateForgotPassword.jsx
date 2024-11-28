/* eslint-disable react-hooks/rules-of-hooks */
import { Navigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Mail } from 'lucide-react'
import { HashLoader } from 'react-spinners'
import Swal from 'sweetalert2'
import nProgress from 'nprogress'

import { useForgotPasswordMutation } from '~/services/auth.service'
import { paths } from '~/utils/paths'
import { FormInputGroup } from '~/components'
import useTitle from '~/hooks/useTitle'
import { useSelector } from 'react-redux'

const PrivateForgotPassword = () => {
  useTitle('Quên mật khẩu panel')

  const { isAuthenticated, user } = useSelector((state) => state.user)

  if (isAuthenticated && user) {
    return <Navigate to={paths.dashboardPaths.dashboard} />
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const [forgotPasswordApi, { isLoading: isLoadingForgotPassword }] =
    useForgotPasswordMutation()

  const handleForgotPassword = async (reqBody) => {
    try {
      const { email } = reqBody
      nProgress.start()

      const response = await forgotPasswordApi({ email }).unwrap()

      Swal.fire('Thành công', response.message, 'success')
    } catch (error) {
      Swal.fire('Thất bại', error?.data?.message, 'error')
    } finally {
      nProgress.done()
    }
  }

  return (
    <div className='relative flex h-screen w-full items-center justify-center'>
      <div className='relative flex h-full w-full flex-col items-center justify-center'>
        <div className='w-[280px] 400px:w-[400px] 600px:w-[500px]'>
          <div className='mb-[30px] text-center text-xl font-semibold capitalize'>
            quên mật khẩu
          </div>
        </div>
        <form
          onSubmit={handleSubmit(handleForgotPassword)}
          className='flex w-[280px] flex-col gap-[10px] 400px:w-[400px] 600px:w-[500px]'
        >
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
            icon={<Mail />}
          />
          <button
            type='submit'
            className='flex w-full cursor-pointer items-center justify-center rounded-[40px] bg-[#f97417] p-5 text-base font-semibold capitalize text-white transition duration-300 hover:opacity-80'
            disabled={isLoadingForgotPassword ? true : false}
          >
            <div className='flex items-center justify-center gap-[10px]'>
              {isLoadingForgotPassword && <HashLoader size='20' color='#fff' />}
              <span>
                {isLoadingForgotPassword
                  ? 'Đang gửi yêu cầu'
                  : 'Xác nhận email'}
              </span>
            </div>
          </button>
        </form>
      </div>
    </div>
  )
}

export default PrivateForgotPassword
