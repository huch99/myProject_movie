// 예매 관련 API
import api from './api';
import storageUtils from '../utils/storageUtils';

/**
 * 예매 관련 서비스 함수들
 */
const reservationService = {
  /**
   * 좌석 예약 가능 여부를 확인합니다
   * @param {number} screeningId - 상영 ID
   * @returns {Promise} 좌석 가용성 응답
   */
  checkSeatAvailability: (screeningId) => {
    return api.reservations.checkSeatAvailability(screeningId);
  },

  /**
   * 예매를 생성합니다
   * @param {Object} reservationData - 예매 데이터
   * @returns {Promise} 예매 생성 응답
   */
  createReservation: (reservationData) => {
    return api.reservations.createReservation(reservationData);
  },

  /**
   * 예매 정보를 가져옵니다
   * @param {number} id - 예매 ID
   * @returns {Promise} 예매 정보 응답
   */
  getReservation: (id) => {
    return api.reservations.getReservation(id);
  },

  /**
   * 예매를 취소합니다
   * @param {number} id - 예매 ID
   * @returns {Promise} 예매 취소 응답
   */
  cancelReservation: (id) => {
    return api.reservations.cancelReservation(id);
  },

  /**
   * 예매 정보의 유효성을 검증합니다
   * @param {Object} reservationData - 예매 데이터
   * @returns {Promise} 유효성 검증 응답
   */
  validateReservation: (reservationData) => {
    return api.reservations.validateReservation(reservationData);
  },

  /**
   * 임시 예매 정보를 로컬 스토리지에 저장합니다
   * @param {Object} reservationData - 예매 데이터
   */
  saveTemporaryReservation: (reservationData) => {
    storageUtils.cart.setReservationData(reservationData);
  },

  /**
   * 임시 예매 정보를 로컬 스토리지에서 가져옵니다
   * @returns {Object} 임시 예매 데이터
   */
  getTemporaryReservation: () => {
    return storageUtils.cart.getReservationData();
  },

  /**
   * 임시 예매 정보를 로컬 스토리지에서 삭제합니다
   */
  clearTemporaryReservation: () => {
    storageUtils.cart.clearReservationData();
  },

  /**
   * 선택한 좌석 정보를 로컬 스토리지에 저장합니다
   * @param {Array} seats - 선택한 좌석 배열
   */
  saveSelectedSeats: (seats) => {
    storageUtils.cart.setSelectedSeats(seats);
  },

  /**
   * 선택한 좌석 정보를 로컬 스토리지에서 가져옵니다
   * @returns {Array} 선택한 좌석 배열
   */
  getSelectedSeats: () => {
    return storageUtils.cart.getSelectedSeats();
  },

  /**
   * 선택한 좌석 정보를 로컬 스토리지에서 삭제합니다
   */
  clearSelectedSeats: () => {
    storageUtils.cart.clearSelectedSeats();
  },

  /**
   * 사용자의 예매 내역을 가져옵니다
   * @returns {Promise} 사용자 예매 내역 응답
   */
  getUserReservations: () => {
    return api.users.getReservations();
  },

  /**
   * 예매 가격을 계산합니다
   * @param {Object} params - 가격 계산 파라미터 (인원 수, 좌석 등급 등)
   * @returns {Object} 가격 정보
   */
  calculatePrice: (params) => {
    const { adultCount = 0, childCount = 0, seniorCount = 0, seatGrade = 'normal' } = params;
    
    // 좌석 등급별 가격 (실제 API 연동 시 서버에서 가져오는 것이 좋음)
    const priceByGrade = {
      normal: { adult: 13000, child: 10000, senior: 8000 },
      premium: { adult: 15000, child: 12000, senior: 10000 },
      vip: { adult: 18000, child: 15000, senior: 12000 }
    };
    
    const prices = priceByGrade[seatGrade] || priceByGrade.normal;
    
    // 인원별 가격 계산
    const adultPrice = prices.adult * adultCount;
    const childPrice = prices.child * childCount;
    const seniorPrice = prices.senior * seniorCount;
    
    // 총 가격 계산
    const totalPrice = adultPrice + childPrice + seniorPrice;
    
    return {
      adultPrice,
      childPrice,
      seniorPrice,
      totalPrice,
      details: {
        adultCount,
        childCount,
        seniorCount,
        adultUnitPrice: prices.adult,
        childUnitPrice: prices.child,
        seniorUnitPrice: prices.senior
      }
    };
  },

  /**
   * 좌석 선택 시간 제한을 관리합니다
   * @param {number} minutes - 제한 시간(분)
   * @param {Function} onTimeUpdate - 시간 업데이트 시 호출할 콜백
   * @param {Function} onTimeExpired - 시간 만료 시 호출할 콜백
   * @returns {Object} 타이머 컨트롤러
   */
  startSeatSelectionTimer: (minutes = 10, onTimeUpdate, onTimeExpired) => {
    const expiryTime = Date.now() + (minutes * 60 * 1000);
    let timerId = null;
    
    const updateTimer = () => {
      const now = Date.now();
      const remainingTime = expiryTime - now;
      
      if (remainingTime <= 0) {
        clearInterval(timerId);
        if (onTimeExpired) onTimeExpired();
        return;
      }
      
      const remainingMinutes = Math.floor(remainingTime / 60000);
      const remainingSeconds = Math.floor((remainingTime % 60000) / 1000);
      
      if (onTimeUpdate) onTimeUpdate(remainingMinutes, remainingSeconds);
    };
    
    // 초기 업데이트
    updateTimer();
    
    // 1초마다 업데이트
    timerId = setInterval(updateTimer, 1000);
    
    return {
      stop: () => {
        if (timerId) clearInterval(timerId);
      }
    };
  }
};

export default reservationService;