// 포맷 관련 유틸리티

/**
 * 데이터 포맷팅을 위한 유틸리티 함수 모음
 */
const formatUtils = {
  /**
   * 가격을 원화 형식으로 포맷팅
   * @param {number} price - 포맷팅할 가격
   * @returns {string} 포맷팅된 가격 문자열
   */
  formatCurrency: (price) => {
    if (price === null || price === undefined) return '0원';
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '원';
  },

  /**
   * 가격을 원화 형식으로 포맷팅 (원 표시 없이)
   * @param {number} price - 포맷팅할 가격
   * @returns {string} 포맷팅된 가격 문자열
   */
  formatNumberWithCommas: (price) => {
    if (price === null || price === undefined) return '0';
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  },

  /**
   * 영화 상영 시간을 시간과 분으로 포맷팅
   * @param {number} minutes - 총 분 수
   * @returns {string} 포맷팅된 시간 문자열
   */
  formatRuntime: (minutes) => {
    if (!minutes) return '';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0 && mins > 0) {
      return `${hours}시간 ${mins}분`;
    } else if (hours > 0) {
      return `${hours}시간`;
    } else {
      return `${mins}분`;
    }
  },

  /**
   * 문자열 길이 제한 및 말줄임표 추가
   * @param {string} text - 원본 문자열
   * @param {number} maxLength - 최대 길이
   * @returns {string} 제한된 문자열
   */
  truncateText: (text, maxLength) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  },

  /**
   * 영화 평점을 별점으로 포맷팅 (★★★☆☆)
   * @param {number} rating - 평점 (0~5)
   * @returns {string} 별점 문자열
   */
  formatStarRating: (rating) => {
    if (rating === null || rating === undefined) return '';
    
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    
    return '★'.repeat(fullStars) + (halfStar ? '☆' : '') + '☆'.repeat(emptyStars);
  },

  /**
   * 영화 평점을 소수점 한 자리까지 포맷팅
   * @param {number} rating - 평점
   * @returns {string} 포맷팅된 평점
   */
  formatRating: (rating) => {
    if (rating === null || rating === undefined) return '0.0';
    return rating.toFixed(1);
  },

  /**
   * 영화 장르를 포맷팅
   * @param {Array} genres - 장르 배열
   * @returns {string} 포맷팅된 장르 문자열
   */
  formatGenres: (genres) => {
    if (!genres || !genres.length) return '';
    return genres.join(', ');
  },

  /**
   * 이름 마스킹 처리 (홍*동)
   * @param {string} name - 이름
   * @returns {string} 마스킹된 이름
   */
  maskName: (name) => {
    if (!name || name.length < 2) return name;
    return name.charAt(0) + '*'.repeat(name.length - 2) + name.charAt(name.length - 1);
  },

  /**
   * 이메일 마스킹 처리 (ex***@gmail.com)
   * @param {string} email - 이메일
   * @returns {string} 마스킹된 이메일
   */
  maskEmail: (email) => {
    if (!email) return '';
    
    const [localPart, domain] = email.split('@');
    if (!domain) return email;
    
    let maskedLocalPart = '';
    if (localPart.length <= 3) {
      maskedLocalPart = localPart.charAt(0) + '*'.repeat(localPart.length - 1);
    } else {
      maskedLocalPart = localPart.substring(0, 3) + '*'.repeat(localPart.length - 3);
    }
    
    return `${maskedLocalPart}@${domain}`;
  },

  /**
   * 전화번호 포맷팅 (010-1234-5678)
   * @param {string} phoneNumber - 전화번호
   * @returns {string} 포맷팅된 전화번호
   */
  formatPhoneNumber: (phoneNumber) => {
    if (!phoneNumber) return '';
    
    // 숫자만 추출
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // 길이에 따라 포맷팅
    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    } else if (cleaned.length === 10) {
      return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    }
    
    return phoneNumber;
  },

  /**
   * 좌석 정보 포맷팅 (A1, A2 -> A열 1, 2번)
   * @param {Array} seats - 좌석 코드 배열
   * @returns {string} 포맷팅된 좌석 정보
   */
  formatSeats: (seats) => {
    if (!seats || !seats.length) return '';
    
    // 좌석을 행별로 그룹화
    const rowGroups = seats.reduce((acc, seat) => {
      const row = seat.charAt(0);
      const number = seat.substring(1);
      
      if (!acc[row]) {
        acc[row] = [];
      }
      
      acc[row].push(number);
      return acc;
    }, {});
    
    // 행별로 포맷팅
    return Object.entries(rowGroups)
      .map(([row, numbers]) => `${row}열 ${numbers.join(', ')}번`)
      .join(', ');
  }
};

export default formatUtils;