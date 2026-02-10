import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import type { SignupRequest, StyleType } from "@/types";

interface SignupFormProps {
  onSubmit: (data: SignupRequest) => Promise<void>;
  isLoading?: boolean;
}

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

export function SignupForm({ onSubmit, isLoading }: SignupFormProps) {
  const [formData, setFormData] = useState<SignupRequest>({
    login_id: "",
    password: "",
    nickname: "",
    height: 170,
    weight: 60,
    gender: "FEMALE",
    styles: [],
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

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
    if (!formData.login_id || !formData.password || !formData.nickname) {
      setError("모든 필수 항목을 입력해 주세요.");
      return;
    }

    if (formData.password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (formData.password.length < 8) {
      setError("비밀번호는 8자 이상이어야 합니다.");
      return;
    }

    if (formData.styles.length !== MAX_STYLES) {
      setError(`선호하는 스타일을 ${MAX_STYLES}개 선택해 주세요.`);
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err: any) {
      setError(err.response?.data?.message || "회원가입에 실패했습니다.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 이메일 */}
      <div>
        <label className="block text-xs text-gray-400 mb-2">
          Email <span className="text-red-400">*</span>
        </label>
        <input
          type="email"
          name="login_id"
          value={formData.login_id}
          onChange={handleChange}
          placeholder="example@email.com"
          className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-black transition-colors text-sm"
          disabled={isLoading}
        />
      </div>

      {/* 비밀번호 */}
      <div>
        <label className="block text-xs text-gray-400 mb-2">
          Password <span className="text-red-400">*</span>
        </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="8자 이상 입력"
          className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-black transition-colors text-sm"
          disabled={isLoading}
        />
      </div>

      {/* 비밀번호 확인 */}
      <div>
        <label className="block text-xs text-gray-400 mb-2">
          Confirm Password <span className="text-red-400">*</span>
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="비밀번호 재입력"
          className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-black transition-colors text-sm"
          disabled={isLoading}
        />
      </div>

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
          placeholder="닉네임을 입력하세요"
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
            Height (cm)
          </label>
          <input
            type="number"
            name="height"
            value={formData.height}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-black transition-colors text-sm"
            disabled={isLoading}
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-2">
            Weight (kg)
          </label>
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-black transition-colors text-sm"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* 선호 스타일 */}
      <div>
        <label className="block text-xs text-gray-400 mb-3">
          Preferred Style <span className="text-red-400">*</span>
          <span className="text-gray-300 ml-2">({formData.styles.length}/{MAX_STYLES}개 선택)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {styleOptions.map((style) => {
            const isSelected = formData.styles.includes(style.value);
            const isFull = formData.styles.length >= MAX_STYLES && !isSelected;
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
      {error && <p className="text-xs text-red-500 text-center">{error}</p>}

      {/* 회원가입 버튼 */}
      <Button
        type="submit"
        className="w-full bg-black hover:bg-gray-800 rounded-none text-sm tracking-wide"
        size="lg"
        disabled={isLoading}
      >
        {isLoading ? "가입 중..." : "Sign Up"}
      </Button>

      {/* 로그인 링크 */}
      <p className="text-center text-xs text-gray-400">
        이미 계정이 있으신가요?{" "}
        <Link to="/login" className="text-black hover:underline">
          로그인
        </Link>
      </p>
    </form>
  );
}
