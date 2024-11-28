import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { HashLoader } from 'react-spinners'
import { FaCloudUploadAlt } from 'react-icons/fa'
import Swal from 'sweetalert2'
import nProgress from 'nprogress'

import {
  useUpdateProductMutation,
  useGetProductQuery,
  useUploadProductMutation,
} from '~/services/product.service'
import { useGetProductCategoriesQuery } from '~/services/productCategory.service'
import { paths } from '~/utils/paths'
import { FormInputGroup } from '~/components'
import useTitle from '~/hooks/useTitle'
import { useSelector } from 'react-redux'

const UpdateProduct = () => {
  useTitle('Manager | Cập nhật sản phẩm')
  const { id } = useParams()
  const { user } = useSelector((state) => state.user)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm()

  const {
    data: product,
    isLoading: isLoadingProduct,
    isSuccess: isSuccessProduct,
    refetch: refetchProduct,
  } = useGetProductQuery(id)

  const {
    data: productCategories,
    isLoading: isLoadingProductCategories,
    isSuccess: isSuccessProductCategories,
    refetch: refetchProductCategories,
  } = useGetProductCategoriesQuery({})

  useEffect(() => {
    refetchProductCategories()
    refetchProduct()
  }, [refetchProductCategories, refetchProduct])

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
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      Swal.fire('Thất bại', 'Upload ảnh thất bại!', 'error')
    }
  }

  useEffect(() => {
    if (product?.data) {
      setValue('name', product?.data?.name)
      setValue('categoryId', product?.data?.categoryId?._id)
      setValue('price', product?.data?.price)
      setValue('size', product?.data?.size)
      setValue('description', product?.data?.description)
      setValue('imageURL', product?.data?.imageURL)
      setImageURL(product?.data?.imageURL)
    }
  }, [product, setValue])

  const [updateApi, { isLoading: isLoadingUpdate }] = useUpdateProductMutation()

  const handleCreate = async (reqBody) => {
    try {
      nProgress.start()
      const { name, categoryId, price, size, description } = reqBody

      const response = await updateApi({
        id,
        createdBy: user?._id,
        name,
        categoryId,
        price,
        size,
        description,
        imageURL,
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
  if (isLoadingProductCategories || isLoadingProduct)
    content = <div>Loading...</div>
  if (isSuccessProductCategories && isSuccessProduct) {
    content = (
      <div className='relative h-fit w-full rounded-xl border bg-white p-4 shadow-md'>
        <div className='mb-5 rounded-xl bg-[#289ae7] py-5 text-center text-xl font-semibold capitalize text-white'>
          cập nhật sản phẩm
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
              type='file'
              id='imageURL'
              name='imageURL'
              accept='image/*'
              onChange={handleUploadProduct}
              className='hidden'
            />
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

export default UpdateProduct
