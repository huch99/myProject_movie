// Axios 인스턴스 및 공통 설정
import axios from 'axios';
import storageUtils from '../utils/storageUtils';

// API 기본 URL 설정
const API_URL = import.meta.env.VITE_API_KEY || 'http://localhost:8080/api';

// axios 인스턴스 생성
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 요청 타임아웃 10초
});

// 요청 인터셉터 - 토큰 추가
api.interceptors.request.use(
  (config) => {
    const token = storageUtils.token.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 에러 처리 및 토큰 갱신
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // 401 에러이고, 토큰 만료이며, 재시도하지 않은 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = storageUtils.token.getRefreshToken();
        if (!refreshToken) {
          // 리프레시 토큰이 없으면 로그아웃 처리
          storageUtils.token.clearTokens();
          storageUtils.user.clearUserInfo();
          window.location.href = '/login';
          return Promise.reject(error);
        }
        
        // 토큰 갱신 요청
        const response = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
        const { accessToken, refreshToken: newRefreshToken } = response.data;
        
        // 새 토큰 저장
        storageUtils.token.setAccessToken(accessToken);
        storageUtils.token.setRefreshToken(newRefreshToken);
        
        // 원래 요청 헤더에 새 토큰 설정
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        
        // 원래 요청 재시도
        return axios(originalRequest);
      } catch (refreshError) {
        // 토큰 갱신 실패 시 로그아웃 처리
        storageUtils.token.clearTokens();
        storageUtils.user.clearUserInfo();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    // 다른 에러는 그대로 반환
    return Promise.reject(error);
  }
);

// API 요청 함수들
const apiService = {
  // 인증 관련 API
  auth: {
    login: (email, password) => api.post('/auth/login', { email, password }),
    register: (userData) => api.post('/auth/register', userData),
    logout: () => api.post('/auth/logout'),
    refreshToken: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
    verifyEmail: (token) => api.get(`/auth/verify-email?token=${token}`),
    forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
    resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
  },
  
  // 사용자 관련 API
  users: {
    getCurrentUser: () => api.get('/users/me'),
    updateProfile: (userData) => api.put('/users/profile', userData),
    changePassword: (currentPassword, newPassword) => api.put('/users/password', { currentPassword, newPassword }),
    getReservations: () => api.get('/users/reservations'),
    getCoupons: () => api.get('/users/coupons'),
  },
  
  // 영화 관련 API
  movies: {
    getAll: (params) => api.get('/movies', { params }),
    getById: (id) => api.get(`/movies/${id}`),
    getScreenings: (movieId, date) => api.get(`/movies/${movieId}/screenings`, { params: { date } }),
    getReviews: (movieId, page = 0, size = 10) => api.get(`/movies/${movieId}/reviews`, { params: { page, size } }),
    addReview: (movieId, reviewData) => api.post(`/movies/${movieId}/reviews`, reviewData),
    updateReview: (movieId, reviewId, reviewData) => api.put(`/movies/${movieId}/reviews/${reviewId}`, reviewData),
    deleteReview: (movieId, reviewId) => api.delete(`/movies/${movieId}/reviews/${reviewId}`),
  },
  
  // 극장 관련 API
  theaters: {
    getAll: () => api.get('/theaters'),
    getById: (id) => api.get(`/theaters/${id}`),
    getScreens: (theaterId) => api.get(`/theaters/${theaterId}/screens`),
    getSchedules: (theaterId, date) => api.get(`/theaters/${theaterId}/schedules`, { params: { date } }),
  },
  
  // 예매 관련 API
  reservations: {
    checkSeatAvailability: (screeningId) => api.get(`/reservations/seats/available`, { params: { screeningId } }),
    createReservation: (reservationData) => api.post('/reservations', reservationData),
    getReservation: (id) => api.get(`/reservations/${id}`),
    cancelReservation: (id) => api.delete(`/reservations/${id}`),
    validateReservation: (reservationData) => api.post('/reservations/validate', reservationData),
  },
  
  // 결제 관련 API
  payments: {
    processPayment: (paymentData) => api.post('/payments', paymentData),
    getPaymentStatus: (id) => api.get(`/payments/${id}`),
    cancelPayment: (id) => api.post(`/payments/${id}/cancel`),
  },
  
  // 쿠폰 관련 API
  coupons: {
    getAll: () => api.get('/coupons'),
    getById: (id) => api.get(`/coupons/${id}`),
    apply: (couponCode) => api.post('/coupons/apply', { couponCode }),
    validate: (couponCode, reservationId) => api.post('/coupons/validate', { couponCode, reservationId }),
    getUserCoupons: () => api.get('/users/me/coupons'),
  },
  
  // 검색 관련 API
  search: {
    movies: (query) => api.get('/search/movies', { params: { query } }),
    theaters: (query) => api.get('/search/theaters', { params: { query } }),
     all: (query) => api.get('/search', { params: { query } }),
  },
};


// 특정 영화 상세 정보 가져오기
export const fetchMovieById = async (movieId) => {
  try {
    const response = await api.get(`/movies/${movieId}`); //apiClient >> api
    return response.data;
  } catch (error) {
    console.error(`영화 상세 정보를 불러오는 중 오류가 발생했습니다:`, error);
    throw error;
  }
};

// 현재 상영 중인 영화 목록 가져오기
export const fetchNowPlayingMovies = async () => {
  try {
    const response = await api.get('/movies/now-playing');  //apiClient >> api
    return response.data;
  } catch (error) {
    console.error('현재 상영 중인 영화 목록을 불러오는 중 오류가 발생했습니다:', error);
    throw error;
  }
};

export default apiService;