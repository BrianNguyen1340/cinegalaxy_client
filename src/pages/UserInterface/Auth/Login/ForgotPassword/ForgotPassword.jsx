/* eslint-disable react-hooks/rules-of-hooks */
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { HashLoader } from 'react-spinners'
import Swal from 'sweetalert2'
import nProgress from 'nprogress'

import { paths } from '~/utils/paths'
import { FormInputGroup } from '~/components'
import { useForgotPasswordMutation } from '~/services/auth.service'
import useTitle from '~/hooks/useTitle'

const ForgotPassword = () => {
  useTitle('Quên mật khẩu')
  const { isAuthenticated, user } = useSelector((state) => state.user)
  if (isAuthenticated && user) {
    return <Navigate to={paths.userPaths.home} />
  }
  const isAuthorized =
    isAuthenticated &&
    (user?.role === 0 || user?.role === 1 || user?.role === 2)
  if (isAuthorized) {
    return <Navigate to={paths.dashboardPaths.dashboard} replace />
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
    <div className='relative flex h-screen w-full items-center justify-between overflow-x-hidden bg-white'>
      <div className='hidden h-full min-w-[500px] items-center justify-center 1200px:flex'>
        <video
          src='videos/forgot-password-video.mp4'
          autoPlay
          loop
          muted
          className='block h-full w-[500px] object-cover'
        />
      </div>
      <div className='relative mx-auto flex h-full w-[500px] flex-col items-center justify-center'>
        <div className='w-full px-4'>
          <div className='mb-[30px] text-center text-xl font-semibold capitalize'>
            quên mật khẩu
          </div>
          <div className='mb-[10px] text-sm 500px:text-base'>
            Nhập địa chỉ email bạn đã sử dụng khi đăng ký và chúng tôi sẽ gửi
            hướng dẫn để đặt lại mật khẩu cho bạn
          </div>
          <div className='mb-[20px] text-sm 500px:text-base'>
            Vì lý do bảo mật, chúng tôi <strong>KHÔNG</strong> lưu trữ mật khẩu
            của bạn. Vì vậy, hãy yên tâm rằng chúng tôi sẽ không bao giờ gửi mật
            khẩu của bạn qua email
          </div>
        </div>
        <form
          onSubmit={handleSubmit(handleForgotPassword)}
          className='relative flex w-full flex-col gap-[10px] px-4'
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

export default ForgotPassword
