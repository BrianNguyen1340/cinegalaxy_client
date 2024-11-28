import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

import { useGetMovieTicketQuery } from '~/services/movieTicket.service'

const exportToPDF = () => {
  const input = document.getElementById('pdf-content')

  html2canvas(input)
    .then((canvas) => {
      const pdf = new jsPDF('p', 'mm', 'a4')
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 210, 297)
      pdf.save('movie-ticket.pdf')
    })
    .catch((error) => {
      throw new Error('Error exporting to PDF:', error)
    })
}

const DetailMovieTicket = () => {
  const { id } = useParams()

  const { data: movieTicket, refetch } = useGetMovieTicketQuery(id)
  console.log(movieTicket)

  useEffect(() => {
    refetch()
  }, [refetch])

  return (
    <div className='relative h-fit w-full rounded-xl border bg-white p-4 shadow-md'>
      <div className='mb-5 rounded-xl bg-[#289ae7] py-5 text-center text-xl font-semibold capitalize text-white'>
        chi tiết vé xem phim
      </div>

      <div
        id='pdf-content'
        className='relative mx-auto mb-8 w-[400px] overflow-hidden rounded border-2 p-4'
      >
        <div className='mb-6 text-center text-lg font-bold'>[Receipt]</div>
        <div>
          {new Date(movieTicket?.data?.createdAt).toLocaleDateString()}
          <span className='px-2'></span>
          {new Date(movieTicket?.data?.createdAt).toLocaleTimeString()}
        </div>
        <div className='mb-4 font-semibold capitalize'>
          {movieTicket?.data?.createdBy?.name}
        </div>
        <div className='h-[1px] w-full bg-black'></div>
        <div className='mb-6 grid grid-cols-[1fr_100px_100px] gap-3'>
          <div className='font-semibold capitalize'>ghế</div>
        </div>
        <div className='h-[1px] w-full bg-black'></div>
        <div className='flex items-center gap-3'>
          {movieTicket?.data?.seats?.map((item, index) => (
            <div key={index} className='mb-6 flex items-center'>
              <div className='font-semibold capitalize'>{item.number}</div>
              <div className='font-semibold capitalize'>{item.row}</div>
            </div>
          ))}
        </div>
        <div className='h-[1px] w-full bg-black'></div>
        <div className='mb-6 grid grid-cols-[1fr_100px] gap-3'>
          <div>Tổng tiền đơn hàng</div>
          <div>
            {movieTicket?.data?.totalPrice.toLocaleString('vi-VN', {
              style: 'currency',
              currency: 'VND',
            })}
          </div>
        </div>
        <div className='mb-6 grid grid-cols-[1fr_250px] gap-3'>
          <div>Cash</div>
          <div>
            <div className='capitalize'>
              <span>tiền khách đưa: </span>
              {movieTicket?.data?.cashReceived.toLocaleString('vi-VN', {
                style: 'currency',
                currency: 'VND',
              })}
            </div>
            <div className='capitalize'>
              <span>tiền thối lại: </span>
              {movieTicket?.data?.changeAmount.toLocaleString('vi-VN', {
                style: 'currency',
                currency: 'VND',
              })}
            </div>
          </div>
        </div>
        <div className='mb-6 font-semibold capitalize'>
          <span>rạp: </span>
          {movieTicket?.data?.cinemaId?.name}
        </div>
        <div className='text-center font-semibold'>
          Sales no. {movieTicket?.data?.invoiceCode}
        </div>
      </div>
      <div className='mx-auto w-[100px]'>
        <button
          className='w-full rounded border-2 font-semibold'
          onClick={exportToPDF}
        >
          xuất vé
        </button>
      </div>
    </div>
  )
}

export default DetailMovieTicket
