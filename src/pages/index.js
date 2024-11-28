// *** USER PAGES

import Account from './UserInterface/Account/Account'
import Login from './UserInterface/Auth/Login/Login'
import ForgotPassword from './UserInterface/Auth/Login/ForgotPassword/ForgotPassword'
import ResetPassword from './UserInterface/Auth/Login/ResetPassword/ResetPassword'
import Register from './UserInterface/Auth/Register/Register'
import VerifyOTP from './UserInterface/Auth/Register/VerifyOTP/VerifyOTP'
import Home from './UserInterface/Home/Home'
import MovieDetails from './UserInterface/MovieDetails/MovieDetails'
import MovieLists from './UserInterface/MovieLists/MovieLists'
import Profile from './UserInterface/Profile/Profile'
import Showtimes from './UserInterface/Showtimes/Showtimes'
import NotFound from './NotFound/NotFound'
import Order from './UserInterface/Order/Order'
import OrderSuccess from './UserInterface/OrderSuccess/OrderSuccess'
import OrderCancel from './UserInterface/OderCancel/OrderCancel'

// private auth
import PrivateLogin from './Dashboard/PrivateAuth/PrivateLogin/PrivateLogin'
import PrivateForgotPassword from './Dashboard/PrivateAuth/PrivateLogin/PrivateForgotPassword/PrivateForgotPassword'
import PrivateResetPassword from './Dashboard/PrivateAuth/PrivateLogin/PrivateResetPassword/PrivateResetPassword'
import PrivateProfile from './Dashboard/PrivateProfile/PrivateProfile'
import ShowtimeDetails from './UserInterface/ShowtimeDetails/ShowtimeDetails'
import WatchedMovies from './UserInterface/WatchedMovies/WatchedMovies'

// *** PROTECTED PAGES
import Dashboard from './Dashboard/Dashboard'

// admin
import ListAccount from './Dashboard/Managements/Accounts/ListAccount/ListAccount'
import CreateAccount from './Dashboard/Managements/Accounts/CreateAccount/CreateAccount'
import UpdateAccount from './Dashboard/Managements/Accounts/UpdateAccount/UpdateAccount'
import ListCinema from './Dashboard/Managements/Cinemas/ListCinema/ListCinema'
import CreateCinema from './Dashboard/Managements/Cinemas/CreateCinema/CreateCinema'
import UpdateCinema from './Dashboard/Managements/Cinemas/UpdateCinema/UpdateCinema'
import ListCinemaComplex from './Dashboard/Managements/CinemaComplexes/ListCinemaComplex/ListCinemaComplex'
import CreateCinemaComplex from './Dashboard/Managements/CinemaComplexes/CreateCinemaComplex/CreateCinemaComplex'
import UpdateCinemaComplex from './Dashboard/Managements/CinemaComplexes/UpdateCinemaComplex/UpdateCinemaComplex'
import ListMovie from './Dashboard/Managements/Movies/ListMovie/ListMovie'
import CreateMovie from './Dashboard/Managements/Movies/CreateMovie/CreateMovie'
import UpdateMovie from './Dashboard/Managements/Movies/UpdateMovie/UpdateMovie'
import ListRoom from './Dashboard/Managements/Rooms/ListRoom/ListRoom'
import CreateRoom from './Dashboard/Managements/Rooms/CreateRoom/CreateRoom'
import UpdateRoom from './Dashboard/Managements/Rooms/UpdateRoom/UpdateRoom'
import ListSeat from './Dashboard/Managements/Seats/ListSeat/ListSeat'
import CreateSeat from './Dashboard/Managements/Seats/CreateSeat/CreateSeat'
import UpdateSeat from './Dashboard/Managements/Seats/UpdateSeat/UpdateSeat'
import ListGenre from './Dashboard/Managements/Genres/ListGenre/ListGenre'
import CreateGenre from './Dashboard/Managements/Genres/CreateGenre/CreateGenre'
import UpdateGenre from './Dashboard/Managements/Genres/UpdateGenre/UpdateGenre'
import ListSystemAccount from './Dashboard/Managements/SystemAccounts/ListSystemAccount/ListSystemAccount'
import CreateSystemAccount from './Dashboard/Managements/SystemAccounts/CreateSystemAccount/CreateSystemAccount'
import UpdateSystemAccount from './Dashboard/Managements/SystemAccounts/UpdateSystemAccount/UpdateSystemAccount'

