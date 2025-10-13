// 라우트 경로 상수
/**
 * 애플리케이션의 모든 경로(URL path)를 상수로 정의합니다.
 * 경로가 변경될 경우 이 파일만 수정하면 됩니다.
 * 동적 경로는 함수 형태로 정의하여 ID 등을 전달받도록 합니다.
 */

const ROUTE_PATHS = {
  // 메인 및 홈
  HOME: '/',
  
  // 인증 및 사용자 관련
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  MYPAGE: '/mypage', // 마이페이지는 하위 경로를 가질 수 있습니다.
  
  // 영화 관련
  MOVIES: '/movies',
  MOVIE_DETAIL: (movieId = ':id') => `/movies/${movieId}`,
  NOW_PLAYING: '/movies/now-playing',
  COMING_SOON: '/movies/coming-soon',
  POPULAR_MOVIES: '/movies/popular',
  
  // 극장 관련
  THEATERS: '/theaters',
  THEATER_DETAIL: (theaterId = ':id') => `/theaters/${theaterId}`,
  
  // 예매 관련
  RESERVATION: (movieId = ':movieId') => `/reservation/${movieId}`,
  RESERVATION_DETAIL: (reservationId = ':id') => `/reservations/${reservationId}`,
  
  // 결제 관련
  PAYMENT: (reservationId = ':reservationId') => `/payment/${reservationId}`,
  PAYMENT_RESULT: (paymentId = ':id') => `/payment-result/${paymentId}`,
  
  // 검색
  SEARCH: '/search',

  // 마이페이지 하위 경로 (MyPage 컴포넌트 내에서 <Routes>로 처리될 수 있습니다)
  MYPAGE_INFO: '/mypage/info',
  MYPAGE_RESERVATIONS: '/mypage/reservations',
  MYPAGE_REVIEWS: '/mypage/reviews',
  MYPAGE_COUPONS: '/mypage/coupons',
  MYPAGE_SETTINGS: '/mypage/settings',
};

export default ROUTE_PATHS;