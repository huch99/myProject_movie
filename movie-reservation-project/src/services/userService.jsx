// 사용자 관련 API
import api from './api';
import storageUtils from '../utils/storageUtils';

/**
 * 사용자 관련 서비스 함수들
 */
const userService = {
  /**
   * 현재 로그인한 사용자 정보를 가져옵니다
   * @returns {Promise} 사용자 정보 응답
   */
  getCurrentUser: () => {
    return api.users.getCurrentUser();
  },

  /**
   * 사용자 프로필을 업데이트합니다
   * @param {Object} userData - 업데이트할 사용자 데이터
   * @returns {Promise} 업데이트 응답
   */
  updateProfile: (userData) => {
    return api.users.updateProfile(userData);
  },

  /**
   * 사용자 비밀번호를 변경합니다
   * @param {string} currentPassword - 현재 비밀번호
   * @param {string} newPassword - 새 비밀번호
   * @returns {Promise} 비밀번호 변경 응답
   */
  changePassword: (currentPassword, newPassword) => {
    return api.users.changePassword(currentPassword, newPassword);
  },

  /**
   * 사용자의 예매 내역을 가져옵니다
   * @returns {Promise} 예매 내역 응답
   */
  getReservations: () => {
    return api.users.getReservations();
  },

  /**
   * 사용자의 쿠폰 목록을 가져옵니다
   * @returns {Promise} 쿠폰 목록 응답
   */
  getCoupons: () => {
    return api.users.getCoupons();
  },

  /**
   * 사용자 정보를 로컬 스토리지에 저장합니다
   * @param {Object} user - 사용자 정보
   */
  saveUserInfo: (user) => {
    storageUtils.user.setUserInfo(user);
  },

  /**
   * 로컬 스토리지에서 사용자 정보를 가져옵니다
   * @returns {Object} 사용자 정보
   */
  getUserInfo: () => {
    return storageUtils.user.getUserInfo();
  },

  /**
   * 로컬 스토리지에서 사용자 정보를 삭제합니다
   */
  clearUserInfo: () => {
    storageUtils.user.clearUserInfo();
  },

  /**
   * 사용자가 로그인되어 있는지 확인합니다
   * @returns {boolean} 로그인 여부
   */
  isLoggedIn: () => {
    const token = storageUtils.token.getAccessToken();
    return !!token;
  },

  /**
   * 사용자의 알림 설정을 업데이트합니다
   * @param {Object} settings - 알림 설정
   * @returns {Promise} 업데이트 응답
   */
  updateNotificationSettings: (settings) => {
    return api.post('/users/notification-settings', settings);
  },

  /**
   * 사용자의 알림 설정을 가져옵니다
   * @returns {Promise} 알림 설정 응답
   */
  getNotificationSettings: () => {
    return api.get('/users/notification-settings');
  },

  /**
   * 사용자의 포인트 내역을 가져옵니다
   * @param {Object} params - 페이지네이션 등 파라미터
   * @returns {Promise} 포인트 내역 응답
   */
  getPointHistory: (params = {}) => {
    return api.get('/users/points', { params });
  },

  /**
   * 사용자의 리뷰 내역을 가져옵니다
   * @param {Object} params - 페이지네이션 등 파라미터
   * @returns {Promise} 리뷰 내역 응답
   */
  getUserReviews: (params = {}) => {
    return api.get('/users/reviews', { params });
  },

  /**
   * 사용자 프로필 이미지를 업로드합니다
   * @param {File} file - 업로드할 이미지 파일
   * @returns {Promise} 업로드 응답
   */
  uploadProfileImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    
    return api.post('/users/profile-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
};

export default userService;