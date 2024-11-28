import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

import { useGetServiceTicketQuery } from '~/services/serviceTicket.service'

const exportToPDF = () => {
  const input = document.getElementById('pdf-content')

  html2canvas(input)
    .then((canvas) => {
      const pdf = new jsPDF('p', 'mm', 'a4')
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 210, 297)
      pdf.save('service-ticket.pdf')
    })
    .catch((error) => {
      throw new Error('Error exporting to PDF:', error)
    })
}

const DetailServiceTicket = () => {
  const { id } = useParams()

  const { data: serviceTicket, refetch } = useGetServiceTicketQuery(id)

  useEffect(() => {
    refetch()
  }, [refetch])

  return (
    <div className='relative h-fit w-full rounded-xl border bg-white p-4 shadow-md'>
      <div className='mb-5 rounded-xl bg-[#289ae7] py-5 text-center text-xl font-semibold capitalize text-white'>
        chi tiết vé dịch vụ
      </div>

      <div
        id='pdf-content'
        className='relative mx-auto mb-8 w-[400px] overflow-hidden rounded border-2 p-4'
      >
        <div className='mb-6 text-center text-lg font-bold'>[Receipt]</div>
        <div>
          {new Date(serviceTicket?.data?.ticketIssuedAt).toLocaleDateString()}
          <span className='px-2'></span>
          {new Date(serviceTicket?.data?.ticketIssuedAt).toLocaleTimeString()}
        </div>
        <div className='mb-4 font-semibold capitalize'>
          {serviceTicket?.data?.createdBy?.name}
        </div>
        <div className='h-[1px] w-full bg-black'></div>
        <div className='mb-6 grid grid-cols-[1fr_100px_100px] gap-3'>
          <div className='font-semibold capitalize'>sản phẩm</div>
          <div className='font-semibold capitalize'>số lượng</div>
          <div className='font-semibold capitalize'>tổng tiền</div>
        </div>
        <div className='h-[1px] w-full bg-black'></div>
        {serviceTicket?.data?.products?.map((item, index) => (
          <div
            key={index}
            className='mb-6 grid grid-cols-[1fr_100px_100px] gap-3'
          >
            <div className='font-semibold capitalize'>{item.name}</div>
            <div>{item.quantity}</div>
            <div>
              {item.total.toLocaleString('vi-VN', {
                style: 'currency',
                currency: 'VND',
              })}
            </div>
          </div>
        ))}
        <div className='h-[1px] w-full bg-black'></div>
        <div className='mb-6 grid grid-cols-[1fr_100px] gap-3'>
          <div>Tổng tiền đơn hàng</div>
          <div>
            {serviceTicket?.data?.totalPrice.toLocaleString('vi-VN', {
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
              {serviceTicket?.data?.cashReceived.toLocaleString('vi-VN', {
                style: 'currency',
                currency: 'VND',
              })}
            </div>
            <div className='capitalize'>
              <span>tiền thối lại: </span>
              {serviceTicket?.data?.changeAmount.toLocaleString('vi-VN', {
                style: 'currency',
                currency: 'VND',
              })}
            </div>
          </div>
        </div>
        <div className='mb-6 font-semibold capitalize'>
          <span>rạp: </span>
          {serviceTicket?.data?.cinemaId?.name}
        </div>
        <div className='text-center font-semibold'>
          Sales no. {serviceTicket?.data?.invoiceCode}
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

export default DetailServiceTicket
