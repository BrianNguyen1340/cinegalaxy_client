import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { paths } from '~/utils/paths'

const SidebarTop = () => {
  const user = useSelector((state) => state.user.user)

  return (
    <Link
      to={paths.dashboardPaths.dashboard}
      className='relative flex h-[60px] w-full items-center justify-center gap-2 overflow-hidden p-4'
    >
      <div className='text-2xl capitalize'>
        {user?.role === 0 && <>admin</>}
        {user?.role === 1 && <>manager</>}
        {user?.role === 2 && <>cashier</>}
      </div>
    </Link>
  )
}

export default SidebarTop
