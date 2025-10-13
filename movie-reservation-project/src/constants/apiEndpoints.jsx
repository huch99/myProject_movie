// API 엔드포인트 상수
/**
 * API 엔드포인트 상수 정의
 * 백엔드 API 주소가 변경될 경우 이 파일만 수정하면 됩니다.
 */

// 기본 API URL
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// API 엔드포인트 정의
const API_ENDPOINTS = {
  // 인증 관련 엔드포인트
  AUTH: {
    LOGIN: `${BASE_URL}/auth/login`,
    REGISTER: `${BASE_URL}/auth/register`,
    LOGOUT: `${BASE_URL}/auth/logout`,
    REFRESH_TOKEN: `${BASE_URL}/auth/refresh`,
    VERIFY_EMAIL: `${BASE_URL}/auth/verify-email`,
    FORGOT_PASSWORD: `${BASE_URL}/auth/forgot-password`,
    RESET_PASSWORD: `${BASE_URL}/auth/reset-password`,
  },
  
  // 사용자 관련 엔드포인트
  USERS: {
    CURRENT: `${BASE_URL}/users/me`,
    PROFILE: `${BASE_URL}/users/profile`,
    PASSWORD: `${BASE_URL}/users/password`,
    RESERVATIONS: `${BASE_URL}/users/reservations`,
    COUPONS: `${BASE_URL}/users/coupons`,
    NOTIFICATION_SETTINGS: `${BASE_URL}/users/notification-settings`,
    POINTS: `${BASE_URL}/users/points`,
    REVIEWS: `${BASE_URL}/users/reviews`,
    PROFILE_IMAGE: `${BASE_URL}/users/profile-image`,
  },
  
  // 영화 관련 엔드포인트
  MOVIES: {
    ALL: `${BASE_URL}/movies`,
    BY_ID: (id) => `${BASE_URL}/movies/${id}`,
    SCREENINGS: (id) => `${BASE_URL}/movies/${id}/screenings`,
    REVIEWS: (id) => `${BASE_URL}/movies/${id}/reviews`,
    NOW_PLAYING: `${BASE_URL}/movies/now-playing`,
    COMING_SOON: `${BASE_URL}/movies/coming-soon`,
    POPULAR: `${BASE_URL}/movies/popular`,
  },
  
  // 극장 관련 엔드포인트
  THEATERS: {
    ALL: `${BASE_URL}/theaters`,
    BY_ID: (id) => `${BASE_URL}/theaters/${id}`,
    SCREENS: (id) => `${BASE_URL}/theaters/${id}/screens`,
    SCHEDULES: (id) => `${BASE_URL}/theaters/${id}/schedules`,
  },
  
  // 예매 관련 엔드포인트
  RESERVATIONS: {
    CREATE: `${BASE_URL}/reservations`,
    BY_ID: (id) => `${BASE_URL}/reservations/${id}`,
    CANCEL: (id) => `${BASE_URL}/reservations/${id}`,
    VALIDATE: `${BASE_URL}/reservations/validate`,
    SEATS_AVAILABLE: `${BASE_URL}/reservations/seats/available`,
  },
  
  // 결제 관련 엔드포인트
  PAYMENTS: {
    CREATE: `${BASE_URL}/payments`,
    BY_ID: (id) => `${BASE_URL}/payments/${id}`,
    CANCEL: (id) => `${BASE_URL}/payments/${id}/cancel`,
  },
  
  // 쿠폰 관련 엔드포인트
  COUPONS: {
    ALL: `${BASE_URL}/coupons`,
    BY_ID: (id) => `${BASE_URL}/coupons/${id}`,
    APPLY: `${BASE_URL}/coupons/apply`,
  },
  
  // 검색 관련 엔드포인트
  SEARCH: {
    MOVIES: `${BASE_URL}/search/movies`,
    THEATERS: `${BASE_URL}/search/theaters`,
  },
};

export default API_ENDPOINTS;