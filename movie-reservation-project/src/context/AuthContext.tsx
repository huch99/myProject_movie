// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { User, LoginFormData, RegisterFormData } from '../types/user.types';

// 인증 상태 타입 정의
interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  error: string | null;
}

// 인증 관련 액션 타입 정의
interface AuthActions {
  login: (credentials: LoginFormData) => Promise<void>;
  register: (userData: RegisterFormData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

// AuthContext에 저장될 값의 타입 정의
interface AuthContextType extends AuthState, AuthActions {}

// 초기값 설정
const initialAuthContext: AuthContextType = {
  user: null,
  isLoggedIn: false,
  loading: false,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  clearError: () => {}
};

// Context 생성
const AuthContext = createContext<AuthContextType>(initialAuthContext);

// AuthProvider Props 타입 정의
interface AuthProviderProps {
  children: React.ReactNode;
}

// AuthProvider 컴포넌트
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // 초기 로딩 시 로컬 스토리지에서 사용자 정보 가져오기
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsLoggedIn(true);
      } catch (err) {
        // 로컬 스토리지에 저장된 데이터가 유효하지 않은 경우
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);
  
  // 로그인 함수
  const login = async (credentials: LoginFormData) => {
    setLoading(true);
    setError(null);
    try {
      // 실제 백엔드 API 호출 대신 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 예시 로그인 검증 (실제로는 백엔드 API 호출로 대체)
      if (credentials.email === 'test@example.com' && credentials.password === 'password123') {
        const loggedInUser: User = {
          id: 1,
          name: '테스터',
          email: credentials.email,
          phone: '010-1234-5678',
          birthdate: '1990-01-01',
          membership: '골드 회원',
          points: 5000,
          joinDate: '2023-01-01',
        };
        setUser(loggedInUser);
        setIsLoggedIn(true);
        localStorage.setItem('user', JSON.stringify(loggedInUser));
      } else {
        throw new Error('이메일 또는 비밀번호가 잘못되었습니다.');
      }
    } catch (err: any) {
      setError(err.message || '로그인에 실패했습니다.');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // 회원가입 함수
  const register = async (userData: RegisterFormData) => {
    setLoading(true);
    setError(null);
    try {
      // 실제 백엔드 API 호출 대신 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 예시 이메일 중복 확인 (실제로는 백엔드 API 호출로 대체)
      if (userData.email === 'test@example.com') {
        throw new Error('이미 사용 중인 이메일 주소입니다.');
      }
      
      // 회원가입 성공 처리 (실제로는 백엔드에서 응답한 데이터 사용)
      console.log('회원가입 성공:', userData);
      // 실제 구현에서는 여기서 자동 로그인을 수행하거나 로그인 페이지로 리다이렉트
    } catch (err: any) {
      setError(err.message || '회원가입에 실패했습니다.');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // 로그아웃 함수
  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('user');
  };
  
  // 에러 초기화 함수
  const clearError = () => {
    setError(null);
  };
  
  // Context 값 최적화 (불필요한 리렌더링 방지)
  const contextValue = useMemo(() => ({
    user,
    isLoggedIn,
    loading,
    error,
    login,
    register,
    logout,
    clearError
  }), [user, isLoggedIn, loading, error]);
  
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// 커스텀 훅: AuthContext를 사용하기 위한 훅
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth는 AuthProvider 내에서 사용해야 합니다');
  }
  return context;
};