// 인증 관련 커스텀 훅
import { login, logout, refreshToken, register } from "../services/authService";

const { createContext, useState, useContext, useCallback, useEffect } = require("react");

// 인증 컨텍스트 생성
const AuthContext = createContext(null);

// 인증 Provider 컴포넌트
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 로컬 스토리지에서 토큰 가져오기
    const getStoredToken = () => {
        return localStorage.getItem('token');
    };

    // 로컬 스토리지에서 사용자 정보 가져오기
    const getStoredUser = () => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    };

    // 토큰 저장
    const setStoredToken = (token) => {
        localStorage.setItem('token', token);
    };

    // 리프레시 토큰 저장
    const setStoredRefreshToken = (refreshToken) => {
        localStorage.setItem('refreshToken', refreshToken);
    };

    // 사용자 정보 저장
    const setStoredUser = (user) => {
        localStorage.setItem('user', JSON.stringify(user));
    };

    // 인증 정보 초기화
    const clearStoredAuth = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
    };

    // 사용자 로그인 처리
    const handleLogin = async (email, password) => {
        try {
            setLoading(true);
            setError(null);

            const response = await login(email, password);
            const { token, refreshToken: newRefreshToken, user: userData } = response.data;

            setStoredToken(token);
            setStoredRefreshToken(newRefreshToken);
            setStoredUser(userData);

            setUser(userData);
            return userData;
        } catch (err) {
            setError(err.response?.data?.message || '로그인에 실패했습니다.');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // 회원가입 처리
    const handleRegister = async (userData) => {
        try {
            setLoading(true);
            setError(null);

            const response = await register(userData);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || '회원가입에 실패했습니다.');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // 로그아웃 처리
    const handleLogout = useCallback(async () => {
        try {
            await logout();
        } catch (err) {
            console.error('로그아웃 중 오류 발생:', err);
        } finally {
            clearStoredAuth();
            setUser(null);
        }
    }, []);

    // 토큰 갱신
    const handleRefreshToken = async () => {
        try {
            const storedRefreshToken = localStorage.getItem('refreshToken');
            if (!storedRefreshToken) {
                return false;
            }

            const response = await refreshToken(storedRefreshToken);
            const { token: newToken, refreshToken: newRefreshToken } = response.data;

            setStoredToken(newToken);
            setStoredRefreshToken(newRefreshToken);

            return true;
        } catch (err) {
            console.error('토큰 갱신 중 오류 발생:', err);
            clearStoredAuth();
            setUser(null);
            return false;
        }
    };

    // 사용자 인증 상태 확인
    const checkAuthStatus = useCallback(async () => {
        try {
            setLoading(true);
            const storedToken = getStoredToken();
            const storedUser = getStoredUser();

            if (!storedToken || !storedUser) {
                setUser(null);
                return;
            }

            // 토큰이 만료되었을 가능성이 있으므로 토큰 갱신 시도
            const isRefreshed = await handleRefreshToken();
            if (!isRefreshed) {
                setUser(null);
                return;
            }

            setUser(storedUser);
        } catch (err) {
            console.error('인증 상태 확인 중 오류 발생:', err);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    // 컴포넌트 마운트 시 인증 상태 확인
    useEffect(() => {
        checkAuthStatus();
    }, [checkAuthStatus]);

    // 제공할 컨텍스트 값
    const value = {
        user,
        loading,
        error,
        isAuthenticated: !!user,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        refreshToken: handleRefreshToken
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 인증 훅
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth는 AuthProvider 내에서만 사용할 수 있습니다.');
  }
  return context;
};

export default useAuth;