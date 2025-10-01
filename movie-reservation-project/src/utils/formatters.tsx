// 영화 예매 사이트에서 사용할 포맷팅 유틸리티 함수들을 정의합니다.

/**
 * 날짜를 'YYYY-MM-DD' 형식으로 포맷팅합니다.
 * @param date Date 객체 또는 날짜 문자열
 * @returns 'YYYY-MM-DD' 형식의 문자열
 */
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

/**
 * 날짜를 'YYYY.MM.DD' 형식으로 포맷팅합니다.
 * @param date Date 객체 또는 날짜 문자열
 * @returns 'YYYY.MM.DD' 형식의 문자열
 */
export const formatDateWithDots = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  return `${year}.${month}.${day}`;
};

/**
 * 날짜를 'YYYY년 MM월 DD일' 형식으로 포맷팅합니다.
 * @param date Date 객체 또는 날짜 문자열
 * @returns 'YYYY년 MM월 DD일' 형식의 문자열
 */
export const formatDateKorean = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  
  return `${year}년 ${month}월 ${day}일`;
};

/**
 * 시간을 'HH:MM' 형식으로 포맷팅합니다.
 * @param date Date 객체 또는 날짜 문자열
 * @returns 'HH:MM' 형식의 문자열
 */
export const formatTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  
  return `${hours}:${minutes}`;
};

/**
 * 날짜와 시간을 'YYYY-MM-DD HH:MM' 형식으로 포맷팅합니다.
 * @param date Date 객체 또는 날짜 문자열
 * @returns 'YYYY-MM-DD HH:MM' 형식의 문자열
 */
export const formatDateTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return `${formatDate(d)} ${formatTime(d)}`;
};

/**
 * 날짜와 시간을 'YYYY.MM.DD HH:MM' 형식으로 포맷팅합니다.
 * @param date Date 객체 또는 날짜 문자열
 * @returns 'YYYY.MM.DD HH:MM' 형식의 문자열
 */
export const formatDateTimeWithDots = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return `${formatDateWithDots(d)} ${formatTime(d)}`;
};

/**
 * 금액을 '₩1,000' 형식으로 포맷팅합니다.
 * @param amount 금액
 * @returns 포맷팅된 금액 문자열
 */
export const formatCurrency = (amount: number): string => {
  return `₩${amount.toLocaleString('ko-KR')}`;
};

/**
 * 금액을 '1,000원' 형식으로 포맷팅합니다.
 * @param amount 금액
 * @returns 포맷팅된 금액 문자열
 */
export const formatCurrencyWon = (amount: number): string => {
  return `${amount.toLocaleString('ko-KR')}원`;
};

/**
 * 러닝타임을 '2시간 30분' 형식으로 포맷팅합니다.
 * @param minutes 총 분 수
 * @returns 포맷팅된 러닝타임 문자열
 */
export const formatRuntime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 0 && mins > 0) {
    return `${hours}시간 ${mins}분`;
  } else if (hours > 0) {
    return `${hours}시간`;
  } else {
    return `${mins}분`;
  }
};

/**
 * 평점을 소수점 한 자리까지 포맷팅합니다.
 * @param rating 평점
 * @returns 포맷팅된 평점 문자열
 */
export const formatRating = (rating: number): string => {
  return rating.toFixed(1);
};

/**
 * 전화번호를 '000-0000-0000' 형식으로 포맷팅합니다.
 * @param phoneNumber 전화번호 문자열
 * @returns 포맷팅된 전화번호 문자열
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
  // 숫자만 추출
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // 길이에 따라 다른 포맷 적용
  if (cleaned.length === 11) { // 휴대폰 번호 (01012345678)
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
  } else if (cleaned.length === 10) { // 일부 지역번호 (0212345678)
    return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length === 9) { // 일부 지역번호 (021234567)
    return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 5)}-${cleaned.slice(5)}`;
  }
  
  // 그 외의 경우는 원래 값 반환
  return phoneNumber;
};

/**
 * 영화 상영등급을 포맷팅합니다.
 * @param rating 상영등급 ('ALL', '12', '15', '18')
 * @returns 포맷팅된 상영등급 문자열
 */
export const formatAgeRating = (rating: string): string => {
  const ratingMap: { [key: string]: string } = {
    'ALL': '전체관람가',
    '12': '12세 이상 관람가',
    '15': '15세 이상 관람가',
    '18': '청소년 관람불가'
  };
  
  return ratingMap[rating] || rating;
};

/**
 * 예매 상태를 한글로 포맷팅합니다.
 * @param status 예매 상태 ('pending', 'completed', 'cancelled')
 * @returns 포맷팅된 예매 상태 문자열
 */
export const formatBookingStatus = (status: string): string => {
  const statusMap: { [key: string]: string } = {
    'pending': '예매 대기중',
    'completed': '예매 완료',
    'cancelled': '예매 취소'
  };
  
  return statusMap[status] || status;
};