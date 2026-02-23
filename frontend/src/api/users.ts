import api from "./client";
import type {
  SignupRequest,
  SocialAuthCodeRequest,
  SocialAuthSignupRequest,
  SocialAuthResponse,
  SocialAuthSignupComplete,
  LoginRequest,
  AuthResponse,
  User,
  UpdateUserRequest,
  AddressRequest,
  Address,
} from "@/types";

const createUserFormData = (
  data: SignupRequest | UpdateUserRequest
): FormData => {
  const formData = new FormData();

  if ("login_id" in data && typeof data.login_id === "string") {
    formData.append("login_id", data.login_id);
  }
  if ("password" in data && typeof data.password === "string") {
    formData.append("password", data.password);
  }
  if (typeof data.nickname === "string") {
    formData.append("nickname", data.nickname);
  }
  if (typeof data.height === "number") {
    formData.append("height", String(data.height));
  }
  if (typeof data.weight === "number") {
    formData.append("weight", String(data.weight));
  }
  if (typeof data.gender === "string") {
    formData.append("gender", data.gender);
  }
  if (typeof data.profile_image === "string" && data.profile_image) {
    formData.append("profile_image", data.profile_image);
  }
  if (Array.isArray(data.styles)) {
    data.styles.forEach((style) => formData.append("styles", style));
  }
  if (data.body_image instanceof File) {
    formData.append("body_image", data.body_image);
  }

  return formData;
};

// 이메일 회원가입
export const signup = async (data: SignupRequest): Promise<AuthResponse> => {
  const hasBodyImage = data.body_image instanceof File;
  const payload = hasBodyImage ? createUserFormData(data) : data;
  const response = await api.post<AuthResponse>("/api/users/signup/", payload, {
    headers: hasBodyImage ? { "Content-Type": "multipart/form-data" } : undefined,
  });
  return response.data;
};

// 소셜 인증 1차: code로 기존 유저 확인 또는 신규 유저 감지
export const socialAuth = async (data: SocialAuthCodeRequest): Promise<SocialAuthResponse> => {
  const response = await api.post<SocialAuthResponse>("/api/users/social-auth/", data);
  return response.data;
};

// 소셜 인증 2차: 신규 유저 프로필 입력 후 회원가입 완료
export const socialAuthSignup = async (data: SocialAuthSignupRequest): Promise<SocialAuthSignupComplete> => {
  const response = await api.post<SocialAuthSignupComplete>("/api/users/social-auth/", data);
  return response.data;
};

// 로그인
export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/api/users/login/", data);
  return response.data;
};

// 사용자 정보 조회 (마이페이지)
export const getMyPage = async (): Promise<User> => {
  const response = await api.get<User>("/api/users/mypage/");
  return response.data;
};

// 회원정보 수정
export const updateMyPage = async (data: UpdateUserRequest): Promise<User> => {
  const hasBodyImage = data.body_image instanceof File;
  const payload = hasBodyImage ? createUserFormData(data) : data;
  const response = await api.put<User>("/api/users/mypage/", payload, {
    headers: hasBodyImage ? { "Content-Type": "multipart/form-data" } : undefined,
  });
  return response.data;
};

// 배송지 추가
export const addAddress = async (
  data: AddressRequest
): Promise<{ address_id: number; message: string }> => {
  const response = await api.post("/api/users/addresses/", data);
  return response.data;
};

// 배송지 수정
export const updateAddress = async (
  addressId: number,
  data: AddressRequest
): Promise<{ message: string }> => {
  const response = await api.put(`/api/users/addresses/${addressId}/`, data);
  return response.data;
};

// 배송지 목록 조회
export const getAddresses = async (): Promise<Address[]> => {
  const response = await api.get<Address[]>("/api/users/addresses/");
  return response.data;
};
