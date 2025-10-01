// 영화 예매 사이트에서 사용할 유효성 검사 유틸리티 함수들을 정의합니다.

/**
 * 이메일 유효성 검사
 * @param email 검사할 이메일 주소
 * @returns 유효한 이메일이면 true, 아니면 false
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return emailRegex.test(email);
};

/**
 * 비밀번호 유효성 검사 (8자 이상, 영문, 숫자, 특수문자 포함)
 * @param password 검사할 비밀번호
 * @returns 유효한 비밀번호이면 true, 아니면 false
 */
export const isValidPassword = (password: string): boolean => {
  // 최소 8자, 최소 하나의 문자, 하나의 숫자 및 하나의 특수 문자
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  return passwordRegex.test(password);
};

/**
 * 전화번호 유효성 검사 (000-0000-0000 또는 00-0000-0000 형식)
 * @param phoneNumber 검사할 전화번호
 * @returns 유효한 전화번호이면 true, 아니면 false
 */
export const isValidPhoneNumber = (phoneNumber: string): boolean => {
  const phoneRegex = /^(01[016789]|02|0[3-9]\d)-\d{3,4}-\d{4}$/;
  return phoneRegex.test(phoneNumber);
};

/**
 * 생년월일 유효성 검사 (YYYY-MM-DD 형식)
 * @param birthdate 검사할 생년월일
 * @returns 유효한 생년월일이면 true, 아니면 false
 */
export const isValidBirthdate = (birthdate: string): boolean => {
  // YYYY-MM-DD 형식 확인
  const birthdateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!birthdateRegex.test(birthdate)) {
    return false;
  }
  
  // 날짜 유효성 검사
  const date = new Date(birthdate);
  if (isNaN(date.getTime())) {
    return false;
  }
  
  // 현재 날짜보다 미래인지 확인
  const now = new Date();
  if (date > now) {
    return false;
  }
  
  // 100년 이상 과거인지 확인
  const hundredYearsAgo = new Date();
  hundredYearsAgo.setFullYear(now.getFullYear() - 100);
  if (date < hundredYearsAgo) {
    return false;
  }
  
  return true;
};

/**
 * 신용카드 번호 유효성 검사
 * @param cardNumber 검사할 신용카드 번호
 * @returns 유효한 신용카드 번호이면 true, 아니면 false
 */
export const isValidCreditCardNumber = (cardNumber: string): boolean => {
  // 숫자와 공백, 하이픈만 허용
  const cleanedNumber = cardNumber.replace(/[\s-]/g, '');
  
  // 숫자만 있는지 확인
  if (!/^\d+$/.test(cleanedNumber)) {
    return false;
  }
  
  // 카드 번호 길이 확인 (대부분의 카드는 13-19자리)
  if (cleanedNumber.length < 13 || cleanedNumber.length > 19) {
    return false;
  }
  
  // Luhn 알고리즘 검사
  let sum = 0;
  let double = false;
  
  // 오른쪽에서 왼쪽으로 계산
  for (let i = cleanedNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanedNumber.charAt(i));
    
    if (double) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    double = !double;
  }
  
  return sum % 10 === 0;
};

/**
 * 카드 만료일 유효성 검사 (MM/YY 형식)
 * @param expiryDate 검사할 만료일
 * @returns 유효한 만료일이면 true, 아니면 false
 */
export const isValidExpiryDate = (expiryDate: string): boolean => {
  // MM/YY 형식 확인
  const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
  if (!expiryRegex.test(expiryDate)) {
    return false;
  }
  
  const [monthStr, yearStr] = expiryDate.split('/');
  const month = parseInt(monthStr);
  const year = 2000 + parseInt(yearStr); // 2000년대로 변환
  
  // 현재 날짜 가져오기
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // getMonth()는 0부터 시작
  
  // 만료 여부 확인
  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return false;
  }
  
  return true;
};

/**
 * CVV 유효성 검사
 * @param cvv 검사할 CVV
 * @returns 유효한 CVV이면 true, 아니면 false
 */
export const isValidCVV = (cvv: string): boolean => {
  // CVV는 3-4자리 숫자
  const cvvRegex = /^\d{3,4}$/;
  return cvvRegex.test(cvv);
};

/**
 * 이름 유효성 검사 (2-50자, 특수문자 없음)
 * @param name 검사할 이름
 * @returns 유효한 이름이면 true, 아니면 false
 */
export const isValidName = (name: string): boolean => {
  // 2-50자, 한글, 영문, 공백만 허용
  const nameRegex = /^[가-힣a-zA-Z\s]{2,50}$/;
  return nameRegex.test(name);
};

/**
 * 비밀번호 확인 유효성 검사
 * @param password 비밀번호
 * @param confirmPassword 비밀번호 확인
 * @returns 두 비밀번호가 일치하면 true, 아니면 false
 */
export const doPasswordsMatch = (password: string, confirmPassword: string): boolean => {
  return password === confirmPassword;
};

/**
 * 좌석 선택 유효성 검사
 * @param selectedSeats 선택한 좌석 배열
 * @param ticketCount 예매한 티켓 수
 * @returns 좌석 수와 티켓 수가 일치하면 true, 아니면 false
 */
export const isValidSeatSelection = (selectedSeats: string[], ticketCount: number): boolean => {
  return selectedSeats.length === ticketCount;
};

/**
 * 결제 금액 유효성 검사
 * @param calculatedPrice 계산된 가격
 * @param paymentAmount 결제 금액
 * @returns 두 금액이 일치하면 true, 아니면 false
 */
export const isValidPaymentAmount = (calculatedPrice: number, paymentAmount: number): boolean => {
  return calculatedPrice === paymentAmount;
};