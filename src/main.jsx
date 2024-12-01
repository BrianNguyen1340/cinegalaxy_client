import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'

import { persistor, store } from '~/redux/store.js'
import { paths } from '~/utils/paths.js'
import {
  // *** USER PAGES
  Account,
  ForgotPassword,
  Home,
  Login,
  MovieDetails,
  MovieLists,
  Profile,
  Register,
  ResetPassword,
  Showtimes,
  ShowtimeDetails,
  VerifyOTP,
  Order,
  WatchedMovies,
  OrderSuccess,
  OrderCancel,
  Cinemas,
  About,

  // *** PRIVATE AUTH
  PrivateLogin,
  PrivateForgotPassword,
  PrivateResetPassword,
  PrivateProfile,

  // *** ADMIN PAGES
  Dashboard,
  ListAccount,
  CreateAccount,
  UpdateAccount,
  ListCinemaComplex,
  CreateCinemaComplex,
  UpdateCinemaComplex,
  ListCinema,
  CreateCinema,
  UpdateCinema,
  ListGenre,
  CreateGenre,
  UpdateGenre,
  ListMovie,
  CreateMovie,
  UpdateMovie,
  ListRoom,
  CreateRoom,
  UpdateRoom,
  ListSeat,
  CreateSeat,
  UpdateSeat,
  ListSystemAccount,
  CreateSystemAccount,
  UpdateSystemAccount,
  ListCashier,
  ListSeatStatus,
  ListOrder,

  // *** MANAGER PAGES
  ListShowtime,
  CreateShowtime,
  UpdateShowtime,
  ListProductCategory,
  CreateProductCategory,
  UpdateProductCategory,
  ListProduct,
  CreateProduct,
  UpdateProduct,
  ListPromotion,
  CreatePromotion,
  UpdatePromotion,

  // *** CASHIER PAGES
  ListMovieTicket,
  CreateMovieTicket,
  UpdateMovieTicket,
  ListServiceTicket,
  CreateServiceTicket,
  UpdateServiceTicket,
  DetailServiceTicket,
  ChooseSeat,
  DetailMovieTicket,

  // *** NOTFOUND PAGE
  NotFound,
  Payment,
} from '~/pages'
import App from './App.jsx'
import RequiredAuth from '~/routes/RequiredAuth'
import ProtectedRoute from '~/routes/ProtectedRoute'
import './index.scss'
import './index.css'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <PayPalScriptProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<App />}>
              {/* PUBLIC ROUTES */}
              <Route index path='/' element={<Home />} />
              <Route path={paths.userPaths.about} element={<About />} />
              <Route path={paths.userPaths.register} element={<Register />} />
              <Route path={paths.userPaths.verifyOtp} element={<VerifyOTP />} />
              <Route path={paths.userPaths.login} element={<Login />} />
              <Route
                path={paths.userPaths.forgotPassword}
                element={<ForgotPassword />}
              />
              <Route
                path={paths.userPaths.resetPassword}
                element={<ResetPassword />}
              />
              <Route path={paths.userPaths.showtimes} element={<Showtimes />} />
              <Route
                path={paths.userPaths.movieLists}
                element={<MovieLists />}
              />
              <Route
                path={paths.userPaths.movieDetails}
                element={<MovieDetails />}
              />
              <Route
                path={paths.userPaths.orderCancel}
                element={<OrderCancel />}
              />

              {/* PRIVATE AUTH */}
              <Route
                path={paths.userPaths.privateLogin}
                element={<PrivateLogin />}
              />
              <Route
                path={paths.userPaths.privateForgotPassword}
                element={<PrivateForgotPassword />}
              />
              <Route
                path={paths.userPaths.privateResetPassword}
                element={<PrivateResetPassword />}
              />
              <Route path={paths.userPaths.orderDetails} element={<Order />} />

              {/* REQUIRED AUTH ROUTES */}
              <Route element={<RequiredAuth />}>
                <Route
                  path={paths.userPaths.showtimeDetails}
                  element={<ShowtimeDetails />}
                />
                <Route
                  path={paths.userPaths.orderSuccess}
                  element={<OrderSuccess />}
                />
                <Route path={paths.userPaths.cinemas} element={<Cinemas />} />
                <Route path={paths.userPaths.account} element={<Account />} />
                <Route path={paths.userPaths.profile} element={<Profile />} />
                <Route
                  path={paths.userPaths.watchedMovies}
                  element={<WatchedMovies />}
                />
              </Route>

              {/* PROTECTED ROUTES */}
              <Route element={<ProtectedRoute />}>
                <Route
                  path={paths.dashboardPaths.dashboard}
                  element={<Dashboard />}
                />
                <Route
                  path={paths.dashboardPaths.privateProfile}
                  element={<PrivateProfile />}
                />

                {/* system account */}
                <Route
                  path={paths.dashboardPaths.managements.systemAccounts.list}
                  element={<ListSystemAccount />}
                />
                <Route
                  path={
                    paths.dashboardPaths.managements.systemAccounts.listCashiers
                  }
                  element={<ListCashier />}
                />
                <Route
                  path={paths.dashboardPaths.managements.systemAccounts.create}
                  element={<CreateSystemAccount />}
                />
                <Route
                  path={paths.dashboardPaths.managements.systemAccounts.update}
                  element={<UpdateSystemAccount />}
                />

                {/* account */}
                <Route
                  path={paths.dashboardPaths.managements.accounts.list}
                  element={<ListAccount />}
                />
                <Route
                  path={paths.dashboardPaths.managements.accounts.create}
                  element={<CreateAccount />}
                />
                <Route
                  path={paths.dashboardPaths.managements.accounts.update}
                  element={<UpdateAccount />}
                />

                {/* order */}
                <Route
                  path={paths.dashboardPaths.managements.orders.list}
                  element={<ListOrder />}
                />

                {/* cinema complex */}
                <Route
                  path={paths.dashboardPaths.managements.cinemaComplexes.list}
                  element={<ListCinemaComplex />}
                />
                <Route
                  path={paths.dashboardPaths.managements.cinemaComplexes.create}
                  element={<CreateCinemaComplex />}
                />
                <Route
                  path={paths.dashboardPaths.managements.cinemaComplexes.update}
                  element={<UpdateCinemaComplex />}
                />

                {/* cinema */}
                <Route
                  path={paths.dashboardPaths.managements.cinemas.list}
                  element={<ListCinema />}
                />
                <Route
                  path={paths.dashboardPaths.managements.cinemas.create}
                  element={<CreateCinema />}
                />
                <Route
                  path={paths.dashboardPaths.managements.cinemas.update}
                  element={<UpdateCinema />}
                />

                {/* genre */}
                <Route
                  path={paths.dashboardPaths.managements.genres.list}
                  element={<ListGenre />}
                />
                <Route
                  path={paths.dashboardPaths.managements.genres.create}
                  element={<CreateGenre />}
                />
                <Route
                  path={paths.dashboardPaths.managements.genres.update}
                  element={<UpdateGenre />}
                />

                {/* movie */}
                <Route
                  path={paths.dashboardPaths.managements.movies.list}
                  element={<ListMovie />}
                />
                <Route
                  path={paths.dashboardPaths.managements.movies.create}
                  element={<CreateMovie />}
                />
                <Route
                  path={paths.dashboardPaths.managements.movies.update}
                  element={<UpdateMovie />}
                />

                {/* room */}
                <Route
                  path={paths.dashboardPaths.managements.rooms.list}
                  element={<ListRoom />}
                />
                <Route
                  path={paths.dashboardPaths.managements.rooms.create}
                  element={<CreateRoom />}
                />
                <Route
                  path={paths.dashboardPaths.managements.rooms.update}
                  element={<UpdateRoom />}
                />

                {/* seat */}
                <Route
                  path={paths.dashboardPaths.managements.seats.list}
                  element={<ListSeat />}
                />
                <Route
                  path={paths.dashboardPaths.managements.seats.create}
                  element={<CreateSeat />}
                />
                <Route
                  path={paths.dashboardPaths.managements.seats.update}
                  element={<UpdateSeat />}
                />
                <Route
                  path={paths.dashboardPaths.managements.seatStatus.list}
                  element={<ListSeatStatus />}
                />

                {/* showtime */}
                <Route
                  path={paths.dashboardPaths.managements.showtimes.list}
                  element={<ListShowtime />}
                />
                <Route
                  path={paths.dashboardPaths.managements.showtimes.create}
                  element={<CreateShowtime />}
                />
                <Route
                  path={paths.dashboardPaths.managements.showtimes.update}
                  element={<UpdateShowtime />}
                />

                {/* promotion */}
                <Route
                  path={paths.dashboardPaths.managements.promotions.list}
                  element={<ListPromotion />}
                />
                <Route
                  path={paths.dashboardPaths.managements.promotions.create}
                  element={<CreatePromotion />}
                />
                <Route
                  path={paths.dashboardPaths.managements.promotions.update}
                  element={<UpdatePromotion />}
                />

                {/* product category */}
                <Route
                  path={paths.dashboardPaths.managements.productCategories.list}
                  element={<ListProductCategory />}
                />
                <Route
                  path={
                    paths.dashboardPaths.managements.productCategories.create
                  }
                  element={<CreateProductCategory />}
                />
                <Route
                  path={
                    paths.dashboardPaths.managements.productCategories.update
                  }
                  element={<UpdateProductCategory />}
                />

                {/* product */}
                <Route
                  path={paths.dashboardPaths.managements.products.list}
                  element={<ListProduct />}
                />
                <Route
                  path={paths.dashboardPaths.managements.products.create}
                  element={<CreateProduct />}
                />
                <Route
                  path={paths.dashboardPaths.managements.products.update}
                  element={<UpdateProduct />}
                />

                {/* movie ticket */}
                <Route
                  path={paths.dashboardPaths.managements.movieTickets.list}
                  element={<ListMovieTicket />}
                />
                <Route
                  path={paths.dashboardPaths.managements.movieTickets.create}
                  element={<CreateMovieTicket />}
                />
                <Route
                  path={paths.dashboardPaths.managements.movieTickets.update}
                  element={<UpdateMovieTicket />}
                />
                <Route
                  path={paths.dashboardPaths.managements.chooseSeat}
                  element={<ChooseSeat />}
                />
                <Route
                  path={paths.dashboardPaths.managements.payment}
                  element={<Payment />}
                />
                <Route
                  path={paths.dashboardPaths.managements.movieTickets.detail}
                  element={<DetailMovieTicket />}
                />

                {/* service ticket */}
                <Route
                  path={paths.dashboardPaths.managements.serviceTickets.list}
                  element={<ListServiceTicket />}
                />
                <Route
                  path={paths.dashboardPaths.managements.serviceTickets.create}
                  element={<CreateServiceTicket />}
                />
                <Route
                  path={paths.dashboardPaths.managements.serviceTickets.update}
                  element={<UpdateServiceTicket />}
                />
                <Route
                  path={paths.dashboardPaths.managements.serviceTickets.detail}
                  element={<DetailServiceTicket />}
                />
              </Route>
              <Route
                path='*'
                element={<Navigate to={paths.userPaths.notFound} replace />}
              />
              <Route path={paths.userPaths.notFound} element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </PayPalScriptProvider>
    </PersistGate>
  </Provider>,
)
