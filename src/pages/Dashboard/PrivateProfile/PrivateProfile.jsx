import { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage'
import { FaTimes, FaPencilAlt, FaArrowLeft } from 'react-icons/fa'
import { AiOutlineCloudUpload } from 'react-icons/ai'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { MdComputer } from 'react-icons/md'
import AvatarEditor from 'react-avatar-editor'
import Swal from 'sweetalert2'
import ReactModal from 'react-modal'
import nProgress from 'nprogress'
import PhoneInput from 'react-phone-number-input'

import { app } from '~/firebase/firebase.config'
import { useUpdateProfileMutation } from '~/services/user.service'
import { setCredentials } from '~/redux/reducers/user.reducer'
import useTitle from '~/hooks/useTitle'

const PrivateProfile = () => {
  useTitle('Trang thông tin cá nhân')
  const { user, token } = useSelector((state) => state.user)
  console.log(user)

  const dispatch = useDispatch()

  const editorRef = useRef(null)
  const [scale, setScale] = useState(1)

  const [photo, setPhoto] = useState(null)
  const [photoURL, setPhotoURL] = useState(null)

  const [name, setName] = useState(user?.name)
  const [email, setEmail] = useState(user?.email)
  const [phone, setPhone] = useState(user?.phone || '')
  const [gender, setGender] = useState(user?.gender || '')
  const [address, setAddress] = useState(user?.address || '')

  const [editName, setEditName] = useState('Chỉnh sửa')
  const [editEmail, setEditEmail] = useState('Chỉnh sửa')
  const [editPhone, setEditPhone] = useState('Chỉnh sửa')
  const [editGender, setEditGender] = useState('Chỉnh sửa')
  const [editAddress, setEditAddress] = useState('Chỉnh sửa')

  const [isEditingName, setIsEditingName] = useState(false)
  const [isEditingEmail, setIsEditingEmail] = useState(false)
  const [isEditingPhone, setIsEditingPhone] = useState(false)
  const [isEditingGender, setIsEditingGender] = useState(false)
  const [isEditingAddress, setIsEditingAddress] = useState(false)

  const handleEditName = () => {
    setIsEditingName((prev) => !prev)
    setEditName((prev) => (prev === 'Chỉnh sửa' ? 'Hủy' : 'Chỉnh sửa'))
  }
  const handleEditEmail = () => {
    setIsEditingEmail((prev) => !prev)
    setEditEmail((prev) => (prev === 'Chỉnh sửa' ? 'Hủy' : 'Chỉnh sửa'))
  }
  const handleEditPhone = () => {
    setIsEditingPhone((prev) => !prev)
    setEditPhone((prev) => (prev === 'Chỉnh sửa' ? 'Hủy' : 'Chỉnh sửa'))
  }
  const handleEditGender = () => {
    setIsEditingGender((prev) => !prev)
    setEditGender((prev) => (prev === 'Chỉnh sửa' ? 'Hủy' : 'Chỉnh sửa'))
  }
  const handleEditAddress = () => {
    setIsEditingAddress((prev) => !prev)
    setEditAddress((prev) => (prev === 'Chỉnh sửa' ? 'Hủy' : 'Chỉnh sửa'))
  }

  const [isOpenModal, setIsOpenModal] = useState(false)
  const openModal = () => {
    setIsOpenModal(true)
  }
  const closeModal = () => {
    setPhoto(null)
    setPhotoURL(null)
    setShowFormEditAvatar(false)
    setIsOpenModal(false)
  }

  const [showFormEditAvatar, setShowFormEditAvatar] = useState(false)

  const handleToEditAvatar = () => {
    setShowFormEditAvatar(true)
  }
  const handleBack = () => {
    setShowFormEditAvatar(false)
    setPhoto(null)
  }
  const handleScaleChange = (event) => {
    setScale(parseFloat(event.target.value))
  }
  const handleBackToEditAvatar = () => {
    setPhotoURL(null)
    setShowFormEditAvatar(true)
  }
  const handleClearFile = () => {
    setPhoto(null)
    setPhotoURL(null)
  }

  const [updateApi] = useUpdateProfileMutation()

  const handleUploadPhoto = () => {
    try {
      if (!editorRef.current || !photo) return
      const canvas = editorRef.current.getImage()
      canvas.toBlob((blob) => {
        if (blob) {
          const storage = getStorage(app)
          const fileName = new Date().getTime() + '-' + photo.name
          const storageRef = ref(storage, `avatars/${fileName}`)
          const uploadTask = uploadBytesResumable(storageRef, photo)
          uploadTask.on(
            'state_changed',
            () => {},
            (error) => {
              Swal.fire('Thất bại', error.message, 'error')
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                setPhotoURL(downloadURL)
              })
            },
          )
        }
      })
    } catch (error) {
      console.log(error)
      Swal.fire('Thất bại', 'Upload ảnh thất bại!', 'error')
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()

    try {
      nProgress.start()

      const { data } = await updateApi({
        id: user?._id,
        name,
        email,
        phone,
        gender,
        address,
        photoURL: photoURL || user?.photoURL,
      }).unwrap()

      dispatch(
        setCredentials({
          user: data,
          token,
        }),
      )

      switch (true) {
        case isEditingName:
          setIsEditingName(false)
          setEditName('Chỉnh sửa')
          break

        case isEditingEmail:
          setIsEditingEmail(false)
          setEditEmail('Chỉnh sửa')
          break

        case isEditingAddress:
          setIsEditingAddress(false)
          setEditAddress('Chỉnh sửa')
          break

        case isEditingPhone:
          setIsEditingPhone(false)
          setEditPhone('Chỉnh sửa')
          break

        case isEditingGender:
          setIsEditingGender(false)
          setEditGender('Chỉnh sửa')
          break
      }

      setPhoto(null)
      setPhotoURL(null)
      setIsOpenModal(false)

      Swal.fire('', 'Update profile successfully!', 'success')
    } catch (error) {
      console.log(error)
      Swal.fire('Thất bại', error?.data?.message, 'error')
    } finally {
      nProgress.done()
    }
  }

  return (
    <div className='relative h-fit w-full'>
      <div className='mx-auto w-[1000px] py-12'>
        <div className='mb-12'>
          <div className='text-3xl font-bold'>Thông tin cá nhân</div>
        </div>
        <div className='flex items-start'>
          <div className='flex w-full items-start'>
            <div className='group relative min-h-[150px] min-w-[150px] overflow-hidden rounded-full border-[3px] border-[#90e0ef]'>
              <div className='h-[150px] w-[150px] rounded-full'>
                <img
                  src={user?.photoURL}
                  alt='photoURL'
                  className='min-h-[150px] min-w-[150px] rounded-full object-cover'
                />
              </div>
              <div
                className='absolute top-[76%] flex w-full cursor-pointer items-center justify-center bg-[rgba(0,0,0,0.32)] p-1 opacity-0 transition duration-500 group-hover:opacity-100'
                onClick={openModal}
              >
                <AiOutlineCloudUpload size='28' color='white' />
              </div>
              <ReactModal
                isOpen={isOpenModal}
                onRequestClose={closeModal}
                style={{
                  overlay: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
                  content: {
                    top: '50%',
                    left: '50%',
                    right: 'auto',
                    bottom: 'auto',
                    marginRight: '-50%',
                    transform: 'translate(-50%, -50%)',
                    width: '80%',
                    maxWidth: '400px',
                    padding: '0',
                    borderRadius: '10px',
                    height: 'fit-content',
                    overflow: 'hidden',
                  },
                }}
              >
                <div className='relative h-full w-full'>
                  <div
                    className={`${showFormEditAvatar ? 'invisible h-0 w-0 opacity-0' : 'visible opacity-100'} transition`}
                  >
                    <div className='flex items-center justify-between px-3 pt-3'>
                      <div
                        onClick={closeModal}
                        className='cursor-pointer rounded-full p-3 transition duration-300 hover:bg-gray-100'
                      >
                        <FaTimes size='20' />
                      </div>
                      <div
                        style={{ fontFamily: 'Dancing Script' }}
                        className='w-full text-center text-3xl font-semibold'
                      >
                        CineGalaxy
                      </div>
                      <div className='cursor-pointer rounded-full p-3 transition duration-300 hover:bg-gray-100'>
                        <BsThreeDotsVertical size='20' />
                      </div>
                    </div>
                    <div className='p-6'>
                      <div className='mb-6'>
                        <div className='mb-3 text-center text-lg font-semibold capitalize'>
                          ảnh đại diện
                        </div>
                        <div className='text-gray-500'>
                          Một bức ảnh giúp mọi người nhận ra bạn và cho phép bạn
                          biết khi bạn đã đăng nhập vào tài khoản của mình.
                        </div>
                      </div>
                      <div
                        className='mb-6 flex cursor-pointer items-center justify-center'
                        onClick={handleToEditAvatar}
                      >
                        <img
                          src={user?.photoURL}
                          alt='avatar'
                          className='h-[300px] w-[300px] rounded-full object-cover'
                        />
                      </div>
                      <div
                        onClick={handleToEditAvatar}
                        className='mx-auto flex w-fit cursor-pointer items-center justify-center gap-2 rounded-3xl bg-[#c2e7ff] px-4 py-2 transition duration-500 hover:shadow-custom'
                      >
                        <FaPencilAlt />
                        <span className='text-sm font-semibold capitalize'>
                          thay đổi
                        </span>
                      </div>
                    </div>
                  </div>
                  {showFormEditAvatar && (
                    <>
                      {!photoURL && (
                        <>
                          <div className='flex w-full items-center justify-between px-3 pt-3'>
                            <div
                              className='cursor-pointer rounded-full p-3 transition duration-300 hover:bg-gray-100'
                              onClick={handleBack}
                            >
                              <FaArrowLeft size='20' />
                            </div>
                            <div
                              style={{ fontFamily: 'Dancing Script' }}
                              className='w-full text-center text-3xl font-semibold'
                            >
                              CineGalaxy
                            </div>
                            <div className='cursor-pointer rounded-full p-3 transition duration-300 hover:bg-gray-100'>
                              <BsThreeDotsVertical size='20' />
                            </div>
                          </div>
                          {photo ? (
                            <div className='p-6'>
                              <div className='relative'>
                                <AvatarEditor
                                  ref={editorRef}
                                  image={photo}
                                  width={300}
                                  height={300}
                                  scale={scale}
                                />
                                <div
                                  className='absolute right-0 top-0 z-10 cursor-pointer rounded-full bg-[#fca311] p-2'
                                  onClick={handleClearFile}
                                >
                                  <FaTimes />
                                </div>
                              </div>
                              <div className='mx-12 my-6 flex items-center gap-2'>
                                <label className='capitalize'>zoom:</label>
                                <input
                                  type='range'
                                  min='1'
                                  max='3'
                                  step='0.1'
                                  value={scale}
                                  onChange={handleScaleChange}
                                />
                              </div>
                              <button
                                type='button'
                                onClick={handleUploadPhoto}
                                className='mx-auto block w-fit rounded-3xl bg-[#c2e7ff] px-4 py-2 font-semibold capitalize transition duration-500 hover:shadow-custom'
                              >
                                tiếp theo
                              </button>
                            </div>
                          ) : (
                            <div className='flex items-center justify-center py-6'>
                              <label
                                htmlFor='photoURL'
                                className='flex h-[350px] w-[350px] cursor-pointer items-center justify-center gap-1 border-[5px] border-dashed font-semibold'
                              >
                                <MdComputer size='22' />
                                Tải ảnh
                              </label>
                              <input
                                id='photoURL'
                                type='file'
                                onChange={(e) => {
                                  if (
                                    e.target.files &&
                                    e.target.files.length > 0
                                  ) {
                                    setPhoto(e.target.files[0])
                                  }
                                }}
                                hidden
                              />
                            </div>
                          )}
                        </>
                      )}
                    </>
                  )}
                  {/* show form confirm avatar */}
                  {photoURL && (
                    <div className='h-full w-full p-6'>
                      <div className='text-center text-xl font-semibold capitalize'>
                        ảnh đại diện của bạn
                      </div>
                      <div className='flex items-center justify-center py-6'>
                        <img
                          src={photoURL}
                          alt=''
                          className='h-[300px] w-[300px] rounded-full object-cover'
                        />
                      </div>
                      <form
                        onSubmit={handleUpdate}
                        className='flex items-center justify-center gap-4'
                      >
                        <div
                          onClick={handleBackToEditAvatar}
                          className='cursor-pointer rounded-3xl px-4 py-2 text-center font-semibold capitalize transition duration-500 hover:bg-slate-100 hover:shadow-custom'
                        >
                          hủy
                        </div>
                        <button
                          type='submit'
                          className='block w-fit rounded-3xl bg-[#c2e7ff] px-4 py-2 font-semibold capitalize transition duration-500 hover:shadow-custom'
                        >
                          cập nhật ảnh đại diện
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              </ReactModal>
            </div>
            <div className='ml-12 h-full w-full'>
              <div>
                <div className='flex justify-between pb-4'>
                  <div className='w-[300px]'>
                    <p className='mb-1 font-semibold capitalize'>
                      Tên người dùng
                    </p>
                    {isEditingName ? (
                      <div className='text-sm text-[#6a6a6a]'>
                        Đảm bảo rằng tên bạn nhập khớp với tên trên giấy tờ tùy
                        thân do chính phủ cấp.
                      </div>
                    ) : (
                      <div className='text-sm text-[#6a6a6a]'>{user?.name}</div>
                    )}
                  </div>
                  <button
                    onClick={handleEditName}
                    className='flex cursor-pointer items-start text-sm font-semibold underline'
                  >
                    {editName}
                  </button>
                </div>
                {isEditingName && (
                  <form onSubmit={handleUpdate} className='mt-1'>
                    <input
                      className='h-fit w-full rounded-lg border border-[#ccc] p-4 text-base outline-none'
                      id='name'
                      name='name'
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete='off'
                    />
                    <button
                      type='submit'
                      className='my-5 rounded bg-black px-3 py-2 font-semibold text-white transition duration-300 hover:opacity-70'
                    >
                      Lưu
                    </button>
                  </form>
                )}
              </div>
              <hr className='mb-7' />
              <div>
                <div className='flex justify-between pb-4'>
                  <div className='w-[300px]'>
                    <p className='mb-1 font-semibold capitalize'>
                      Địa chỉ email
                    </p>
                    {isEditingEmail ? (
                      <div className='text-sm text-[#6a6a6a]'>
                        Sử dụng địa chỉ email mà bạn luôn có quyền truy cập.
                      </div>
                    ) : (
                      <div className='text-sm text-[#6a6a6a]'>
                        {user?.email}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleEditEmail}
                    className='flex cursor-pointer items-start text-sm font-semibold underline'
                  >
                    {editEmail}
                  </button>
                </div>
                {isEditingEmail && (
                  <form onSubmit={handleUpdate} className='mt-1'>
                    <input
                      className='h-fit w-full rounded-lg border border-[#ccc] p-4 text-base outline-none'
                      id='email'
                      name='email'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete='off'
                    />
                    <button
                      type='submit'
                      className='my-5 rounded bg-black px-3 py-2 font-semibold text-white transition duration-300 hover:opacity-70'
                    >
                      Lưu
                    </button>
                  </form>
                )}
              </div>
              <hr className='mb-7' />
              <div>
                <div className='flex justify-between pb-4'>
                  <div className='w-[300px]'>
                    <p className='mb-1 font-semibold capitalize'>địa chỉ</p>
                    {user && user.address ? (
                      <>
                        {isEditingAddress ? (
                          <div className='text-sm text-[#6a6a6a]'>
                            Sử dụng địa chỉ thường trú để nhận thư.
                          </div>
                        ) : (
                          <div className='text-sm text-[#6a6a6a]'>
                            {user?.address}
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        {isEditingAddress ? (
                          <div className='text-[14px] text-[#717171]'>
                            Sử dụng địa chỉ thường trú để nhận thư.
                          </div>
                        ) : (
                          <div className='text-[14px] text-[#717171]'>
                            Chưa cung cấp.
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  <div
                    onClick={handleEditAddress}
                    className='cursor-pointer text-sm font-semibold underline'
                  >
                    {editAddress}
                  </div>
                </div>
                {isEditingAddress && (
                  <form onSubmit={handleUpdate} className='mt-1'>
                    <input
                      placeholder='Nhập địa chỉ thường trú'
                      className='h-fit w-full rounded-lg border border-[#ccc] p-4 text-base outline-none'
                      id='address'
                      name='address'
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      autoComplete='off'
                    />
                    <button
                      type='submit'
                      className='my-5 rounded bg-black px-3 py-2 font-semibold text-white transition duration-300 hover:opacity-70'
                    >
                      Lưu
                    </button>
                  </form>
                )}
              </div>
              <hr className='mb-7' />
              <div>
                <div className='flex justify-between pb-4'>
                  <div className='w-[300px]'>
                    <p className='mb-1 font-semibold capitalize'>
                      số điện thoại
                    </p>
                    {user && user.phone ? (
                      <>
                        {isEditingPhone ? (
                          <div className='text-sm text-[#6a6a6a]'>
                            Thêm số điện thoại để CineGalaxy có thể liên hệ với
                            bạn. Bạn có thể thêm các số điện thoại khác và chọn
                            mục đích sử dụng tương ứng.
                          </div>
                        ) : (
                          <div className='text-sm text-[#6a6a6a]'>
                            {user?.phone}
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        {isEditingPhone ? (
                          <div className='text-sm text-[#6a6a6a]'>
                            Thêm số điện thoại để CineGalaxy có thể liên hệ với
                            bạn. Bạn có thể thêm các số điện thoại khác và chọn
                            mục đích sử dụng tương ứng.
                          </div>
                        ) : (
                          <div className='text-sm text-[#6a6a6a]'>
                            Chưa cung cấp.
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  <div
                    onClick={handleEditPhone}
                    className='cursor-pointer text-sm font-semibold underline'
                  >
                    {editPhone}
                  </div>
                </div>
                {isEditingPhone && (
                  <form onSubmit={handleUpdate} className='mt-1'>
                    <PhoneInput
                      value={phone}
                      onChange={setPhone}
                      className='h-fit w-full rounded-lg border border-[#ccc] p-4 text-base outline-none'
                      id='phone'
                      name='phone'
                      autoComplete='off'
                      placeholder='Nhập số điện thoại'
                      defaultCountry='VN'
                    />
                    <button
                      type='submit'
                      className='my-5 rounded bg-black px-3 py-2 font-semibold text-white transition duration-300 hover:opacity-70'
                    >
                      Lưu
                    </button>
                  </form>
                )}
              </div>
              <hr className='mb-7' />
              <div>
                <div className='flex justify-between pb-4'>
                  <div className='w-[300px]'>
                    <p className='mb-1 font-semibold capitalize'>giới tính</p>
                    {user && user.gender ? (
                      <>
                        {isEditingGender ? (
                          <div className='text-sm text-[#6a6a6a]'>
                            Giới tính thành viên{' '}
                            <strong>- Không bắt buộc</strong>
                          </div>
                        ) : (
                          <div className='text-sm capitalize text-[#6a6a6a]'>
                            {user?.gender === 'male' && 'Nam'}
                            {user?.gender === 'female' && 'Nữ'}
                            {user?.gender === 'other' && 'Khác'}
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        {isEditingGender ? (
                          <div className='text-sm text-[#6a6a6a]'>
                            Giới tính thành viên{' '}
                            <strong>- Không bắt buộc</strong>
                          </div>
                        ) : (
                          <div className='text-sm text-[#6a6a6a]'>
                            Chưa cung cấp.
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  <div
                    onClick={handleEditGender}
                    className='cursor-pointer text-sm font-semibold underline'
                  >
                    {editGender}
                  </div>
                </div>
                {isEditingGender && (
                  <form onSubmit={handleUpdate}>
                    <div className='mb-2 flex items-center gap-2'>
                      <input
                        className='w-fit'
                        type='radio'
                        name='gender'
                        value='male'
                        checked={gender === 'male'}
                        onChange={() => setGender('male')}
                      />
                      <label className='w-fit'>Nam</label>
                    </div>
                    <div className='mb-2 flex items-center gap-2'>
                      <input
                        className='w-fit'
                        type='radio'
                        name='gender'
                        value='female'
                        checked={gender === 'female'}
                        onChange={() => setGender('female')}
                      />
                      <label className='w-fit'>Nữ</label>
                    </div>
                    <div className='flex items-center gap-2'>
                      <input
                        className='w-fit'
                        type='radio'
                        name='gender'
                        value='other'
                        checked={gender === 'other'}
                        onChange={() => setGender('other')}
                      />
                      <label className='w-fit'>Khác</label>
                    </div>
                    <button
                      type='submit'
                      className='my-5 rounded bg-black px-3 py-2 font-semibold text-white transition duration-300 hover:opacity-70'
                    >
                      Lưu
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivateProfile
