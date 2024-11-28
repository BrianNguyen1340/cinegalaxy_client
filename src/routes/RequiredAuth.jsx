import { useSelector } from 'react-redux'
import { Outlet, Navigate } from 'react-router-dom'

import { paths } from '~/utils/paths'

const RequiredAuth = () => {
  const { user } = useSelector((state) => state.user)

  return user?.role === 3 ? (
    <Outlet />
  ) : (
    <Navigate to={paths.userPaths.login} replace />
  )
}

export default RequiredAuth
