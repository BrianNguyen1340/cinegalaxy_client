/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/no-children-prop */
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Eye, EyeOff } from 'lucide-react'
import { HashLoader } from 'react-spinners'
import Swal from 'sweetalert2'
import nProgress from 'nprogress'

import { FormInputGroup, GoogleAuth } from '~/components'
import { useLoginMutation } from '~/services/auth.service'
import { paths } from '~/utils/paths'
import { setCredentials } from '~/redux/reducers/user.reducer'
import useTitle from '~/hooks/useTitle'

const Login = () => {
  useTitle('Đăng nhập')
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

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const [loginApi, { isLoading }] = useLoginMutation()

  const [showHidePassword, setShowHidePassword] = useState(false)
  const handleShowHidePassword = () => {
    setShowHidePassword((prevState) => !prevState)
  }

  const handleLogin = async (reqBody) => {
    try {
      nProgress.start()

      const { email, password } = reqBody

      const { accessToken, data, message } = await loginApi({
        email,
        password,
      }).unwrap()

      dispatch(
        setCredentials({
          user: data,
          token: accessToken,
        }),
      )

      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: message,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      })

      navigate(paths.userPaths.home)
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
          src='videos/login-video.mp4'
          autoPlay
          loop
          muted
          className='block h-full w-[500px] object-cover'
          poster='images/register_bg.jpg'
        />
      </div>
      <div className='relative mx-auto flex h-full w-[500px] flex-col items-center justify-center'>
        <div className='w-full px-4'>
          <div className='mb-7 text-center text-xl font-semibold capitalize'>
            đăng nhập tài khoản
          </div>
          <GoogleAuth />
          <div className='relative my-4 flex items-center'>
            <hr className='flex-grow border-t border-gray-400' />
            <span className='mx-4 bg-white px-4 text-sm font-semibold text-gray-600'>
              OR
            </span>
            <hr className='flex-grow border-t border-gray-400' />
          </div>
        </div>

        <form
          onSubmit={handleSubmit(handleLogin)}
          className='relative flex w-full flex-col gap-3 px-4'
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
            labelChildren={
              <div className='flex items-center justify-between'>
                <div>Email</div>
                <div>
                  <Link
                    to={paths.userPaths.forgotPassword}
                    className='italic hover:text-[red] hover:underline hover:opacity-80'
                  >
                    quên mật khẩu?
                  </Link>
                </div>
              </div>
            }
            type='text'
            id='email'
            name='email'
            placeholder='example@gmail.com'
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
                {showHidePassword ? <Eye size='16' /> : <EyeOff size='16' />}
              </button>
            }
            placeholder='Vui lòng nhập mật khẩu!'
          />

          <button
            type='submit'
            disabled={isLoading ? true : false}
            className='flex w-full cursor-pointer items-center justify-center rounded-[40px] bg-[#f97417] p-5 text-base font-semibold capitalize text-white transition duration-300 hover:opacity-80'
          >
            <div className='flex items-center justify-center gap-[10px]'>
              {isLoading && <HashLoader size='16' color='#fff' />}
              <span>{isLoading ? 'Đang đăng nhập' : 'Đăng nhập'}</span>
            </div>
          </button>
          <p className='mt-3 text-center'>
            Đã có tài khoản?
            <Link
              to={paths.userPaths.register}
              className='ml-1 capitalize underline transition duration-300 hover:text-[red]'
            >
              đăng ký
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login
