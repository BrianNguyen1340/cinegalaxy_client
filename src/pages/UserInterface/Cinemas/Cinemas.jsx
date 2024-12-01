/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { paths } from '~/utils/paths'
import { useGetCinemaComplexesQuery } from '~/services/cinemaComplex.service'
import { useGetCinemasQuery } from '~/services/cinema.service'
// import { useGetShowtimesQuery } from '~/services/showtime.service'
// import { DateSelector } from '~/components'
import useTitle from '~/hooks/useTitle'

const Cinemas = () => {
  useTitle('Danh sách rạp')
  const { isAuthenticated, user } = useSelector((state) => state.user)
  const isAuthorized =
    isAuthenticated &&
    (user?.role === 0 || user?.role === 1 || user?.role === 2)
  if (isAuthorized) {
    return <Navigate to={paths.dashboardPaths.dashboard} replace />
  }

  const { data: cinemaComplexes, refetch: refetchCinemaComplexes } =
    useGetCinemaComplexesQuery({})
  const { data: cinemas, refetch: refetchCinemas } = useGetCinemasQuery({})
  // const { data: showtimes, refetch: refetchShowtimes } = useGetShowtimesQuery(
  //   {},
  // )
  useEffect(() => {
    refetchCinemas()
    refetchCinemaComplexes()
    // refetchShowtimes()
  }, [refetchCinemas, refetchCinemaComplexes])
  const [hoveredCinemaComplex, setHoveredCinemaComplex] = useState()
  const [selectedCinemaName, setSelectedCinemaName] = useState('')
  // const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedCinemaAddress, setSelectedCinemaAddress] = useState('')
  const [selectedCinemaPhone, setSelectedCinemaPhone] = useState('')

  const handleCinemaClick = (cinema) => {
    setSelectedCinemaName(cinema.name)
    setSelectedCinemaAddress(cinema.address)
    setSelectedCinemaPhone(cinema.phone)
  }

  return (
    <div className='relative h-fit w-full bg-[#faf6ec]'>
      <div className='relative flex h-fit w-full items-center justify-center gap-6 bg-[#dad2b4]'>
        {cinemaComplexes?.data?.map((cinemaComplex) => (
          <div
            key={cinemaComplex._id}
            onMouseEnter={() => setHoveredCinemaComplex(cinemaComplex._id)}
            onMouseLeave={() => setHoveredCinemaComplex(null)}
            className='cursor-pointer p-4 text-sm font-semibold capitalize hover:underline'
          >
            {cinemaComplex.name}
            {hoveredCinemaComplex === cinemaComplex._id && (
              <div className='absolute left-0 top-full flex w-full items-center justify-center gap-12 rounded bg-[rgba(0,0,0,0.8)] p-4 text-white shadow-custom'>
                {cinemas?.data
                  ?.filter(
                    (cinema) =>
                      cinema.cinemaComplexId._id === cinemaComplex._id,
                  )
                  .map((cinema) => (
                    <div
                      key={cinema._id}
                      className='py-1 text-sm hover:underline'
                      onClick={() => handleCinemaClick(cinema)}
                    >
                      {cinema.name}
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className='mx-auto w-[1000px]'>
        {/* <div className='py-10 text-center text-xl font-semibold capitalize'>
          lịch chiếu phim
        </div>
        <DateSelector
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        /> */}
        {selectedCinemaName && (
          <div className='py-10 text-center text-[28px] font-bold capitalize text-gray-700'>
            {selectedCinemaName}
          </div>
        )}
        {selectedCinemaAddress && (
          <div className='pb-10 text-center text-gray-500'>
            Địa chỉ: {selectedCinemaAddress}
          </div>
        )}
        {selectedCinemaPhone && (
          <div className='pb-10 text-center text-gray-500'>
            Số điện thoại: {selectedCinemaPhone}
          </div>
        )}
        {/* <div className='mt-10 bg-white'>
          <div className='flex items-center gap-10 border-b-2 p-6'>
            <div className='flex items-center'>
              <div className='mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#088210] p-3 font-semibold uppercase text-white'>
                p
              </div>
              <div className='text-sm'>Mọi đối tượng</div>
            </div>
            <div className='flex items-center'>
              <div className='mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#246ed8] p-3 font-semibold uppercase text-white'>
                13
              </div>
              <div className='text-sm'>13 tuổi trở lên</div>
            </div>
            <div className='flex items-center'>
              <div className='mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#c60672] p-3 font-semibold uppercase text-white'>
                p
              </div>
              <div className='text-sm'>16 tuổi trở lên</div>
            </div>
            <div className='flex items-center'>
              <div className='mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#e80808] p-3 font-semibold uppercase text-white'>
                p
              </div>
              <div className='text-sm'>18 tuổi trở lên</div>
            </div>
          </div>
        </div> */}
        <div>{/* HIỂN THỊ SUẤT CHIẾU DỰA THEO RẠP VÀ NGÀY ĐÃ CHO */}</div>
        {/* <div className='p-6'>
          <div className='text-sm'>
            Lịch chiếu phim có thể thay đổi mà không báo trước
          </div>
          <div className='mt-2 text-sm'>
            Thời gian bắt đầu chiếu phim có thể chênh lệch 15 phút do chiếu
            quảng cáo, giới thiệu phim ra rạp
          </div>
        </div> */}
      </div>
    </div>
  )
}

export default Cinemas
