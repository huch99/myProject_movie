// 테마 설정
/**
 * 영화 예매 사이트 테마 설정
 * 라이트/다크 모드 및 디자인 시스템 변수를 정의합니다.
 */

// 라이트 모드 테마
export const lightTheme = {
  name: 'light',
  colors: {
    primary: '#e51937',          // 메인 색상 (영화관 레드)
    primaryRgb: '229, 25, 55',   // RGB 형식 (그라데이션 등에 사용)
    secondary: '#2b3a67',        // 보조 색상
    background: '#ffffff',       // 배경색
    surface: '#f5f5f5',          // 카드, 컨테이너 배경색
    text: {
      primary: '#333333',        // 주요 텍스트
      secondary: '#666666',      // 보조 텍스트
      disabled: '#999999',       // 비활성화 텍스트
    },
    border: '#e0e0e0',           // 테두리
    error: '#d32f2f',            // 에러 메시지
    success: '#388e3c',          // 성공 메시지
    warning: '#f57c00',          // 경고 메시지
    info: '#0288d1',             // 정보 메시지
    button: {
      primary: '#e51937',        // 주요 버튼
      secondary: '#2b3a67',      // 보조 버튼
      disabled: '#cccccc',       // 비활성화 버튼
    },
    rating: '#ffc107',           // 별점 색상
    shadow: 'rgba(0, 0, 0, 0.1)', // 그림자
    overlay: 'rgba(0, 0, 0, 0.5)', // 오버레이
    ticket: '#f8f9fa',           // 티켓 배경색
    seat: {
      available: '#ffffff',      // 이용 가능 좌석
      selected: '#e51937',       // 선택된 좌석
      occupied: '#999999',       // 이미 예약된 좌석
      disabled: '#cccccc',       // 선택 불가 좌석
    },
  },
  fonts: {
    regular: "'Noto Sans KR', sans-serif",
    heading: "'Noto Sans KR', sans-serif",
  },
  fontSizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    md: '1rem',       // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '16px',
    full: '9999px',
  },
  boxShadow: {
    sm: '0 2px 4px rgba(0, 0, 0, 0.1)',
    md: '0 4px 8px rgba(0, 0, 0, 0.1)',
    lg: '0 8px 16px rgba(0, 0, 0, 0.1)',
  },
  transition: {
    default: 'all 0.3s ease',
    fast: 'all 0.15s ease',
    slow: 'all 0.5s ease',
  },
  zIndex: {
    modal: 1000,
    overlay: 900,
    dropdown: 800,
    header: 700,
    footer: 600,
  },
};

// 다크 모드 테마
export const darkTheme = {
  name: 'dark',
  colors: {
    primary: '#ff4757',          // 메인 색상 (어두운 배경에 맞춘 밝은 레드)
    primaryRgb: '255, 71, 87',   // RGB 형식
    secondary: '#5c6bc0',        // 보조 색상
    background: '#121212',       // 배경색
    surface: '#1e1e1e',          // 카드, 컨테이너 배경색
    text: {
      primary: '#ffffff',        // 주요 텍스트
      secondary: '#b0b0b0',      // 보조 텍스트
      disabled: '#6e6e6e',       // 비활성화 텍스트
    },
    border: '#333333',           // 테두리
    error: '#f44336',            // 에러 메시지
    success: '#4caf50',          // 성공 메시지
    warning: '#ff9800',          // 경고 메시지
    info: '#2196f3',             // 정보 메시지
    button: {
      primary: '#ff4757',        // 주요 버튼
      secondary: '#5c6bc0',      // 보조 버튼
      disabled: '#555555',       // 비활성화 버튼
    },
    rating: '#ffc107',           // 별점 색상
    shadow: 'rgba(0, 0, 0, 0.3)', // 그림자
    overlay: 'rgba(0, 0, 0, 0.7)', // 오버레이
    ticket: '#2a2a2a',           // 티켓 배경색
    seat: {
      available: '#333333',      // 이용 가능 좌석
      selected: '#ff4757',       // 선택된 좌석
      occupied: '#666666',       // 이미 예약된 좌석
      disabled: '#444444',       // 선택 불가 좌석
    },
  },
  fonts: {
    regular: "'Noto Sans KR', sans-serif",
    heading: "'Noto Sans KR', sans-serif",
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '16px',
    full: '9999px',
  },
  boxShadow: {
    sm: '0 2px 4px rgba(0, 0, 0, 0.3)',
    md: '0 4px 8px rgba(0, 0, 0, 0.3)',
    lg: '0 8px 16px rgba(0, 0, 0, 0.3)',
  },
  transition: {
    default: 'all 0.3s ease',
    fast: 'all 0.15s ease',
    slow: 'all 0.5s ease',
  },
  zIndex: {
    modal: 1000,
    overlay: 900,
    dropdown: 800,
    header: 700,
    footer: 600,
  },
};

// 테마 객체 내보내기
export default {
  light: lightTheme,
  dark: darkTheme
};