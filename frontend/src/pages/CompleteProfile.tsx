import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import * as usersApi from "@/api/users";
import type { Gender, StyleType, SocialProvider } from "@/types";

const MAX_STYLES = 3;

const styleOptions: { value: StyleType; label: string }[] = [
  { value: "CASUAL", label: "캐주얼" },
  { value: "STREET", label: "스트릿" },
  { value: "MINIMAL", label: "미니멀" },
  { value: "SPORTY", label: "스포티" },
  { value: "ROMANTIC", label: "로맨틱" },
  { value: "CLASSIC", label: "클래식" },
  { value: "CHIC", label: "시크" },
  { value: "WORKWEAR", label: "워크웨어" },
  { value: "CITYBOY", label: "시티보이" },
  { value: "GORPCORE", label: "고프코어" },
  { value: "RETRO", label: "레트로" },
  { value: "PREPPY", label: "프레피" },
  { value: "RESORT", label: "리조트" },
  { value: "OUTDOOR", label: "아웃도어" },
  { value: "OFFICE", label: "오피스" },
];

// OAuthCallback에서 전달받는 소셜 인증 정보
interface SocialAuthState {
  provider: SocialProvider;
  social_access_token: string;
  email: string;
  nickname: string;
}

function CompleteProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth, fetchUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // OAuthCallback에서 전달받은 소셜 인증 정보
  const socialAuth = location.state as SocialAuthState | null;

  // 소셜 인증 정보가 없으면 로그인 페이지로 안내
  if (!socialAuth?.provider || !socialAuth?.social_access_token) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <p className="text-sm text-red-500 mb-4">잘못된 접근입니다.</p>
        <button
          onClick={() => navigate("/login")}
          className="text-xs text-gray-400 hover:text-black underline"
        >
          로그인 페이지로 돌아가기
        </button>
      </div>
    );
  }

  const [formData, setFormData] = useState({
    nickname: socialAuth.nickname || "",
    height: 170,
    weight: 60,
    gender: "FEMALE" as Gender,
    styles: [] as StyleType[],
    profile_image: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "height" || name === "weight" ? Number(value) : value,
    }));
    setError("");
  };

  const handleStyleToggle = (style: StyleType) => {
    setFormData((prev) => {
      if (prev.styles.includes(style)) {
        return { ...prev, styles: prev.styles.filter((s) => s !== style) };
      }
      if (prev.styles.length >= MAX_STYLES) return prev;
      return { ...prev, styles: [...prev.styles, style] };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // 유효성 검사
    if (!formData.nickname.trim()) {
      setError("닉네임을 입력해 주세요.");
      return;
    }

    if (formData.nickname.length > 20) {
      setError("닉네임은 최대 20자까지 입력 가능합니다.");
      return;
    }

    if (!formData.height || formData.height < 100 || formData.height > 250) {
      setError("키를 올바르게 입력해 주세요. (100~250cm)");
      return;
    }

    if (!formData.weight || formData.weight < 30 || formData.weight > 200) {
      setError("몸무게를 올바르게 입력해 주세요. (30~200kg)");
      return;
    }

    if (formData.styles.length === 0 || formData.styles.length > MAX_STYLES) {
      setError(`선호하는 스타일을 1~${MAX_STYLES}개 선택해 주세요.`);
      return;
    }

    setIsLoading(true);
    try {
      // 2차 호출: POST /social-auth/ (social_access_token + 프로필 정보)
      const response = await usersApi.socialAuthSignup({
        provider: socialAuth.provider,
        access_token: socialAuth.social_access_token,
        nickname: formData.nickname,
        height: formData.height,
        weight: formData.weight,
        gender: formData.gender,
        styles: formData.styles,
        ...(formData.profile_image ? { profile_image: formData.profile_image } : {}),
      });

      // JWT 저장 및 인증 처리
      setAuth(response);
      await fetchUser();

      // 메인으로 이동
      navigate("/", { replace: true });
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.detail ||
          "회원가입에 실패했습니다."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[60vh] bg-white flex items-center justify-center py-12 px-4">
      <div className="max-w-sm w-full">
        {/* 타이틀 */}
        <div className="text-center mb-10">
          <h1 className="text-lg font-semibold text-black mb-2">
            프로필 완성하기
          </h1>
          <p className="text-sm text-gray-400">
            나만의 스타일 추천을 위해 정보를 입력해 주세요
          </p>
          {socialAuth.email && (
            <p className="text-xs text-gray-300 mt-2">{socialAuth.email}</p>
          )}
        </div>

        {/* 프로필 입력 폼 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 닉네임 */}
          <div>
            <label className="block text-xs text-gray-400 mb-2">
              Nickname <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              placeholder="닉네임을 입력하세요 (최대 20자)"
              maxLength={20}
              className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-black transition-colors text-sm"
              disabled={isLoading}
            />
          </div>

          {/* 성별 */}
          <div>
            <label className="block text-xs text-gray-400 mb-2">
              Gender <span className="text-red-400">*</span>
            </label>
            <div className="flex gap-6 text-sm">
              <label className="flex items-center text-gray-600">
                <input
                  type="radio"
                  name="gender"
                  value="FEMALE"
                  checked={formData.gender === "FEMALE"}
                  onChange={handleChange}
                  className="mr-2 accent-black"
                  disabled={isLoading}
                />
                여성
              </label>
              <label className="flex items-center text-gray-600">
                <input
                  type="radio"
                  name="gender"
                  value="MALE"
                  checked={formData.gender === "MALE"}
                  onChange={handleChange}
                  className="mr-2 accent-black"
                  disabled={isLoading}
                />
                남성
              </label>
            </div>
          </div>

          {/* 키/몸무게 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-2">
                Height (cm) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                min={100}
                max={250}
                className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-black transition-colors text-sm"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-2">
                Weight (kg) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                min={30}
                max={200}
                className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-black transition-colors text-sm"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* 선호 스타일 */}
          <div>
            <label className="block text-xs text-gray-400 mb-3">
              Preferred Style <span className="text-red-400">*</span>
              <span className="text-gray-300 ml-2">
                ({formData.styles.length}/{MAX_STYLES}개 선택)
              </span>
            </label>
            <div className="flex flex-wrap gap-2">
              {styleOptions.map((style) => {
                const isSelected = formData.styles.includes(style.value);
                const isFull =
                  formData.styles.length >= MAX_STYLES && !isSelected;
                return (
                  <button
                    key={style.value}
                    type="button"
                    onClick={() => handleStyleToggle(style.value)}
                    className={`px-4 py-2 text-xs font-medium transition-colors border ${
                      isSelected
                        ? "bg-black text-white border-black"
                        : isFull
                        ? "bg-white text-gray-300 border-gray-100 cursor-not-allowed"
                        : "bg-white text-gray-600 border-gray-200 hover:border-black"
                    }`}
                    disabled={isLoading || isFull}
                  >
                    {style.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <p className="text-xs text-red-500 text-center">{error}</p>
          )}

          {/* 회원가입 버튼 */}
          <Button
            type="submit"
            className="w-full bg-black hover:bg-gray-800 rounded-none text-sm tracking-wide"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? "가입 중..." : "가입 완료"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default CompleteProfile;
