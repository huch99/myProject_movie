// 극장 관련 API
import api from './api';
import storageUtils from '../utils/storageUtils';

/**
 * 극장 관련 서비스 함수들
 */
const theaterService = {
  /**
   * 모든 극장 목록을 가져옵니다
   * @param {Object} params - 지역, 페이지네이션 등 파라미터
   * @returns {Promise} 극장 목록 응답
   */
  getAllTheaters: (params = {}) => {
    return api.theaters.getAll(params);
  },

  /**
   * 특정 ID의 극장 상세 정보를 가져옵니다
   * @param {number} id - 극장 ID
   * @returns {Promise} 극장 상세 정보 응답
   */
  getTheaterById: (id) => {
    return api.theaters.getById(id);
  },

  /**
   * 특정 극장의 상영관 목록을 가져옵니다
   * @param {number} theaterId - 극장 ID
   * @returns {Promise} 상영관 목록 응답
   */
  getTheaterScreens: (theaterId) => {
    return api.theaters.getScreens(theaterId);
  },

  /**
   * 특정 극장의 상영 일정을 가져옵니다
   * @param {number} theaterId - 극장 ID
   * @param {string} date - 날짜 (YYYY-MM-DD)
   * @returns {Promise} 상영 일정 응답
   */
  getTheaterSchedules: (theaterId, date) => {
    return api.theaters.getSchedules(theaterId, date);
  },

  /**
   * 지역별 극장 목록을 가져옵니다
   * @param {string} region - 지역 코드
   * @returns {Promise} 극장 목록 응답
   */
  getTheatersByRegion: (region) => {
    return api.theaters.getAll({ region });
  },

  /**
   * 극장을 검색합니다
   * @param {string} query - 검색어
   * @returns {Promise} 검색 결과 응답
   */
  searchTheaters: (query) => {
    return api.search.theaters(query);
  },

  /**
   * 최근 방문한 극장 목록을 로컬 스토리지에서 가져옵니다
   * @returns {Array} 최근 방문한 극장 목록
   */
  getRecentTheaters: () => {
    return storageUtils.getItem('recentTheaters', []);
  },

  /**
   * 최근 방문한 극장을 로컬 스토리지에 저장합니다
   * @param {Object} theater - 극장 정보
   */
  addRecentTheater: (theater) => {
    if (!theater || !theater.id) return;
    
    const recentTheaters = theaterService.getRecentTheaters();
    
    // 이미 있는 극장이라면 제거
    const filteredTheaters = recentTheaters.filter(item => item.id !== theater.id);
    
    // 최근 방문한 극장을 맨 앞에 추가
    const newTheaters = [theater, ...filteredTheaters].slice(0, 5);
    
    storageUtils.setItem('recentTheaters', newTheaters);
  },

  /**
   * 즐겨찾는 극장 목록을 로컬 스토리지에서 가져옵니다
   * @returns {Array} 즐겨찾는 극장 목록
   */
  getFavoriteTheaters: () => {
    return storageUtils.getItem('favoriteTheaters', []);
  },

  /**
   * 즐겨찾는 극장을 로컬 스토리지에 추가합니다
   * @param {Object} theater - 극장 정보
   * @returns {boolean} 추가 성공 여부
   */
  addFavoriteTheater: (theater) => {
    if (!theater || !theater.id) return false;
    
    const favoriteTheaters = theaterService.getFavoriteTheaters();
    
    // 이미 즐겨찾기에 있는지 확인
    if (favoriteTheaters.some(item => item.id === theater.id)) {
      return false;
    }
    
    // 즐겨찾기에 추가
    const newFavorites = [...favoriteTheaters, theater];
    storageUtils.setItem('favoriteTheaters', newFavorites);
    
    return true;
  },

  /**
   * 즐겨찾는 극장을 로컬 스토리지에서 제거합니다
   * @param {number} theaterId - 극장 ID
   * @returns {boolean} 제거 성공 여부
   */
  removeFavoriteTheater: (theaterId) => {
    const favoriteTheaters = theaterService.getFavoriteTheaters();
    
    // 해당 극장이 즐겨찾기에 있는지 확인
    if (!favoriteTheaters.some(item => item.id === theaterId)) {
      return false;
    }
    
    // 즐겨찾기에서 제거
    const newFavorites = favoriteTheaters.filter(item => item.id !== theaterId);
    storageUtils.setItem('favoriteTheaters', newFavorites);
    
    return true;
  },

  /**
   * 특정 극장이 즐겨찾기에 있는지 확인합니다
   * @param {number} theaterId - 극장 ID
   * @returns {boolean} 즐겨찾기 여부
   */
  isFavoriteTheater: (theaterId) => {
    const favoriteTheaters = theaterService.getFavoriteTheaters();
    return favoriteTheaters.some(item => item.id === theaterId);
  }
};

export default theaterService;