import type { LoginFormData, RegisterFormData, User } from '../types/user.types';
import api from './api';

// 인증 관련 API 응답 타입 정의
interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
}

interface RefreshTokenResponse {
    accessToken: string;
}

// 인증 서비스 클래스
class AuthService {
    // 로그인 메소드
    async login(credentials: LoginFormData): Promise<User> {
        try {
            const response = await api.post<AuthResponse>('/auth/login', credentials);

            // 토큰 저장
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            return response.data.user;
        } catch (error: any) {
            // 에러 메시지 처리
            if (error.response) {
                const { status, data } = error.response;

                if (status === 401) {
                    throw new Error('이메일 또는 비밀번호가 잘못되었습니다.');
                } else if (data.message) {
                    throw new Error(data.message);
                }
            }
            throw new Error('로그인에 실패했습니다. 다시 시도해 주세요.');
        }
    }

    // 회원가입 메소드
    async register(userData: RegisterFormData): Promise<void> {
        try {
            await api.post('/auth/register', userData);
        } catch (error: any) {
            // 에러 메시지 처리
            if (error.response) {
                const { status, data } = error.response;

                if (status === 409) {
                    throw new Error('이미 사용 중인 이메일입니다.');
                } else if (data.message) {
                    throw new Error(data.message);
                }
            }
            throw new Error('회원가입에 실패했습니다. 다시 시도해 주세요.');
        }
    }

    // 로그아웃 메소드
    logout(): void {
        // 토큰 및 사용자 정보 삭제
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
    }

    async getUserProfile(): Promise<User> {
        try {
            const response = await api.get<User>('/users/me'); // 현재 로그인한 사용자의 정보를 가져오는 엔드포인트
            const currentUser = this.getCurrentUser();
            if (currentUser) { // 로컬 스토리지에 사용자 정보가 있으면 업데이트
                localStorage.setItem('user', JSON.stringify(response.data));
            }
            return response.data;
        } catch (error) {
            console.error('사용자 프로필 조회 실패:', error);
            throw new Error('프로필 정보를 불러오는데 실패했습니다.');
        }
    }

    // 현재 로그인한 사용자 정보 가져오기
    getCurrentUser(): User | null {
        const userJson = localStorage.getItem('user');
        if (!userJson) {
            return null;
        }

        try {
            return JSON.parse(userJson) as User;
        } catch (error) {
            console.error('사용자 정보 파싱 오류:', error);
            return null;
        }
    }

    // 로그인 상태 확인
    isLoggedIn(): boolean {
        return !!localStorage.getItem('accessToken');
    }

    // 토큰 갱신
    async refreshToken(): Promise<string> {
        try {
            const refreshToken = localStorage.getItem('refreshToken');

            if (!refreshToken) {
                throw new Error('리프레시 토큰이 없습니다.');
            }

            const response = await api.post<RefreshTokenResponse>('/auth/refresh', { refreshToken });

            localStorage.setItem('accessToken', response.data.accessToken);

            return response.data.accessToken;
        } catch (error) {
            this.logout(); // 오류 발생 시 로그아웃
            throw new Error('토큰 갱신에 실패했습니다.');
        }
    }

    // 비밀번호 변경
    async changePassword(currentPassword: string, newPassword: string): Promise<void> {
        try {
            await api.post('/auth/change-password', {
                currentPassword,
                newPassword
            });
        } catch (error: any) {
            if (error.response && error.response.status === 401) {
                throw new Error('현재 비밀번호가 일치하지 않습니다.');
            }
            throw new Error('비밀번호 변경에 실패했습니다.');
        }
    }

    // 회원 정보 업데이트
    async updateProfile(userData: Partial<User>): Promise<User> {
        try {
            const response = await api.put<User>('/auth/profile', userData);

            // 로컬 스토리지의 사용자 정보 업데이트
            const currentUser = this.getCurrentUser();
            if (currentUser) {
                const updatedUser = { ...currentUser, ...response.data };
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }

            return response.data;
        } catch (error) {
            throw new Error('프로필 업데이트에 실패했습니다.');
        }
    }

    // 비밀번호 재설정 이메일 요청
    async requestPasswordReset(email: string): Promise<void> {
        try {
            await api.post('/auth/reset-password-request', { email });
        } catch (error) {
            throw new Error('비밀번호 재설정 요청에 실패했습니다.');
        }
    }

    // 비밀번호 재설정
    async resetPassword(token: string, newPassword: string): Promise<void> {
        try {
            await api.post('/auth/reset-password', {
                token,
                newPassword
            });
        } catch (error) {
            throw new Error('비밀번호 재설정에 실패했습니다.');
        }
    }
}

// 싱글톤 인스턴스 생성 및 내보내기
const authService = new AuthService();
export default authService;