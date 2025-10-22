// 인증 컨텍스트
import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser, login, logout, refreshToken, register } from "../services/authService";
import { useDispatch } from "react-redux";
import { loadAuth } from "../store/slices/authSlice";

// 인증 컨텍스트 생성
const AuthContext = createContext(null);

// 인증 컨텍스트 제공자 컴포넌트
export const AuthProvider = ({ children }) => {

    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const initializeAuth = async () => {
            await dispatch(loadAuth()); // Redux Thunk 디스패치
            setLoading(false);
        };
        initializeAuth();
    }, [dispatch]);

    // 컴포넌트 마운트 시 사용자 인증 상태 확인
    // useEffect(() => {
    //     checkAuthStatus();
    // }, []);

    // 로그인 처리 함수
    const handleLogin = async (email, password) => {
        try {
            setLoading(true);
            setError(null);

            const result = await login(email, password);

            localStorage.setItem('token', result.token);
            localStorage.setItem('refreshToken', result.refreshToken);

            setUser(result.user);
            setIsAuthenticated(true);

            return result.user;
        } catch (error) {
            setError(error.response?.data?.message || '로그인에 실패했습니다.');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // 회원가입 처리 함수
    const handleRegister = async (userData) => {
        try {
            setLoading(true);
            setError(null);

            const result = await register(userData);
            return result;
        } catch (error) {
            setError(error.response?.data?.message || '회원가입에 실패했습니다.');
            console.log('에러메세지 : ',error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // 로그아웃 처리 함수
    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('로그아웃 중 오류:', error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
        }
    };

    // 제공할 컨텍스트 값
    const value = {
        // user,
        loading,
        error,
        // isAuthenticated,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// 인증 컨텍스트 사용을 위한 커스텀 훅
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth는 AuthProvider 내에서만 사용할 수 있습니다.');
  }
  
  return context;
};

export default AuthContext;