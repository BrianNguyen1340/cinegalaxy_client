const userPaths = {
  home: '/',
  account: '/account',
  login: '/login',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password/:token',
  register: '/register',
  verifyOtp: '/verify-otp',
  cinemas: '/cinemas',
  contact: '/contact',
  giftShop: '/gift-shop',
  movieDetails: '/movie/:id',
  movieLists: '/movies',
  promotions: '/promotions',
  showtimes: '/showtimes',
  support: '/support',
  showtimeDetails: '/showtime/:id',

  profile: '/profile',
  payments: '/payments',
  coupons: '/coupons',
  pointsHistory: '/point-history',
  ticketPurchaseHistory: '/ticket-purchase-history',
  watchedMovies: '/watched-movies',
  membership: '/membership',
  order: '/order',
  orderDetails: '/order/:id',
  orderSuccess: '/order-success',
  orderCancel: '/order-cancel',

  notFound: '/not-found',

  privateLogin: '/private-login',
  privateForgotPassword: '/private-forgot-password',
  privateResetPassword: '/private-reset-password/:token',
}

const dashboardPaths = {
  privateProfile: '/private-profile',
  dashboard: '/dashboard',
  managements: {
    accounts: {
      list: '/list-accounts',
      create: '/create-account',
      update: '/update-account/:id',
      delete: '/delete-account/:id',
    },
    systemAccounts: {
      list: '/list-system-accounts',
      listCashiers: '/list-cashiers',
      create: '/create-system-account',
      update: '/update-system-account/:id',
      delete: '/delete-system-account/:id',
    },
    genres: {
      list: '/list-genres',
      create: '/create-genre',
      update: '/update-genre/:id',
      delete: '/delete-genre/:id',
    },
    cinemas: {
      list: '/list-cinemas',
      create: '/create-cinema',
      update: '/update-cinema/:id',
      delete: '/delete-cinema/:id',
    },
    cinemaComplexes: {
      list: '/list-cinema-complexes',
      create: '/create-cinema-complex',
      update: '/update-cinema-complex/:id',
      delete: '/delete-cinema-complex/:id',
    },
    movies: {
      list: '/list-movies',
      create: '/create-movie',
      update: '/update-movie/:id',
      delete: '/delete-movie/:id',
    },
    rooms: {
      list: '/list-rooms',
      create: '/create-room',
      update: '/update-room/:id',
      delete: '/delete-room/:id',
    },
    seats: {
      list: '/list-seats',
      create: '/create-seats',
      update: '/update-seat/:id',
      delete: '/delete-seat/:id',
    },

    showtimes: {
      list: '/list-showtimes',
      create: '/create-showtime',
      update: '/update-showtime/:id',
      delete: '/delete-showtime/:id',
    },
    promotions: {
      list: '/list-promotions',
      create: '/create-promotions',
      update: '/update-promotion/:id',
      delete: '/delete-promotion/:id',
    },
    productCategories: {
      list: '/list-product-categories',
      create: '/create-product-category',
      update: '/update-product-category/:id',
      delete: '/delete-product-category/:id',
    },
    products: {
      list: '/list-products',
      create: '/create-product',
      update: '/update-product/:id',
      delete: '/delete-product/:id',
    },

    ticketReports: {
      list: '/list-reports',
      create: '/create-report',
      update: '/update-report/:id',
      delete: '/delete-report/:id',
    },
    serviceTickets: {
      list: '/list-service-tickets',
      create: '/create-service-ticket',
      update: '/update-service-ticket/:id',
      delete: '/delete-service-ticket/:id',
      detail: '/detail-service-ticket/:id',
    },
    movieTickets: {
      list: '/list-movie-tickets',
      create: '/create-movie-ticket',
      update: '/update-movie-ticket/:id',
      delete: '/delete-movie-ticket/:id',
      detail: '/detail-movie-ticket/:id',
    },
    chooseSeat: '/choose-seat/:id',
    payment: '/payment/:id',
  },
  statistics: {
    cinemaSales: {},
    customerSales: {},
    movieSales: {},
    serviceSales: {},
    showtimeSales: {},
    ticketSales: {},
  },
}

export const paths = {
  userPaths,
  dashboardPaths,
}
