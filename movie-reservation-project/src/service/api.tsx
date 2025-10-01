import type { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import axios from "axios";

// API 기본 설정
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const DEFAULT_TIMEOUT = 30000; // 30초

// axios 인스턴스 생성
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: DEFAULT_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// 요청 인터셉터
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 로컬 스토리지에서 토큰 가져오기
    const token = localStorage.getItem('accessToken');
    
    // 토큰이 있으면 헤더에 추가
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // 응답 데이터 처리 (필요시)
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    // 401 Unauthorized 에러 처리 (토큰 만료)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // 리프레시 토큰으로 새 액세스 토큰 요청
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (!refreshToken) {
          // 리프레시 토큰이 없으면 로그아웃 처리
          localStorage.removeItem('accessToken');
          window.location.href = '/login'; // 로그인 페이지로 리다이렉트
          return Promise.reject(error);
        }
        
        // 토큰 갱신 요청
        const response = await axios.post(`${BASE_URL}/auth/refresh`, {
          refreshToken,
        });
        
        const { accessToken } = response.data;
        
        // 새 액세스 토큰 저장
        localStorage.setItem('accessToken', accessToken);
        
        // 원래 요청의 Authorization 헤더 업데이트
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        
        // 원래 요청 재시도
        return apiClient(originalRequest);
      } catch (refreshError) {
        // 리프레시 토큰도 만료된 경우 로그아웃 처리
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login'; // 로그인 페이지로 리다이렉트
        return Promise.reject(refreshError);
      }
    }
    
    // 서버 에러 (500) 처리
    if (error.response?.status === 500) {
      console.error('서버 오류가 발생했습니다:', error);
      // 추가적인 에러 처리 로직 (에러 로깅 서비스 등)
    }
    
    return Promise.reject(error);
  }
);

// HTTP 메소드 래퍼 함수들
export const api = {
  get: <T = any>(url: string, config?: any): Promise<AxiosResponse<T>> => {
    return apiClient.get<T>(url, config);
  },
  
  post: <T = any>(url: string, data?: any, config?: any): Promise<AxiosResponse<T>> => {
    return apiClient.post<T>(url, data, config);
  },
  
  put: <T = any>(url: string, data?: any, config?: any): Promise<AxiosResponse<T>> => {
    return apiClient.put<T>(url, data, config);
  },
  
  patch: <T = any>(url: string, data?: any, config?: any): Promise<AxiosResponse<T>> => {
    return apiClient.patch<T>(url, data, config);
  },
  
  delete: <T = any>(url: string, config?: any): Promise<AxiosResponse<T>> => {
    return apiClient.delete<T>(url, config);
  }
};

export default api;