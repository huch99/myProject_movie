// 인증 관련 API
import apiService from './api';
import api from './api';
// 로그인 서비스
export const login = async (email, password) => {
  try {
    const response = await apiService.auth.login(email, password);
    return response;
  } catch (error) {
    console.error('authService - 로그인 실패:', error);
    throw error;
  }
};

// 회원가입 서비스
export const register = async (userData) => {
  try {
    // apiService 객체의 auth 모듈 안에 있는 register 함수를 호출합니다.
    const response = await apiService.auth.register(userData);
    return response;
  } catch (error) {
    console.error('authService - 회원가입 실패:', error);
    throw error;
  }
};

// 로그아웃 서비스
export const logout = async () => {
  try {
    const response = await api.post('/auth/logout');
    return response.data;
  } catch (error) {
    console.error('로그아웃 실패:', error);
    throw error;
  }
};

// 토큰 갱신 서비스
export const refreshToken = async (refreshToken) => {
  try {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data;
  } catch (error) {
    console.error('토큰 갱신 실패:', error);
    throw error;
  }
};

// 현재 사용자 정보 조회 서비스
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/users/me');
    return response.data;
  } catch (error) {
    console.error('사용자 정보 조회 실패:', error);
    throw error;
  }
};

// 비밀번호 변경 서비스
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await api.put('/users/password', { currentPassword, newPassword });
    return response.data;
  } catch (error) {
    console.error('비밀번호 변경 실패:', error);
    throw error;
  }
};

// 비밀번호 재설정 요청 서비스 (이메일 발송)
export const requestPasswordReset = async (email) => {
  try {
    const response = await api.post('/auth/password-reset-request', { email });
    return response.data;
  } catch (error) {
    console.error('비밀번호 재설정 요청 실패:', error);
    throw error;
  }
};

// 비밀번호 재설정 서비스 (토큰 사용)
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await api.post('/auth/password-reset', { token, newPassword });
    return response.data;
  } catch (error) {
    console.error('비밀번호 재설정 실패:', error);
    throw error;
  }
};

export default {
  login,
  register,
  logout,
  refreshToken,
  getCurrentUser,
  changePassword,
  requestPasswordReset,
  resetPassword
};