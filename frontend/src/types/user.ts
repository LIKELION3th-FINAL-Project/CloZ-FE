// 성별 타입
export type Gender = "MALE" | "FEMALE";

// 스타일 타입
export type StyleType =
  | "CASUAL"
  | "STREET"
  | "MINIMAL"
  | "SPORTY"
  | "ROMANTIC"
  | "CLASSIC"
  | "CHIC"
  | "WORKWEAR"
  | "CITYBOY"
  | "GORPCORE"
  | "RETRO"
  | "PREPPY"
  | "RESORT"
  | "OUTDOOR"
  | "OFFICE";

// 소셜 로그인 제공자
export type SocialProvider = "kakao" | "google" | "naver";

// 사용자 정보
export interface User {
  id: number;
  nickname: string;
  profile_image: string;
  height: number;
  weight: number;
  gender: Gender;
  styles: StyleType[];
}

// 회원가입 요청
export interface SignupRequest {
  login_id: string;
  password: string;
  nickname: string;
  height: number;
  weight: number;
  gender: Gender;
  profile_image?: string;
  styles: StyleType[];
}

// 소셜 인증 1차 요청 (code로 소셜 인증)
export interface SocialAuthCodeRequest {
  provider: SocialProvider;
  code: string;
  redirect_uri: string;
}

// 소셜 인증 2차 요청 (프로필 입력 후 회원가입)
export interface SocialAuthSignupRequest {
  provider: SocialProvider;
  access_token: string;
  nickname: string;
  height: number;
  weight: number;
  gender: Gender;
  styles: string[];
  profile_image?: string;
}

// 회원정보 수정 요청 (partial update)
export interface UpdateUserRequest {
  nickname?: string;
  profile_image?: string;
  height?: number;
  weight?: number;
  gender?: Gender;
  styles?: string[];
}

// 로그인 요청
export interface LoginRequest {
  login_id: string;
  password: string;
}

// 소셜 인증 응답 - 기존 유저 (바로 로그인 완료)
export interface SocialAuthExistingUser {
  is_new_user: false;
  user_id: number;
  nickname: string;
  access_token: string;
}

// 소셜 인증 응답 - 신규 유저 (회원가입 폼 필요)
export interface SocialAuthNewUser {
  is_new_user: true;
  email: string;
  nickname: string;
  social_access_token: string;
}

// 소셜 인증 응답 - 가입 완료
export interface SocialAuthSignupComplete {
  is_new_user: true;
  user_id: number;
  nickname: string;
  access_token: string;
}

// 소셜 인증 응답 (판별 유니온)
export type SocialAuthResponse = SocialAuthExistingUser | SocialAuthNewUser;

// 인증 응답
export interface AuthResponse {
  user_id: number;
  nickname: string;
  access_token: string;
}

// 배송지
export interface Address {
  address_id: number;
  receiver: string;
  phone: string;
  address: string;
  is_default: boolean;
}

// 배송지 요청
export interface AddressRequest {
  receiver: string;
  phone: string;
  address: string;
  is_default: boolean;
}
