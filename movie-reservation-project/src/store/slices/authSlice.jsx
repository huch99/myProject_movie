// 인증 관련 슬라이스
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService'; // authService.js 임포트
import userService from '../../services/userService'; // userService.js 임포트 (getCurrentUser 위임)
import storageUtils from '../../utils/storageUtils'; // 로컬 스토리지 유틸리티 임포트



// 초기 상태
const initialState = {
    // user: storageUtils.user.getUserInfo(), // 로컬 스토리지에서 사용자 정보 로드
    // user : null,
    user: storageUtils.user.getUserInfo() || null,
    accessToken: storageUtils.token.getAccessToken(), // 로컬 스토리지에서 액세스 토큰 로드
    // accessToken: storageUtils.getItem('accessToken') || null,
    refreshToken: storageUtils.token.getRefreshToken(), // 로컬 스토리지에서 리프레시 토큰 로드
    // refreshToken: storageUtils.getItem('refreshToken') || null,
    isAuthenticated: !!storageUtils.token.getAccessToken(), // 액세스 토큰 존재 여부로 인증 상태 판단
    // isAuthenticated : true,
    loading: false,
    error: null,
};

// 비동기 액션: 로그인
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const response = await authService.login(email, password);
            storageUtils.token.setAccessToken(response.accessToken);
            storageUtils.token.setRefreshToken(response.refreshToken);
            storageUtils.user.setUserInfo(response.user);
            return {
                data: response.data,
                status: response.status
                // headers는 제외하거나 필요한 헤더만 객체 형태로 추출
            };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || '로그인에 실패했습니다.');
        }
    }
);

// 비동기 액션: 회원가입
export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await authService.register(userData);
            // return response;
            return {
                data: response.data,
                status: response.status
            };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || '회원가입에 실패했습니다.');
        }
    }
);

// 비동기 액션: 로그아웃
export const logoutUser = createAsyncThunk(
    'auth/logoutUser',
    async (_, { rejectWithValue }) => {
        try {
            await authService.logout();
            // 로컬 스토리지에서 토큰 및 사용자 정보 삭제
            storageUtils.token.clearTokens();
            storageUtils.user.clearUserInfo();
            return true;
        } catch (error) {
            // 서버 로그아웃 실패 시에도 로컬 상태는 정리
            storageUtils.token.clearTokens();
            storageUtils.user.clearUserInfo();
            return rejectWithValue(error.response?.data?.message || '로그아웃에 실패했습니다.');
        }
    }
);

// 비동기 액션: 토큰 갱신
export const refreshAccessToken = createAsyncThunk(
    'auth/refreshAccessToken',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            const currentRefreshToken = auth.refreshToken || storageUtils.token.getRefreshToken();

            if (!currentRefreshToken) {
                throw new Error('리프레시 토큰이 없습니다.');
            }

            const response = await authService.refreshToken(currentRefreshToken);
            // 새 토큰 로컬 스토리지에 저장
            storageUtils.token.setAccessToken(response.accessToken);
            storageUtils.token.setRefreshToken(response.refreshToken);
            return response;
        } catch (error) {
            // 토큰 갱신 실패 시 로컬 스토리지 정리 및 로그아웃 처리 유도
            storageUtils.token.clearTokens();
            storageUtils.user.clearUserInfo();
            return rejectWithValue(error.response?.data?.message || '토큰 갱신에 실패했습니다. 다시 로그인해주세요.');
        }
    }
);

// 비동기 액션: 현재 사용자 정보 가져오기 (인증 상태 유효성 검사 등)
export const fetchCurrentUser = createAsyncThunk(
    'auth/fetchCurrentUser',
    async (_, { rejectWithValue }) => {
        try {
            const user = await userService.getCurrentUser(); // userService를 통해 현재 사용자 정보 조회
            storageUtils.user.setUserInfo(user); // 로컬 스토리지에 사용자 정보 업데이트
            return user;
        } catch (error) {
            // 사용자 정보 가져오기 실패 시 (예: 토큰 만료)
            storageUtils.token.clearTokens();
            storageUtils.user.clearUserInfo();
            return rejectWithValue(error.response?.data?.message || '사용자 정보를 불러오는데 실패했습니다.');
        }
    }
);

