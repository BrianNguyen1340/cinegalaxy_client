/* eslint-disable react/prop-types */
import { useEffect, useRef } from 'react'
import PerfectScrollbar from 'perfect-scrollbar'

const Scrollbar = ({ content, style }) => {
  const containerRef = useRef(null)

  useEffect(() => {
    if (containerRef.current) {
      const ps = new PerfectScrollbar(containerRef.current)

      return () => {
        ps.destroy()
      }
    }
  }, [containerRef])

  return (
    <div ref={containerRef} style={style} className='relative'>
      {content}
    </div>
  )
}

export default Scrollbar