// manager
import ListShowtime from './Dashboard/Managements/Showtimes/ListShowtime/ListShowtime'
import CreateShowtime from './Dashboard/Managements/Showtimes/CreateShowtime/CreateShowtime'
import UpdateShowtime from './Dashboard/Managements/Showtimes/UpdateShowtime/UpdateShowtime'
import ListTicketReport from './Dashboard/Managements/TicketReports/ListTicketReport/ListTicketReport'
import CreateTicketReport from './Dashboard/Managements/TicketReports/CreateTicketReport/CreateTicketReport'
import UpdateTicketReport from './Dashboard/Managements/TicketReports/UpdateTicketReport/UpdateTicketReport'
import ListProductCategory from './Dashboard/Managements/ProductCategories/ListProductCategory/ListProductCategory'
import CreateProductCategory from './Dashboard/Managements/ProductCategories/CreateProductCategory/CreateProductCategory'
import UpdateProductCategory from './Dashboard/Managements/ProductCategories/UpdateProductCategory/UpdateProductCategory'
import ListProduct from './Dashboard/Managements/Products/ListProduct/ListProduct'
import CreateProduct from './Dashboard/Managements/Products/CreateProduct/CreateProduct'
import UpdateProduct from './Dashboard/Managements/Products/UpdateProduct/UpdateProduct'
import ListCashier from './Dashboard/Managements/SystemAccounts/ListCashier/ListCashier'
import ListPromotion from './Dashboard/Managements/Promotions/ListPromotion/ListPromotion'
import CreatePromotion from './Dashboard/Managements/Promotions/CreatePromotion/CreatePromotion'
import UpdatePromotion from './Dashboard/Managements/Promotions/UpdatePromotion/UpdatePromotion'

// cashier
import ListMovieTicket from './Dashboard/Managements/MovieTickets/ListMovieTicket/ListMovieTicket'
import CreateMovieTicket from './Dashboard/Managements/MovieTickets/CreateMovieTicket/CreateMovieTicket'
import UpdateMovieTicket from './Dashboard/Managements/MovieTickets/UpdateMovieTicket/UpdateMovieTicket'
import ListServiceTicket from './Dashboard/Managements/ServiceTickets/ListServiceTicket/ListServiceTicket'
import CreateServiceTicket from './Dashboard/Managements/ServiceTickets/CreateServiceTicket/CreateServiceTicket'
import UpdateServiceTicket from './Dashboard/Managements/ServiceTickets/UpdateServiceTicket/UpdateServiceTicket'
import DetailServiceTicket from './Dashboard/Managements/ServiceTickets/DetailServiceTicket/DetailServiceTicket'
import ChooseSeat from './Dashboard/Managements/MovieTickets/ChooseSeat/ChooseSeat'
import Payment from './Dashboard/Managements/MovieTickets/Payment/Payment'
import DetailMovieTicket from './Dashboard/Managements/MovieTickets/DetailMovieTicket/DetailMovieTicket'

export {
  // not found
  NotFound,

  // user pages
  Account,
  Login,
  ForgotPassword,
  ResetPassword,
  Register,
  VerifyOTP,
  Home,
  MovieDetails,
  MovieLists,
  Profile,
  Showtimes,
  ShowtimeDetails,
  Order,
  WatchedMovies,
  OrderSuccess,
  OrderCancel,

  // private auth
  PrivateLogin,
  PrivateForgotPassword,
  PrivateResetPassword,
  PrivateProfile,

  // protected pages
  Dashboard,

  // admin
  ListAccount,
  CreateAccount,
  UpdateAccount,
  ListCinema,
  CreateCinema,
  UpdateCinema,
  ListCinemaComplex,
  CreateCinemaComplex,
  UpdateCinemaComplex,
  ListRoom,
  CreateRoom,
  UpdateRoom,
  ListMovie,
  CreateMovie,
  UpdateMovie,
  ListSeat,
  CreateSeat,
  UpdateSeat,
  ListGenre,
  CreateGenre,
  UpdateGenre,
  ListSystemAccount,
  CreateSystemAccount,
  UpdateSystemAccount,

  // manager
  ListShowtime,
  CreateShowtime,
  UpdateShowtime,
  ListTicketReport,
  CreateTicketReport,
  UpdateTicketReport,
  ListProductCategory,
  CreateProductCategory,
  UpdateProductCategory,
  ListProduct,
  CreateProduct,
  UpdateProduct,
  ListCashier,
  ListPromotion,
  CreatePromotion,
  UpdatePromotion,

  // cashier
  ListMovieTicket,
  CreateMovieTicket,
  UpdateMovieTicket,
  ListServiceTicket,
  CreateServiceTicket,
  UpdateServiceTicket,
  DetailServiceTicket,
  ChooseSeat,
  Payment,
  DetailMovieTicket,
}
