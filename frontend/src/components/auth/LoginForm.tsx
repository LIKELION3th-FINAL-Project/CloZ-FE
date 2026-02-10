import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import type { LoginRequest } from "@/types";

interface LoginFormProps {
  onSubmit: (data: LoginRequest) => Promise<void>;
  isLoading?: boolean;
}

export function LoginForm({ onSubmit, isLoading }: LoginFormProps) {
  const [formData, setFormData] = useState<LoginRequest>({
    login_id: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.login_id || !formData.password) {
      setError("이메일과 비밀번호를 입력해 주세요.");
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err: any) {
      setError(err.response?.data?.message || "이메일 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 이메일 */}
      <div>
        <label
          htmlFor="login_id"
          className="block text-xs text-gray-400 mb-2"
        >
          Email
        </label>
        <input
          type="email"
          id="login_id"
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
        <label
          htmlFor="password"
          className="block text-xs text-gray-400 mb-2"
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="비밀번호를 입력하세요"
          className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-black transition-colors text-sm"
          disabled={isLoading}
        />
      </div>

      {/* 에러 메시지 */}
      {error && (
        <p className="text-xs text-red-500 text-center">{error}</p>
      )}

      {/* 로그인 버튼 */}
      <Button
        type="submit"
        className="w-full bg-black hover:bg-gray-800 rounded-none text-sm tracking-wide"
        size="lg"
        disabled={isLoading}
      >
        {isLoading ? "로그인 중..." : "Login"}
      </Button>

      {/* 회원가입 링크 */}
      <p className="text-center text-xs text-gray-400">
        아직 계정이 없으신가요?{" "}
        <Link to="/signup" className="text-black hover:underline">
          회원가입
        </Link>
      </p>
    </form>
  );
}
