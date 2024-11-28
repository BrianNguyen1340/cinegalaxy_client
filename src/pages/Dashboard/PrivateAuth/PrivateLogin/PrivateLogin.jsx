/* eslint-disable react/no-children-prop */
/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { HashLoader } from 'react-spinners'
import Swal from 'sweetalert2'
import nProgress from 'nprogress'

import { useLoginMutation } from '~/services/auth.service'
import { setCredentials } from '~/redux/reducers/user.reducer'
import { paths } from '~/utils/paths'
import { FormInputGroup } from '~/components'
import useTitle from '~/hooks/useTitle'
import { useDispatch, useSelector } from 'react-redux'

const PrivateLogin = () => {
  useTitle('Đăng nhập panel')

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { user } = useSelector((state) => state.user)
  if (user) {
    return <Navigate to={paths.dashboardPaths.dashboard} replace />
  }

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

      if (data.role === 3) {
        Swal.fire('Warning!', 'Access Denied!', 'error')
        return
      }

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

      navigate(paths.dashboardPaths.dashboard)
    } catch (error) {
      console.log(error)
      Swal.fire('Thất bại', error?.data?.message || error?.message, 'error')
    } finally {
      nProgress.done()
    }
  }

  return (
    <div className='relative flex h-screen w-full items-center justify-center bg-white'>
      <div className='bordert-2 w-[500px] rounded-[20px] border-l-2 border-r-2 border-[#eee] p-5 shadow-md'>
        <div className='mb-[30px] text-center text-xl font-semibold capitalize'>
          login panel
        </div>
        <form onSubmit={handleSubmit(handleLogin)}>
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
                    to={paths.userPaths.privateForgotPassword}
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
                {showHidePassword ? <Eye size='20' /> : <EyeOff size='20' />}
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
              {isLoading && <HashLoader size='20' color='#fff' />}
              <span>{isLoading ? 'Đang đăng nhập' : 'Đăng nhập'}</span>
            </div>
          </button>
        </form>
      </div>
    </div>
  )
}

export default PrivateLogin
