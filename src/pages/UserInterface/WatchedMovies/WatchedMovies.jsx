import { useEffect } from 'react'
import { useSelector } from 'react-redux'

import { useGetOrdersQuery } from '~/services/order.service'

const WatchedMovies = () => {
  const { user } = useSelector((state) => state.user)

  const { data: orders, refetch } = useGetOrdersQuery({})

  useEffect(() => {
    refetch()
  }, [refetch])

  return <div></div>
}

export default WatchedMovies