export const updateUserProfile = createAsyncThunk(
    'auth/updateUserProfile',
    async (userData, { rejectWithValue }) => {
        try {
            // API 호출 (실제 구현 시 axios 등으로 대체)
            const response = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                throw new Error('프로필 업데이트에 실패했습니다.');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const checkAuthStatus = createAsyncThunk(
    'auth/checkAuthStatus',
    async (_, { rejectWithValue }) => {
        try {
            // 인증 상태 확인 로직
            // ...
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


export const loadAuth = createAsyncThunk(
    'auth/loadAuth',
    async (_, { dispatch }) => {
        const token = localStorage.getItem('accessToken');
        const refreshTokenValue = localStorage.getItem('refreshToken');
        // const dispatch = useDispatch();

        if (token) {
            // 액세스 토큰이 있으면 사용자 정보를 가져와 Redux 상태 업데이트
            try {
                const userData = await authService.getCurrentUser(); // 백엔드 호출
                dispatch(authSlice.actions.setAuth({
                    isAuthenticated: true,
                    user: userData,
                    accessToken: token, // 로컬 스토리지에서 가져온 토큰 전달
                }));
            } catch (error) {
                // 액세스 토큰 만료 등 문제 발생 시 리프레시 토큰 시도
                if (refreshTokenValue) {
                    try {
                        const result = await authService.refreshToken(refreshTokenValue);
                        if (result.token) {
                            localStorage.setItem('accessToken', result.token);
                            const newUserData = await authService.getCurrentUser();
                            dispatch(authSlice.actions.setAuth({
                                isAuthenticated: true,
                                user: newUserData,
                                accessToken: result.token,
                            }));
                        } else {
                            // 리프레시 토큰도 실패하면 로그아웃 처리
                            dispatch(authSlice.actions.clearAuth()); // Redux 상태 초기화
                            localStorage.clear(); // 로컬 스토리지도 정리
                        }
                    } catch (refreshError) {
                        console.log('리프레시 토큰 갱신 실패 : ', refreshError);
                        dispatch(authSlice.actions.clearAuth());
                        localStorage.clear();
                    }
                } else {
                    // 액세스 토큰도 없고 리프레시 토큰도 없으면 로그아웃 처리
                    dispatch(authSlice.actions.clearAuth());
                    localStorage.clear();
                }
            }
        } else {
            // 토큰이 아예 없으면 Redux 상태 초기화
            dispatch(authSlice.actions.clearAuth());
            localStorage.clear();
        }
    }
)


// 인증 슬라이스 생성
const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isAuthenticated: false,
        user: null,
        accessToken: null,
        refreshToken: null,
    },
    reducers: {
        setAuth: (state, action) => {
            state.isAuthenticated = action.payload.isAuthenticated;
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
            // refreshToken도 필요하면 payload에 포함
        },
        clearAuth: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;
        },
        // 동기 액션: 인증 관련 에러 수동 설정
        setAuthError: (state, action) => {
            state.error = action.payload;
        },
        // 동기 액션: 인증 관련 에러 지우기
        clearAuthError: (state) => {
            state.error = null;
        },
        // 동기 액션: 사용자 정보 수동 업데이트 (예: 프로필 변경 후)
        setUser: (state, action) => {
            state.user = action.payload;
            storageUtils.user.setUserInfo(action.payload); // 로컬 스토리지에도 업데이트
        },
        // 동기 액션: 모든 인증 정보 초기화 (로컬 스토리지와는 별개)
        clearAuthData: (state) => {
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;
            storageUtils.token.clearTokens();
            storageUtils.user.clearUserInfo();
        },
    },
    extraReducers: (builder) => {
        builder
            // 로그인 액션 처리
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            // .addCase(loginUser.fulfilled, (state, action) => {
            //     state.loading = false;
            //     state.user = action.payload.user;
            //     state.accessToken = action.payload.accessToken;
            //     state.refreshToken = action.payload.refreshToken;
            //     state.isAuthenticated = true;
            // })
            // .addCase(loginUser.rejected, (state, action) => {
            //     state.loading = false;
            //     state.error = action.payload || '로그인에 실패했습니다.';
            //     state.isAuthenticated = false;
            //     // 실패 시 로컬 스토리지 정보도 정리
            //     storageUtils.token.clearTokens();
            //     storageUtils.user.clearUserInfo();
            // })

            // 회원가입 액션 처리 (로딩 및 에러만 관리)
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || '회원가입에 실패했습니다.';
            })

            // 로그아웃 액션 처리
            .addCase(logoutUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.loading = false;
                authSlice.caseReducers.clearAuthData(state); // 로그아웃 성공 시 상태 초기화
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || '로그아웃 중 오류가 발생했지만, 로컬 데이터는 정리되었습니다.';
                authSlice.caseReducers.clearAuthData(state); // 로그아웃 실패 시에도 로컬 상태 초기화
            })

            // 토큰 갱신 액션 처리
            .addCase(refreshAccessToken.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(refreshAccessToken.fulfilled, (state, action) => {
                state.loading = false;
                state.accessToken = action.payload.accessToken;
                state.refreshToken = action.payload.refreshToken;
                state.isAuthenticated = true; // 토큰 갱신 성공했으니 인증된 상태
            })
            .addCase(refreshAccessToken.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || '토큰 갱신에 실패했습니다.';
                authSlice.caseReducers.clearAuthData(state); // 토큰 갱신 실패 시 상태 초기화 (로그아웃 효과)
            })

            // 현재 사용자 정보 가져오기 액션 처리
            .addCase(fetchCurrentUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCurrentUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true; // 사용자 정보를 성공적으로 가져왔으니 인증된 상태
            })
            .addCase(fetchCurrentUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || '사용자 정보를 불러오는데 실패했습니다.';
                authSlice.caseReducers.clearAuthData(state); // 사용자 정보 불러오기 실패 시 상태 초기화 (로그아웃 효과)
            })
            .addCase(updateUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // 추가
            .addCase(loginUser.fulfilled, (state, action) => {
                // 로그인 성공 시 로컬 스토리지 저장은 loginUser Thunk 내부에서
                state.isAuthenticated = true;
                state.user = action.payload.user; // 백엔드 응답의 user
                state.accessToken = action.payload.accessToken; // 백엔드 응답의 accessToken
                state.refreshToken = action.payload.refreshToken; // 백엔드 응답의 refreshToken
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isAuthenticated = false;
                state.user = null;
                state.accessToken = null;
                state.refreshToken = null;
                localStorage.clear();
            });
    },
});

// 동기 액션 생성자 내보내기
export const { setAuthError, clearAuthError, setUser, clearAuthData } = authSlice.actions;

// 리듀서 내보내기
export default authSlice.reducer;