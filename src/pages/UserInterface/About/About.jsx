const About = () => {
  return (
    <div className='bg-white text-gray-800'>
      <section
        className='relative h-[70vh] bg-cover bg-center bg-no-repeat'
        style={{
          backgroundImage: 'url(https://source.unsplash.com/1600x900/?cinema)',
        }}
      >
        <div className='absolute inset-0 flex items-center justify-center bg-white bg-opacity-70'>
          <div className='max-w-3xl text-center'>
            <h1 className='text-4xl font-bold text-gray-900 md:text-6xl'>
              Chào mừng đến với CineGalaxy
            </h1>
            <p className='mt-4 text-lg md:text-xl'>
              Cánh cửa dẫn đến trải nghiệm điện ảnh không thể quên. Khám phá,
              tận hưởng, và đắm chìm trong thế giới kỳ diệu của điện ảnh!
            </p>
          </div>
        </div>
      </section>

      <section className='bg-gray-50 px-8 py-16 md:px-16'>
        <h2 className='mb-8 text-center text-3xl font-bold text-gray-900 md:text-4xl'>
          Về Chúng Tôi
        </h2>
        <p className='mx-auto max-w-4xl text-center text-lg leading-relaxed'>
          Tại <span className='font-semibold text-blue-500'>CineGalaxy</span>,
          chúng tôi tin rằng phim ảnh không chỉ là giải trí mà còn là hành trình
          khám phá cảm xúc, câu chuyện và những cuộc phiêu lưu. Với hệ thống rạp
          hiện đại, ghế ngồi thoải mái và âm thanh sống động, chúng tôi mang
          những câu chuyện đến gần bạn hơn bao giờ hết.
        </p>
        <div className='mt-12 grid grid-cols-1 gap-8 md:grid-cols-3'>
          <div className='rounded-lg bg-white p-6 text-center shadow-md'>
            <h3 className='mb-4 text-xl font-semibold text-blue-500'>
              Công Nghệ Hàng Đầu
            </h3>
            <p>
              Trải nghiệm công nghệ điện ảnh tiên tiến nhất với hệ thống IMAX,
              4DX và Dolby Atmos đưa bạn vào trung tâm của hành động.
            </p>
          </div>
          <div className='rounded-lg bg-white p-6 text-center shadow-md'>
            <h3 className='mb-4 text-xl font-semibold text-blue-500'>
              Sự Thoải Mái Tối Ưu
            </h3>
            <p>
              Thư giãn trên những ghế ngồi sang trọng, thưởng thức đồ ăn nhẹ cao
              cấp và biến mỗi lần đến rạp thành một kỷ niệm đáng nhớ.
            </p>
          </div>
          <div className='rounded-lg bg-white p-6 text-center shadow-md'>
            <h3 className='mb-4 text-xl font-semibold text-blue-500'>
              Phim Bom Tấn Toàn Cầu
            </h3>
            <p>
              Từ Hollywood đến Bollywood, chúng tôi mang đến cho bạn những bộ
              phim xuất sắc nhất từ khắp nơi trên thế giới với chất lượng tuyệt
              đỉnh.
            </p>
          </div>
        </div>
      </section>

      <section className='bg-gray-100 py-16'>
        <h2 className='mb-8 text-center text-3xl font-bold text-gray-900 md:text-4xl'>
          Thư Viện Hình Ảnh
        </h2>
        <div className='grid grid-cols-1 gap-6 px-8 sm:grid-cols-2 md:grid-cols-3 md:px-16'>
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className='relative'>
              <img
                src={`https://images.pexels.com/photos/375885/pexels-photo-375885.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1`}
                alt='Cinema'
                className='h-64 w-full rounded-lg object-cover shadow-lg'
              />
              <div className='absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 opacity-0 transition duration-300 hover:opacity-100'>
                <p className='font-bold text-gray-900'>
                  Cảnh Quan CineGalaxy {index + 1}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className='bg-gray-50 px-8 py-16 md:px-16'>
        <h2 className='mb-8 text-center text-3xl font-bold text-gray-900 md:text-4xl'>
          Liên Hệ Với Chúng Tôi
        </h2>
        <p className='mx-auto max-w-4xl text-center text-lg leading-relaxed'>
          Có thắc mắc hoặc muốn biết thêm thông tin? Hãy liên hệ với chúng tôi
          qua email{' '}
          <a
            href='mailto:support@cinegalaxy.com'
            className='text-blue-500 underline'
          >
            support@cinegalaxy.com
          </a>{' '}
          hoặc ghé thăm CineGalaxy gần nhất.
        </p>
      </section>
    </div>
  )
}

export default About
