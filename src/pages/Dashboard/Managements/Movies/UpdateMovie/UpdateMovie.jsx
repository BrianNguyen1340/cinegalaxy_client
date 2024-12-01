/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { FaCloudUploadAlt, FaRegStar } from 'react-icons/fa'
import { DayPicker } from 'react-day-picker'
import { BeatLoader, HashLoader } from 'react-spinners'
import Swal from 'sweetalert2'
import nProgress from 'nprogress'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'

import { useGetGenresQuery } from '~/services/genre.service'
import {
  useUpdateMovieMutation,
  useGetMovieQuery,
  useUploadBannerMovieMutation,
  useUploadPosterMovieMutation,
} from '~/services/movie.service'
import { paths } from '~/utils/paths'
import { FormInputGroup } from '~/components'
import useTitle from '~/hooks/useTitle'

const UpdateMovie = () => {
  useTitle('Admin | Cập nhật phim')
  const { id } = useParams()
  const navigate = useNavigate()
  const animatedComponents = makeAnimated()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm()

  const {
    data: genres,
    isLoading: isLoadingGenres,
    isSuccess: isSuccessGenres,
    refetch: refetchGenres,
  } = useGetGenresQuery({})

  const {
    data: movie,
    isLoading: isLoadingMovie,
    isSuccess: isSuccessMovie,
    refetch: refetchMovie,
  } = useGetMovieQuery(id)

  useEffect(() => {
    refetchGenres()
    refetchMovie()
  }, [refetchGenres, refetchMovie])

  const [releaseDate, setReleaseDate] = useState()

  const handleDateChange = (date) => {
    setReleaseDate(date)
    setValue('releaseDate', date, { shouldValidate: true })
  }

  const [selectedGenres, setSelectedGenres] = useState([])

  const [poster, setPoster] = useState(null)
  const [posterURL, setPosterURL] = useState(null)
  const [uploadPosterApi] = useUploadPosterMovieMutation()
  const handleUploadPoster = async (event) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        Swal.fire('Thất bại', 'Không có tệp nào được chọn!', 'error')
        return
      }
      const selectedFile = event.target.files[0]
      const formData = new FormData()
      formData.append('image', selectedFile)
      const response = await uploadPosterApi(formData).unwrap()
      setPoster(response.image)
      setPosterURL(response.image)
    } catch (error) {
      Swal.fire('Thất bại', 'Upload ảnh thất bại!', 'error')
    }
  }

  const [banner, setBanner] = useState(null)
  const [bannerURL, setBannerURL] = useState(null)
  const [uploadBannerApi] = useUploadBannerMovieMutation()
  const handleUploadBanner = async (event) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        Swal.fire('Thất bại', 'Không có tệp nào được chọn!', 'error')
        return
      }
      const selectedFile = event.target.files[0]
      const formData = new FormData()
      formData.append('image', selectedFile)
      const response = await uploadBannerApi(formData).unwrap()
      setBanner(response.image)
      setBannerURL(response.image)
    } catch (error) {
      Swal.fire('Thất bại', 'Upload ảnh thất bại!', 'error')
    }
  }

  useEffect(() => {
    if (movie?.data) {
      setValue('name', movie?.data?.name)
      setValue('description', movie?.data?.description)
      setValue('director', movie?.data?.director)
      setValue('duration', movie?.data?.duration)
      setValue('trailerURL', movie?.data?.trailerURL)
      setValue('ageRating', movie?.data?.ageRating)
      setValue('subtitle', movie?.data?.subtitle)
      setValue('movieFormat', movie?.data?.movieFormat)

      const movieReleaseDate = new Date(movie?.data?.releaseDate)
      setReleaseDate(movieReleaseDate)
      setValue('releaseDate', movieReleaseDate)

      setValue('posterURL', movie?.data?.posterURL)
      setPosterURL(movie?.data?.posterURL)

      setValue('bannerURL', movie?.data?.bannerURL)
      setBannerURL(movie?.data?.bannerURL)

      const defaultGenres = movie?.data?.genreIds?.map((genre) => ({
        value: genre._id,
        label: genre.name,
      }))
      setSelectedGenres(defaultGenres)
      setValue('genreIds', defaultGenres)
    }
  }, [movie, setValue, genres])

  const [updateApi, { isLoading: isLoadingUpdate }] = useUpdateMovieMutation()

  const handleUpdate = async (reqBody) => {
    try {
      nProgress.start()
      const {
        name,
        description,
        director,
        duration,
        trailerURL,
        ageRating,
        subtitle,
        movieFormat,
      } = reqBody

      // const currentDate = new Date()
      // if (new Date(releaseDate) < currentDate) {
      //   Swal.fire(
      //     '',
      //     'Ngày phát hành không được nhỏ hơn ngày hiện tại!',
      //     'error',
      //   )
      //   return
      // }

      const data = {
        id,
        name,
        description,
        director,
        releaseDate,
        duration,
        trailerURL,
        ageRating,
        subtitle,
        movieFormat,
        genres: selectedGenres.map((genre) => genre.value),
        posterURL,
        bannerURL,
      }

      const response = await updateApi(data).unwrap()

      Swal.fire('Thành công', response.message, 'success')
      navigate(paths.dashboardPaths.managements.movies.list)
    } catch (error) {
      Swal.fire('Thất bại', error?.data?.message, 'error')
    } finally {
      nProgress.done()
    }
  }

  let content

  if (isLoadingMovie || isLoadingGenres)
    content = (
      <div className='flex h-screen w-full items-center justify-center'>
        <BeatLoader />
      </div>
    )

  if (isSuccessMovie && isSuccessGenres) {
    content = (
      <div className='relative h-fit w-full rounded-xl border bg-white p-4 shadow-md'>
        <div className='mb-5 rounded-xl bg-[#289ae7] py-5 text-center text-xl font-semibold capitalize text-white'>
          cập nhật phim
        </div>

        <form
          onSubmit={handleSubmit(handleUpdate)}
          className='mx-auto w-[500px]'
        >
          <FormInputGroup
            register={register}
            errors={errors}
            validation={{
              required: 'Vui lòng nhập tên phim!',
            }}
            labelChildren='tên phim'
            htmlFor='name'
            id='name'
            placeholder='Vui lòng nhập tên phim'
            type='text'
            name='name'
            icon={<FaRegStar color='red' />}
          />

          <div className='mb-5 flex flex-col'>
            <label htmlFor='genres' className='mb-1 font-semibold capitalize'>
              thể loại phim
            </label>
            <Select
              id='genres'
              isMulti
              options={genres?.data?.map((genre) => ({
                value: genre._id,
                label: genre.name,
              }))}
              value={selectedGenres}
              onChange={(selectedOptions) => {
                setSelectedGenres(selectedOptions)
              }}
              classNamePrefix='select'
              placeholder='Chọn thể loại phim'
              components={animatedComponents}
            />
          </div>

          <FormInputGroup
            register={register}
            errors={errors}
            validation={{
              required: 'Vui lòng nhập tên đạo diễn!',
            }}
            labelChildren='đạo diễn'
            htmlFor='director'
            id='director'
            placeholder='Vui lòng nhập tên đạo diễn'
            type='text'
            name='director'
            icon={<FaRegStar color='red' />}
          />

          <div className='mb-5'>
            <label
              htmlFor='description'
              className='mb-1 font-semibold capitalize'
            >
              mô tả
            </label>
            <textarea
              {...register('description', {
                required: 'Vui lòng nhập mô tả',
              })}
              placeholder={movie?.description}
              id='description'
              name='description'
              className='h-[300px] w-full rounded border-2 p-3 text-base outline-none'
            />
          </div>

          <div className='mb-5'>
            <label
              htmlFor='releaseDate'
              className='mb-1 font-semibold capitalize'
            >
              Chọn ngày công chiếu
            </label>
            <DayPicker
              id='releaseDate'
              mode='single'
              selected={releaseDate}
              onSelect={(date) => handleDateChange(date)}
            />
          </div>

          <FormInputGroup
            register={register}
            errors={errors}
            validation={{
              required: 'Vui lòng nhập thời lượng phim!',
              pattern: {
                value: /^\d+$/,
                message: 'Chỉ được nhập số',
              },
            }}
            labelChildren='thời lượng phim'
            htmlFor='duration'
            id='duration'
            placeholder='Vui lòng nhập thời lượng phim'
            type='text'
            name='duration'
            icon={<FaRegStar color='red' />}
          />

          <div className='mb-5 flex flex-col'>
            <label className='mb-1 font-semibold capitalize'>poster</label>
            <label
              htmlFor='posterURL'
              className='mb-1 font-semibold capitalize'
            >
              {poster ? <></> : <FaCloudUploadAlt size='24' />}
            </label>
            <input
              type='file'
              id='posterURL'
              name='posterURL'
              accept='image/*'
              onChange={handleUploadPoster}
              className='hidden'
            />
            {posterURL ? (
              <img src={posterURL} alt='poster preview' width={250} />
            ) : (
              <img src='images/movie.jpg' alt='poster review' width={250} />
            )}
          </div>

          <div className='mb-5 flex flex-col'>
            <label className='mb-1 font-semibold capitalize'>banner</label>
            <label
              htmlFor='bannerURL'
              className='mb-1 font-semibold capitalize'
            >
              {banner ? <></> : <FaCloudUploadAlt size='24' />}
            </label>
            <input
              type='file'
              id='bannerURL'
              name='bannerURL'
              accept='image/*'
              onChange={handleUploadBanner}
              className='hidden'
            />
            {bannerURL ? (
              <img src={bannerURL} alt='banner preview' width={250} />
            ) : (
              <img src='images/movie.jpg' alt='banner preview' width={250} />
            )}
          </div>

          <div className='mb-5 flex flex-col'>
            <label
              htmlFor='movieFormat'
              className='mb-1 font-semibold capitalize'
            >
              định dạng phim
            </label>
            <select
              {...register('movieFormat', {
                required: 'Vui lòng chọn định dạng phim',
              })}
              id='movieFormat'
              name='movieFormat'
              className='p-2 capitalize'
            >
              <option value=''>Chọn định dạng phim</option>
              <option value='2D'>2D</option>
              <option value='3D'>3D</option>
            </select>
          </div>

          <div className='mb-5 flex flex-col'>
            <label htmlFor='subtitle' className='mb-1 font-semibold capitalize'>
              phụ đề
            </label>
            <select
              {...register('subtitle', {
                required: 'Vui lòng chọn phụ đề',
              })}
              id='subtitle'
              name='subtitle'
              className='p-2 capitalize'
            >
              <option value=''>Chọn phụ đề</option>
              <option value='Thuyết minh'>Thuyết minh</option>
              <option value='Phụ đề'>Phụ đề</option>
              <option value='Lồng tiếng'>Lồng tiếng</option>
            </select>
          </div>

          <div className='mb-5 flex flex-col'>
            <label
              htmlFor='ageRating'
              className='mb-1 font-semibold capitalize'
            >
              xếp hạng độ tuổi
            </label>
            <select
              {...register('ageRating', {
                required: 'Vui lòng chọn phụ đề',
              })}
              id='ageRating'
              name='ageRating'
              className='p-2 capitalize'
            >
              <option value=''>Chọn xếp hạng độ tuổi</option>
              <option value='P - Phổ biến'>P - Phổ biến</option>
              <option value='K - Dành cho trẻ em'>K - Dành cho trẻ em</option>
              <option value='C13 - Cấm khán giả dưới 13 tuổi'>
                C13 - Cấm khán giả dưới 13 tuổi
              </option>
              <option value='C16 - Cấm khán giả dưới 16 tuổi'>
                C16 - Cấm khán giả dưới 16 tuổi
              </option>
              <option value='C18 - Cấm khán giả dưới 18 tuổi'>
                C18 - Cấm khán giả dưới 18 tuổi
              </option>
            </select>
          </div>

          <FormInputGroup
            register={register}
            errors={errors}
            validation={{
              required: 'Vui lòng nhập trailer url!',
              pattern: {
                value:
                  /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i,
                message: 'Please enter a valid url!',
              },
            }}
            labelChildren='trailer'
            htmlFor='trailerURL'
            id='trailerURL'
            placeholder='Vui lòng nhập trailer url'
            type='text'
            name='trailerURL'
            icon={<FaRegStar color='red' />}
          />

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

export default UpdateMovie
