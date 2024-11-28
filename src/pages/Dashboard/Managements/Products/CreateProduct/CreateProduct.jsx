/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { HashLoader } from 'react-spinners'
import { FaCloudUploadAlt } from 'react-icons/fa'
import Swal from 'sweetalert2'
import nProgress from 'nprogress'

import { paths } from '~/utils/paths'
import {
  useCreateProductMutation,
  useUploadProductMutation,
} from '~/services/product.service'
import { useGetProductCategoriesQuery } from '~/services/productCategory.service'
import { FormInputGroup } from '~/components'
import useTitle from '~/hooks/useTitle'
import { useSelector } from 'react-redux'

const CreateProduct = () => {
  useTitle('Manager | Tạo sản phẩm')
  const { user } = useSelector((state) => state.user)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const {
    data: productCategories,
    isLoading: isLoadingProductCategories,
    isSuccess: isSuccessProductCategories,
    refetch: refetchProductCategories,
  } = useGetProductCategoriesQuery({})

  useEffect(() => {
    refetchProductCategories()
  }, [refetchProductCategories])

  const [image, setImage] = useState(null)
  const [imageURL, setImageURL] = useState(null)
  const [uploadApi] = useUploadProductMutation()
  const handleUploadProduct = async (event) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        Swal.fire('Thất bại', 'Không có tệp nào được chọn!', 'error')
        return
      }
      const selectedFile = event.target.files[0]
      const formData = new FormData()
      formData.append('image', selectedFile)
      const response = await uploadApi(formData).unwrap()
      setImage(response.image)
      setImageURL(response.image)
    } catch (error) {
      Swal.fire('Thất bại', 'Upload ảnh thất bại!', 'error')
    }
  }

  const [createApi, { isLoading: isLoadingCreate }] = useCreateProductMutation()

  const handleCreate = async (reqBody) => {
    try {
      nProgress.start()
      const { name, categoryId, price, size, description } = reqBody

      const response = await createApi({
        createdBy: user?._id,
        name,
        categoryId,
        price,
        size,
        imageURL,
        description,
      }).unwrap()

      Swal.fire('Thành công', response.message, 'success')
      navigate(paths.dashboardPaths.managements.products.list)
    } catch (error) {
      Swal.fire('Thất bại', error?.data?.message, 'error')
    } finally {
      nProgress.done()
    }
  }

  let content
  if (isLoadingProductCategories) content = <div>Loading...</div>
  if (isSuccessProductCategories) {
    content = (
      <div className='relative h-fit w-full rounded-xl border bg-white p-4 shadow-md'>
        <div className='mb-5 rounded-xl bg-[#289ae7] py-5 text-center text-xl font-semibold capitalize text-white'>
          tạo sản phẩm
        </div>

        <form
          onSubmit={handleSubmit(handleCreate)}
          className='mx-auto w-[500px]'
        >
          <FormInputGroup
            register={register}
            errors={errors}
            validation={{
              required: 'Vui lòng nhập tên sản phẩm!',
            }}
            labelChildren='tên sản phẩm'
            htmlFor='name'
            id='name'
            placeholder='Vui lòng nhập tên sản phẩm'
            type='text'
            name='name'
          />

          <div className='mb-5 flex flex-col'>
            <label
              htmlFor='categoryId'
              className='mb-1 font-semibold capitalize'
            >
              danh mục sản phẩm
            </label>
            <select
              {...register('categoryId', {
                required: 'Vui lòng chọn rạp',
              })}
              id='categoryId'
              name='categoryId'
              className='p-2 capitalize'
            >
              <option value=''>Chọn danh mục sản phẩm</option>
              {productCategories?.data?.map((item, index) => (
                <option key={index} value={item._id}>
                  {item?.name}
                </option>
              ))}
            </select>
          </div>

          <FormInputGroup
            register={register}
            errors={errors}
            validation={{
              required: 'Vui lòng nhập giá sản phẩm!',
            }}
            labelChildren='giá sản phẩm'
            htmlFor='price'
            id='price'
            placeholder='Vui lòng nhập giá sản phẩm'
            type='text'
            name='price'
          />

          <div className='mb-5 flex flex-col'>
            <label
              htmlFor='movieRating'
              className='mb-1 font-semibold capitalize'
            >
              Kích cỡ
            </label>
            <select
              {...register('size', {
                required: 'Vui lòng chọn phụ đề',
              })}
              id='size'
              name='size'
              className='p-2 capitalize'
            >
              <option value=''>Chọn kích cỡ</option>
              <option value='small'>small</option>
              <option value='medium'>medium</option>
              <option value='large'>large</option>
            </select>
          </div>

          <div className='mb-5 flex flex-col'>
            <label className='mb-1 font-semibold capitalize'>hình ảnh</label>
            <label htmlFor='imageURL' className='mb-1 font-semibold capitalize'>
              {image ? <></> : <FaCloudUploadAlt size='24' />}
            </label>
            <input
              {...register('imageURL', {
                required: 'Vui lòng chọn ảnh',
              })}
              type='file'
              id='imageURL'
              name='imageURL'
              accept='image/*'
              onChange={handleUploadProduct}
              className='hidden'
            />
            {errors.imageURL && (
              <div className='mb-1 text-sm text-[red]'>
                {errors.imageURL.message}
              </div>
            )}
            {imageURL ? (
              <img src={imageURL} alt='image preview' width={250} />
            ) : (
              <img src='images/movie.jpg' alt='image review' width={250} />
            )}
          </div>

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

  return content
}

export default CreateProduct
