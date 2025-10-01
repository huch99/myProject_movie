// src/hooks/useAuth.ts
import { useState, useCallback, useEffect, useMemo } from 'react';
import type { User, LoginFormData, RegisterFormData } from '../types/user.types';

// 인증 상태 정의
interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  error: string | null;
}

// 인증 액션 정의
interface AuthActions {
  login: (credentials: LoginFormData) => Promise<void>;
  register: (userData: RegisterFormData) => Promise<void>;
  logout: () => void;
  // TODO: 추후에 회원 정보 수정, 비밀번호 변경 등 추가
}

// useAuth 훅 로직
export const useAuth = (): AuthState & AuthActions => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true); // 초기 로딩 (로컬 스토리지 확인 등)
  const [error, setError] = useState<string | null>(null);

  // 로컬 스토리지에서 사용자 정보 로드 (앱 시작 시 한 번)
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
    setLoading(false);
  }, []);

  // 로그인 함수
  const login = useCallback(async (credentials: LoginFormData) => {
    setLoading(true);
    setError(null);
    try {
      // 실제 백엔드 API 호출 대신 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1500));
      
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
        localStorage.setItem('user', JSON.stringify(loggedInUser)); // 사용자 정보 저장
      } else {
        throw new Error('이메일 또는 비밀번호가 잘못되었습니다.');
      }
    } catch (err: any) {
      setError(err.message || '로그인에 실패했습니다.');
      throw err; // UI 컴포넌트에서 catch 할 수 있도록 에러 다시 던지기
    } finally {
      setLoading(false);
    }
  }, []);

  // 회원가입 함수
  const register = useCallback(async (userData: RegisterFormData) => {
    setLoading(true);
    setError(null);
    try {
      // 실제 백엔드 API 호출 대신 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1500));
      // 회원가입 성공했다고 가정
      console.log('User registered:', userData);
    } catch (err: any) {
      setError(err.message || '회원가입에 실패했습니다.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // 로그아웃 함수
  const logout = useCallback(() => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('user');
  }, []);

  // useMemo를 사용하여 반환되는 객체가 불필요하게 다시 생성되지 않도록 함
  const authStateAndActions = useMemo(() => ({
    user,
    isLoggedIn,
    loading,
    error,
    login,
    register,
    logout,
  }), [user, isLoggedIn, loading, error, login, register, logout]);

  return authStateAndActions;
};