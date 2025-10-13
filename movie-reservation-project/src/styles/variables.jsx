// 스타일 변수
/**
 * 영화 예매 사이트에서 사용되는 공통 변수 정의
 * 프로젝트 전반에 걸쳐 일관된 값을 사용하기 위한 파일입니다.
 */

// 화면 크기 (반응형 디자인)
export const SCREEN_SIZES = {
  MOBILE: '480px',
  TABLET: '768px',
  LAPTOP: '1024px',
  DESKTOP: '1200px'
};

// 미디어 쿼리 (styled-components에서 사용)
export const MEDIA_QUERIES = {
  MOBILE: `@media (max-width: ${SCREEN_SIZES.MOBILE})`,
  TABLET: `@media (max-width: ${SCREEN_SIZES.TABLET})`,
  LAPTOP: `@media (max-width: ${SCREEN_SIZES.LAPTOP})`,
  DESKTOP: `@media (max-width: ${SCREEN_SIZES.DESKTOP})`
};

// 애니메이션 지속 시간
export const ANIMATION_DURATION = {
  FAST: '0.15s',
  DEFAULT: '0.3s',
  SLOW: '0.5s'
};

// 영화 등급 (관람가)
export const MOVIE_RATINGS = {
  ALL: '전체관람가',
  TWELVE: '12세이상관람가',
  FIFTEEN: '15세이상관람가',
  ADULT: '청소년관람불가'
};

// 영화 등급 아이콘 매핑
export const MOVIE_RATING_ICONS = {
  ALL: '/images/rating_all.png',
  TWELVE: '/images/rating_12.png',
  FIFTEEN: '/images/rating_15.png',
  ADULT: '/images/rating_19.png'
};

// 좌석 상태
export const SEAT_STATUS = {
  AVAILABLE: 'available',
  SELECTED: 'selected',
  OCCUPIED: 'occupied',
  DISABLED: 'disabled'
};

// 좌석 등급
export const SEAT_GRADES = {
  STANDARD: 'standard',
  PREMIUM: 'premium',
  VIP: 'vip'
};

// 좌석 가격 (등급별)
export const SEAT_PRICES = {
  [SEAT_GRADES.STANDARD]: {
    ADULT: 13000,
    TEEN: 10000,
    CHILD: 8000,
    SENIOR: 8000
  },
  [SEAT_GRADES.PREMIUM]: {
    ADULT: 15000,
    TEEN: 12000,
    CHILD: 10000,
    SENIOR: 10000
  },
  [SEAT_GRADES.VIP]: {
    ADULT: 18000,
    TEEN: 15000,
    CHILD: 12000,
    SENIOR: 12000
  }
};

// 관람객 유형
export const AUDIENCE_TYPES = {
  ADULT: '성인',
  TEEN: '청소년',
  CHILD: '어린이',
  SENIOR: '경로'
};

// 상영 유형
export const SCREENING_TYPES = {
  STANDARD: '2D',
  THREE_D: '3D',
  FOUR_D: '4DX',
  IMAX: 'IMAX',
  PREMIUM: '프리미엄'
};

// 결제 수단
export const PAYMENT_METHODS = {
  CREDIT_CARD: '신용카드',
  KAKAO_PAY: '카카오페이',
  NAVER_PAY: '네이버페이',
  BANK_TRANSFER: '계좌이체',
  MOBILE: '휴대폰결제'
};

// 예매 상태
export const RESERVATION_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELED: 'canceled',
  COMPLETED: 'completed'
};

// 날짜 포맷
export const DATE_FORMATS = {
  YEAR_MONTH_DAY: 'YYYY-MM-DD',
  YEAR_MONTH_DAY_KR: 'YYYY년 MM월 DD일',
  MONTH_DAY: 'MM.DD',
  DAY_OF_WEEK: 'ddd',
  TIME: 'HH:mm',
  DATE_TIME: 'YYYY-MM-DD HH:mm',
  DATE_TIME_KR: 'YYYY년 MM월 DD일 HH시 mm분'
};

// 로컬 스토리지 키
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER_INFO: 'userInfo',
  THEME: 'theme',
  RECENT_MOVIES: 'recentMovies',
  RECENT_THEATERS: 'recentTheaters',
  FAVORITE_THEATERS: 'favoriteTheaters',
  RESERVATION_DATA: 'reservationData',
  SELECTED_SEATS: 'selectedSeats',
  SEARCH_KEYWORDS: 'searchKeywords'
};

// API 요청 타임아웃 (ms)
export const API_TIMEOUT = 10000;

// 페이지네이션 기본값
export const PAGINATION = {
  DEFAULT_PAGE: 0,
  DEFAULT_SIZE: 10,
  MOVIES_PER_PAGE: 12,
  THEATERS_PER_PAGE: 8
};

// 최대 선택 가능한 좌석 수
export const MAX_SELECTABLE_SEATS = 8;

// 좌석 선택 제한 시간 (분)
export const SEAT_SELECTION_TIMEOUT = 10;

export default {
  SCREEN_SIZES,
  MEDIA_QUERIES,
  ANIMATION_DURATION,
  MOVIE_RATINGS,
  MOVIE_RATING_ICONS,
  SEAT_STATUS,
  SEAT_GRADES,
  SEAT_PRICES,
  AUDIENCE_TYPES,
  SCREENING_TYPES,
  PAYMENT_METHODS,
  RESERVATION_STATUS,
  DATE_FORMATS,
  STORAGE_KEYS,
  API_TIMEOUT,
  PAGINATION,
  MAX_SELECTABLE_SEATS,
  SEAT_SELECTION_TIMEOUT
};