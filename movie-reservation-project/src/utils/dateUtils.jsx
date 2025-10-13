// 날짜 관련 유틸리티
import { format, parseISO, addDays, isValid, isSameDay, differenceInDays, isAfter, isBefore } from 'date-fns';
import { ko } from 'date-fns/locale';

/**
 * 날짜 포맷 유틸리티 함수 모음
 */
const dateUtils = {
  /**
   * 날짜를 yyyy-MM-dd 형식으로 포맷팅
   * @param {Date|string} date - 포맷팅할 날짜
   * @returns {string} 포맷팅된 날짜 문자열
   */
  formatDate: (date) => {
    if (!date) return '';
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return isValid(parsedDate) ? format(parsedDate, 'yyyy-MM-dd') : '';
  },

  /**
   * 날짜를 yyyy년 MM월 dd일 형식으로 포맷팅
   * @param {Date|string} date - 포맷팅할 날짜
   * @returns {string} 포맷팅된 날짜 문자열
   */
  formatDateKorean: (date) => {
    if (!date) return '';
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return isValid(parsedDate) ? format(parsedDate, 'yyyy년 MM월 dd일', { locale: ko }) : '';
  },

  /**
   * 날짜와 시간을 yyyy-MM-dd HH:mm 형식으로 포맷팅
   * @param {Date|string} date - 포맷팅할 날짜
   * @returns {string} 포맷팅된 날짜와 시간 문자열
   */
  formatDateTime: (date) => {
    if (!date) return '';
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return isValid(parsedDate) ? format(parsedDate, 'yyyy-MM-dd HH:mm') : '';
  },

  

  /**
   * 시간을 HH:mm 형식으로 포맷팅
   * @param {Date|string} date - 포맷팅할 날짜
   * @returns {string} 포맷팅된 시간 문자열
   */
  formatTime: (date) => {
    if (!date) return '';
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return isValid(parsedDate) ? format(parsedDate, 'HH:mm') : '';
  },

  /**
   * 요일을 한글로 반환 (월, 화, 수, 목, 금, 토, 일)
   * @param {Date|string} date - 요일을 구할 날짜
   * @returns {string} 요일 문자열
   */
  getDayOfWeek: (date) => {
    if (!date) return '';
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return isValid(parsedDate) ? format(parsedDate, 'EEEE', { locale: ko }) : '';
  },

  /**
   * 요일을 짧게 한글로 반환 (월, 화, 수, 목, 금, 토, 일)
   * @param {Date|string} date - 요일을 구할 날짜
   * @returns {string} 요일 문자열
   */
  getShortDayOfWeek: (date) => {
    if (!date) return '';
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return isValid(parsedDate) ? format(parsedDate, 'E', { locale: ko }) : '';
  },

  /**
   * 오늘로부터 n일 후의 날짜를 반환
   * @param {number} days - 더할 일 수
   * @returns {Date} 계산된 날짜
   */
  getDateAfter: (days) => {
    return addDays(new Date(), days);
  },

  /**
   * 오늘로부터 n일간의 날짜 배열을 반환 (오늘 포함)
   * @param {number} count - 날짜 개수
   * @returns {Array<Date>} 날짜 배열
   */
  getDateRangeFromToday: (count) => {
    const dates = [];
    for (let i = 0; i < count; i++) {
      dates.push(addDays(new Date(), i));
    }
    return dates;
  },

  /**
   * 두 날짜가 같은 날짜인지 확인
   * @param {Date|string} date1 - 첫 번째 날짜
   * @param {Date|string} date2 - 두 번째 날짜
   * @returns {boolean} 같은 날짜인지 여부
   */
  isSameDate: (date1, date2) => {
    if (!date1 || !date2) return false;
    const parsedDate1 = typeof date1 === 'string' ? parseISO(date1) : date1;
    const parsedDate2 = typeof date2 === 'string' ? parseISO(date2) : date2;
    return isSameDay(parsedDate1, parsedDate2);
  },

  /**
   * 두 날짜 사이의 일 수 차이를 계산
   * @param {Date|string} date1 - 첫 번째 날짜
   * @param {Date|string} date2 - 두 번째 날짜
   * @returns {number} 일 수 차이
   */
  getDaysDifference: (date1, date2) => {
    if (!date1 || !date2) return 0;
    const parsedDate1 = typeof date1 === 'string' ? parseISO(date1) : date1;
    const parsedDate2 = typeof date2 === 'string' ? parseISO(date2) : date2;
    return Math.abs(differenceInDays(parsedDate1, parsedDate2));
  },

  /**
   * 날짜가 오늘인지 확인
   * @param {Date|string} date - 확인할 날짜
   * @returns {boolean} 오늘인지 여부
   */
  isToday: (date) => {
    if (!date) return false;
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return isSameDay(parsedDate, new Date());
  },

  /**
   * 날짜가 내일인지 확인
   * @param {Date|string} date - 확인할 날짜
   * @returns {boolean} 내일인지 여부
   */
  isTomorrow: (date) => {
    if (!date) return false;
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    const tomorrow = addDays(new Date(), 1);
    return isSameDay(parsedDate, tomorrow);
  },

    /**
   * 날짜가 특정 날짜 이후인지 확인
   * @param {Date|string} date - 확인할 날짜
   * @param {Date|string} compareDate - 비교할 날짜
   * @returns {boolean} 이후인지 여부
   */
  isAfterDate: (date, compareDate) => {
    if (!date || !compareDate) return false;
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    const parsedCompareDate = typeof compareDate === 'string' ? parseISO(compareDate) : compareDate;
    return isAfter(parsedDate, parsedCompareDate);
  },

  /**
   * 날짜가 특정 날짜 이전인지 확인
   * @param {Date|string} date - 확인할 날짜
   * @param {Date|string} compareDate - 비교할 날짜
   * @returns {boolean} 이전인지 여부
   */
  isBeforeDate: (date, compareDate) => {
    if (!date || !compareDate) return false;
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    const parsedCompareDate = typeof compareDate === 'string' ? parseISO(compareDate) : compareDate;
    return isBefore(parsedDate, parsedCompareDate);
  },

  /**
   * 영화 상영 시간 표시를 위한 포맷팅 (MM월 dd일 (요일) HH:mm)
   * @param {Date|string} date - 포맷팅할 날짜
   * @returns {string} 포맷팅된 문자열
   */
  formatScreeningDateTime: (date) => {
    if (!date) return '';
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(parsedDate)) return '';
    
    return format(parsedDate, 'MM월 dd일 (E) HH:mm', { locale: ko });
  },

  /**
   * 예매 내역 표시를 위한 포맷팅 (yyyy년 MM월 dd일 HH:mm)
   * @param {Date|string} date - 포맷팅할 날짜
   * @returns {string} 포맷팅된 문자열
   */
  formatReservationDateTime: (date) => {
    if (!date) return '';
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(parsedDate)) return '';
    
    return format(parsedDate, 'yyyy년 MM월 dd일 HH:mm', { locale: ko });
  },

  /**
   * 현재 날짜를 기준으로 요일별 날짜 배열 생성 (오늘부터 7일)
   * @returns {Array<Object>} 날짜 객체 배열 [{date, dayOfWeek, isToday}]
   */
  getWeekDates: () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = addDays(today, i);
      dates.push({
        date,
        formattedDate: format(date, 'MM.dd', { locale: ko }),
        dayOfWeek: format(date, 'E', { locale: ko }),
        isToday: i === 0,
        isTomorrow: i === 1
      });
    }
    
    return dates;
  },
  
  /**
   * 시간대별 표시 문구 반환 (오전, 오후 등)
   * @param {number} hour - 시간 (0-23)
   * @returns {string} 시간대 문구
   */
  getTimePeriod: (hour) => {
    if (hour < 0 || hour > 23) return '';
    
    if (hour < 6) return '새벽';
    if (hour < 12) return '오전';
    if (hour < 18) return '오후';
    return '저녁';
  },
  
  /**
   * 상영 시간 분류 (조조, 일반, 심야)
   * @param {Date|string} date - 분류할 날짜
   * @returns {string} 상영 시간 유형
   */
  getScreeningType: (date) => {
    if (!date) return '일반';
    
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(parsedDate)) return '일반';
    
    const hour = parsedDate.getHours();
    
    if (hour < 10) return '조조';
    if (hour >= 22) return '심야';
    return '일반';
  }
};

export default dateUtils;