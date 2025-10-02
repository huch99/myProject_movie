import { useContext, type Context } from "react";
import type { User } from "../types/user.types";
import { AuthContext } from "../context/AuthContext";

// AuthContext가 제공할 값들의 타입 정의
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (nickname: string, email: string, password: string) => Promise<boolean>;
  loadUser: () => Promise<void>; // 사용자 정보를 다시 불러오는 함수
}

// useAuth 커스텀 훅
export const useAuth = () => {
  const context = useContext(AuthContext as Context<AuthContextType>);
  
  if (!context) {
    throw new Error('useAuth는 AuthProvider 내에서만 사용할 수 있습니다.');
  }
  
  return context;
};

export default useAuth;