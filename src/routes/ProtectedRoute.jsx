import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

import { paths } from '~/utils/paths'

const ProtectedRoute = () => {
  const { isAuthenticated, user } = useSelector((state) => state.user)

  const isAuthorized =
    isAuthenticated &&
    (user?.role === 0 || user?.role === 1 || user?.role === 2)

  if (!isAuthorized) {
    return <Navigate to={paths.userPaths.privateLogin} replace />
  }

  return <Outlet />
}

export default ProtectedRoute
