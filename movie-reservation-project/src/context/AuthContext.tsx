// 초기 Context 값
const initialAuthContext: AuthContextType = {
  user: null,
  isAuthenticated: false,
  loading: true,
  login: async () => false,
  logout: () => {},
  register: async () => false,
  loadUser: async () => {}
};

// Context 생성
const AuthContext = createContext<AuthContextType>(initialAuthContext);

// AuthProvider 컴포넌트 Props 타입 정의
interface AuthProviderProps {
  children: ReactNode;
}

// AuthProvider 컴포넌트 구현
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState(initialAuthContext.user);
  const [loading, setLoading] = useState(initialAuthContext.loading);
  const navigate = useNavigate();

  // 사용자 정보 로드 함수
  const loadUser = async () => {
    try {
      setLoading(true);
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        const profile = await authService.getUserProfile();
        setUser(profile);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("사용자 정보 불러오기 실패:", error);
      authService.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 사용자 정보 불러오기
  useEffect(() => {
    loadUser();
  }, []);

  // 로그인 함수
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const loggedInUser = await authService.login(email, password);
      setUser(loggedInUser);
      navigate('/');
      return true;
    } catch (error) {
      console.error("로그인 실패:", error);
      setUser(null);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 로그아웃 함수
  const logout = (): void => {
    authService.logout();
    setUser(null);
    navigate('/login');
  };

  // 회원가입 함수
  const register = async (nickname: string, email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      await authService.register(nickname, email, password);
      navigate('/login');
      return true;
    } catch (error) {
      console.error("회원가입 실패:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Context를 통해 제공할 값
  const authContextValue: AuthContextType = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
    register,
    loadUser
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };