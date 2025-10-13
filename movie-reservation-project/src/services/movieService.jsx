// 영화 관련 API
import api from './api';

/**
 * 영화 관련 서비스 함수들
 */
const movieService = {
  /**
   * 현재 상영 중인 영화 목록을 가져옵니다
   * @param {Object} params - 페이지네이션, 정렬 등 파라미터
   * @returns {Promise} 영화 목록 응답
   */
  getNowPlaying: (params = {}) => {
    return api.movies.getNowPlaying(params);
  },

  /**
   * 개봉 예정 영화 목록을 가져옵니다
   * @param {Object} params - 페이지네이션, 정렬 등 파라미터
   * @returns {Promise} 영화 목록 응답
   */
  getComingSoon: (params = {}) => {
    return api.movies.getComingSoon(params);
  },

  /**
   * 인기 영화 목록을 가져옵니다
   * @param {Object} params - 페이지네이션, 정렬 등 파라미터
   * @returns {Promise} 영화 목록 응답
   */
  getPopular: (params = {}) => {
    return api.movies.getPopular(params);
  },

  /**
   * 모든 영화 목록을 가져옵니다
   * @param {Object} params - 필터링, 페이지네이션, 정렬 등 파라미터
   * @returns {Promise} 영화 목록 응답
   */
  getAllMovies: (params = {}) => {
    return api.movies.getAll(params);
  },

  /**
   * 특정 ID의 영화 상세 정보를 가져옵니다
   * @param {number} id - 영화 ID
   * @returns {Promise} 영화 상세 정보 응답
   */
  getMovieById: (id) => {
    return api.movies.getById(id);
  },

  /**
   * 특정 영화의 상영 일정을 가져옵니다
   * @param {number} movieId - 영화 ID
   * @param {string} date - 날짜 (YYYY-MM-DD)
   * @returns {Promise} 상영 일정 응답
   */
  getMovieScreenings: (movieId, date) => {
    return api.movies.getScreenings(movieId, date);
  },

  /**
   * 특정 영화의 리뷰 목록을 가져옵니다
   * @param {number} movieId - 영화 ID
   * @param {number} page - 페이지 번호
   * @param {number} size - 페이지당 항목 수
   * @returns {Promise} 리뷰 목록 응답
   */
  getMovieReviews: (movieId, page = 0, size = 10) => {
    return api.movies.getReviews(movieId, page, size);
  },

  /**
   * 특정 영화에 리뷰를 작성합니다
   * @param {number} movieId - 영화 ID
   * @param {Object} reviewData - 리뷰 데이터 (rating, content)
   * @returns {Promise} 리뷰 작성 응답
   */
  addMovieReview: (movieId, reviewData) => {
    return api.movies.addReview(movieId, reviewData);
  },

  /**
   * 특정 영화의 리뷰를 수정합니다
   * @param {number} movieId - 영화 ID
   * @param {number} reviewId - 리뷰 ID
   * @param {Object} reviewData - 수정할 리뷰 데이터
   * @returns {Promise} 리뷰 수정 응답
   */
  updateMovieReview: (movieId, reviewId, reviewData) => {
    return api.movies.updateReview(movieId, reviewId, reviewData);
  },

  /**
   * 특정 영화의 리뷰를 삭제합니다
   * @param {number} movieId - 영화 ID
   * @param {number} reviewId - 리뷰 ID
   * @returns {Promise} 리뷰 삭제 응답
   */
  deleteMovieReview: (movieId, reviewId) => {
    return api.movies.deleteReview(movieId, reviewId);
  },

  /**
   * 영화를 검색합니다
   * @param {string} query - 검색어
   * @returns {Promise} 검색 결과 응답
   */
  searchMovies: (query) => {
    return api.search.movies(query);
  },

  /**
   * 장르별 영화를 가져옵니다
   * @param {number} genreId - 장르 ID
   * @param {Object} params - 페이지네이션, 정렬 등 파라미터
   * @returns {Promise} 영화 목록 응답
   */
  getMoviesByGenre: (genreId, params = {}) => {
    return api.movies.getAll({ ...params, genreId });
  },

  /**
   * 최근 본 영화 목록을 로컬 스토리지에서 가져옵니다
   * @returns {Array} 최근 본 영화 목록
   */
  getRecentViewedMovies: () => {
    try {
      const recentMovies = localStorage.getItem('recentMovies');
      return recentMovies ? JSON.parse(recentMovies) : [];
    } catch (error) {
      console.error('최근 본 영화 정보를 가져오는데 실패했습니다:', error);
      return [];
    }
  },

  /**
   * 최근 본 영화를 로컬 스토리지에 저장합니다
   * @param {Object} movie - 영화 정보
   */
  addRecentViewedMovie: (movie) => {
    try {
      if (!movie || !movie.id) return;
      
      const recentMovies = movieService.getRecentViewedMovies();
      
      // 이미 있는 영화라면 제거
      const filteredMovies = recentMovies.filter(item => item.id !== movie.id);
      
      // 최신 영화를 맨 앞에 추가
      const newMovies = [movie, ...filteredMovies].slice(0, 10);
      
      localStorage.setItem('recentMovies', JSON.stringify(newMovies));
    } catch (error) {
      console.error('최근 본 영화 정보를 저장하는데 실패했습니다:', error);
    }
  }
};

export default movieService;