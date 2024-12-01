const Footer = () => {
  return (
    <footer className='h-fit w-full border-t-2'>
      <div className='mx-auto w-[1000px] py-6'>
        <div
          className='text-3xl font-semibold'
          style={{ fontFamily: 'Dancing Script' }}
        >
          CineGalaxy
        </div>
        <div className='mt-6 text-sm text-[#666]'>
          <div className='uppercase'>Công ty TNHH CineGalaxy Việt Nam</div>
          <div>
            Giấy CNĐKDN: 0123456789, đăng ký lần đầu ngày 01/01/2014, đăng ký
            thay đổi lần thứ 10 ngày 01/01/24, cấp bởi Sở KHĐT Thành phố Cần Thơ
          </div>
          <div>
            Địa chỉ: 145 - Huỳnh Thúc Kháng, Phường An Nghiệp, Quận Ninh Kiều,
            TP Cần Thơ
          </div>
          <div>Hotline: (012) 3456789</div>
          <div>COPYRIGHT © CINEGALAXY.COM - ALL RIGHTS RESERVED.</div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
