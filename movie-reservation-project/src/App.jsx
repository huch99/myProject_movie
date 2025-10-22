import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import AppRouter from './AppRouter';
import { checkAuthStatus, logoutUser } from './store/slices/authSlice';
import { ThemeProvider } from './context/ThemeContext';
import ScrollToTop from './components/common/ScrollToTop';
import { AuthProvider } from './context/AuthContext'; // ⭐️ AuthProvider 임포트 추가
import { BrowserRouter } from 'react-router-dom';
import ErrorBoundary from './components/common/ErrorBoundary';
import storageUtils from './utils/storageUtils';

/**
 * 애플리케이션의 최상위 컴포넌트
 */
const App = () => {
  const dispatch = useDispatch();

  // 앱 초기화 시 사용자 인증 상태 확인
  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <ScrollToTop />
            <AppRouter />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;