// 테마 컨텍스트
import React, { createContext, useContext, useState, useEffect } from 'react';
import { lightTheme, darkTheme } from '../styles/theme'; // theme.js에서 테마 정의를 임포트합니다
import GlobalStyles from '../styles/GlobalStyles';
import {ThemeProvider as StyledThemeProvider} from 'styled-components'
import themes from '../styles/theme';

// 테마 컨텍스트 생성
const ThemeContext = createContext();

// 테마 컨텍스트 제공자 컴포넌트
export const ThemeProvider = ({ children }) => {
  // 로컬 스토리지에서 테마 설정 가져오기 또는 기본값 사용
  const [currentThemeName, setCurrentThemeName] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  const currentTheme = themes[currentThemeName];

  // 테마 변경 함수
  const toggleTheme = () => {
    const newThemeName = currentThemeName === 'light' ? 'dark' : 'light';
    setCurrentThemeName(newThemeName);
    localStorage.setItem('theme', newThemeName);
  };

  // 시스템 테마 변경 감지
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      const savedTheme = localStorage.getItem('theme');
      // 사용자가 직접 테마를 설정하지 않았다면 시스템 설정 따르기
      if (!savedTheme) {
        setCurrentThemeName(e.matches ? 'dark' : 'light');
      }
    };

    // 초기 설정
    if (!localStorage.getItem('theme')) {
      setCurrentThemeName(mediaQuery.matches ? 'dark' : 'light');
    }

    // 이벤트 리스너 등록
    mediaQuery.addEventListener('change', handleChange);
    
    // 클린업 함수
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  // 현재 테마 이름에 따라 실제 테마 객체 선택
  const theme = currentThemeName === 'light' ? lightTheme : darkTheme;

  // 제공할 컨텍스트 값
  const value = {
    theme,                // 현재 테마 객체 전체
    currentThemeName,     // 'light' 또는 'dark' 문자열
    toggleTheme,          // 테마 전환 함수
  };

  return (
    <ThemeContext.Provider value={value}>
     <StyledThemeProvider theme={currentTheme}>
        <GlobalStyles /> {/* 4. GlobalStyles를 렌더링하여 CSS 변수를 생성 */}
        {children} {/* 자식 컴포넌트들이 StyledThemeProvider의 컨텍스트를 받도록 */}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};

// 테마 컨텍스트 사용을 위한 커스텀 훅
export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme은 ThemeProvider 내에서만 사용할 수 있습니다.');
  }
  
  return context;
};

// CSS 변수로 테마 적용을 위한 컴포넌트
export const ThemeApplier = () => {
  const { theme } = useTheme();
  
  useEffect(() => {
    // HTML 문서의 루트 요소에 CSS 변수 적용
    const root = document.documentElement;
    
    // 색상 변수 적용
    root.style.setProperty('--color-primary', theme.colors.primary);
    root.style.setProperty('--color-primary-rgb', theme.colors.primaryRgb);
    root.style.setProperty('--color-secondary', theme.colors.secondary);
    root.style.setProperty('--color-background', theme.colors.background);
    root.style.setProperty('--color-surface', theme.colors.surface);
    root.style.setProperty('--color-text-primary', theme.colors.text.primary);
    root.style.setProperty('--color-text-secondary', theme.colors.text.secondary);
    root.style.setProperty('--color-text-disabled', theme.colors.text.disabled);
    root.style.setProperty('--color-border', theme.colors.border);
    root.style.setProperty('--color-error', theme.colors.error);
    root.style.setProperty('--color-success', theme.colors.success);
    root.style.setProperty('--color-warning', theme.colors.warning);
    root.style.setProperty('--color-info', theme.colors.info);
    root.style.setProperty('--color-button-primary', theme.colors.button.primary);
    root.style.setProperty('--color-button-secondary', theme.colors.button.secondary);
    root.style.setProperty('--color-button-disabled', theme.colors.button.disabled);
    root.style.setProperty('--color-shadow', theme.colors.shadow);
    root.style.setProperty('--color-overlay', theme.colors.overlay);
    root.style.setProperty('--color-rating', theme.colors.rating);
    
    // 폰트 변수 적용
    root.style.setProperty('--font-regular', theme.fonts.regular);
    root.style.setProperty('--font-heading', theme.fonts.heading);
    
    // 폰트 크기 변수 적용
    Object.entries(theme.fontSizes).forEach(([key, value]) => {
      root.style.setProperty(`--font-size-${key}`, value);
    });
    
    // 간격 변수 적용
    Object.entries(theme.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--spacing-${key}`, value);
    });
    
    // 테두리 반경 변수 적용
    Object.entries(theme.borderRadius).forEach(([key, value]) => {
      root.style.setProperty(`--border-radius-${key}`, value);
    });
    
    // 그림자 변수 적용
    Object.entries(theme.boxShadow).forEach(([key, value]) => {
      root.style.setProperty(`--box-shadow-${key}`, value);
    });
    
    // 트랜지션 변수 적용
    Object.entries(theme.transition).forEach(([key, value]) => {
      root.style.setProperty(`--transition-${key}`, value);
    });
    
    // body 요소에 테마 이름 클래스 추가 (추가 스타일링에 유용)
    document.body.className = `theme-${theme.name}`;
  }, [theme]);
  
  return null; // 이 컴포넌트는 UI를 렌더링하지 않음
};

export default ThemeContext;