export interface User {
  id: number;
  email: string;
  nickname: string;
  profileImage?: string; // 프로필 이미지 URL (선택 사항)
  // 기타 필요한 사용자 정보 (예: 포인트, 등급 등)

  name: string;
  birthdate: string;
  phone: string;
  membership: string;
  points: number;
  joinDate: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  birthdate: string;
  phone: string;
  agreeTerms: boolean;
  agreePrivacy: boolean;
  agreeMarketing: boolean;
}