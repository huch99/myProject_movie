// 인증 컨텍스트
import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser, login, logout, refreshToken, register } from "../services/authService";

// 인증 컨텍스트 생성
const AuthContext = createContext(null);

// 인증 컨텍스트 제공자 컴포넌트
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // 컴포넌트 마운트 시 사용자 인증 상태 확인
    useEffect(() => {
        const checkAuthStatus = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                setLoading(false);
                return;
            }

            try {
                // 토큰이 있으면 현재 사용자 정보 요청
                const userData = await getCurrentUser();
                setUser(userData);
                setIsAuthenticated(true);
            } catch (error) {
                // 토큰이 만료되었거나 유효하지 않은 경우 토큰 갱신 시도
                try {
                    const refreshTokenValue = localStorage.getItem('refreshToken');
                    if (refreshTokenValue) {
                        const result = await refreshToken(refreshTokenValue);
                        if (result.token) {
                            localStorage.setItem('token', result.token);
                            const userData = await getCurrentUser();
                            setUser(userData);
                            setIsAuthenticated(true);
                        } else {
                            handleLogout();
                        }
                    } else {
                        handleLogout();
                    }
                } catch (error) {
                    console.error('토큰 갱신 실패 : ', refreshError);
                    handleLogout
                }
            } finally {
                setLoading(false);
            }
        };

        checkAuthStatus();
    }, []);

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
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    // 제공할 컨텍스트 값
    const value = {
        user,
        loading,
        error,
        isAuthenticated,
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