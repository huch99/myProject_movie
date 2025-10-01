// 영화 예매 사이트에서 사용할 상수값들을 정의합니다.

// 영화 관련 상수
export const MOVIE_AGE_RATINGS = {
  ALL: '전체관람가',
  '12': '12세 이상 관람가',
  '15': '15세 이상 관람가',
  '18': '청소년 관람불가',
};

export const MOVIE_GENRES = [
  '액션',
  '모험',
  '애니메이션',
  '코미디',
  '범죄',
  '다큐멘터리',
  '드라마',
  '가족',
  '판타지',
  '역사',
  '공포',
  '음악',
  '미스터리',
  '로맨스',
  'SF',
  '스릴러',
  '전쟁',
  '서부',
];

// 예매 관련 상수
export const TICKET_TYPES = {
  adult: {
    name: '성인',
    discount: 0,
  },
  teen: {
    name: '청소년',
    discount: 2000,
  },
  child: {
    name: '어린이',
    discount: 6000,
  },
};

export const SEAT_TYPES = {
  regular: '일반',
  premium: '프리미엄',
  disabled: '장애인석',
  empty: '통로',
};

export const SEAT_STATUS = {
  available: '예매 가능',
  occupied: '예매됨',
  selected: '선택됨',
  disabled: '선택 불가',
};

// 극장 관련 상수
export const SPECIAL_SCREEN_TYPES = [
  'IMAX',
  '4DX',
  'SCREENX',
  'DOLBY CINEMA',
  'COMFORT',
];

export const THEATER_LOCATIONS = [
  '서울',
  '경기',
  '인천',
  '강원',
  '대전/충청',
  '대구',
  '부산/울산',
  '경상',
  '광주/전라/제주',
];

// 결제 관련 상수
export const PAYMENT_METHODS = [
  '신용카드',
  '카카오페이',
  '네이버페이',
  '토스페이',
  '휴대폰결제',
];

export const PAYMENT_STATUS = {
  pending: '결제 대기중',
  completed: '결제 완료',
  cancelled: '결제 취소',
};

// API 엔드포인트
export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    changePassword: '/auth/change-password',
  },
  movies: {
    list: '/movies',
    detail: (id: number) => `/movies/${id}`,
    nowPlaying: '/movies/now-playing',
    comingSoon: '/movies/coming-soon',
    similar: (id: number) => `/movies/${id}/similar`,
    search: '/movies/search',
  },
  theaters: {
    list: '/theaters',
    detail: (id: number) => `/theaters/${id}`,
    locations: '/theaters/locations',
    screens: (id: number) => `/theaters/${id}/screens`,
  },
  bookings: {
    create: '/bookings',
    detail: (id: number) => `/bookings/${id}`,
    myBookings: '/bookings/my',
    cancel: (id: number) => `/bookings/${id}`,
  },
  screenings: {
    list: '/screenings',
    detail: (id: number) => `/screenings/${id}`,
    seats: (id: number) => `/screenings/${id}/seats`,
  },
};

// 로컬 스토리지 키
export const STORAGE_KEYS = {
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
  user: 'user',
};

// 페이지네이션 기본값
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_CURRENT_PAGE = 1;