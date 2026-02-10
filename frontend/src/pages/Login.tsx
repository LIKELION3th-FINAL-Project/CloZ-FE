import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import { getKakaoAuthUrl, getNaverAuthUrl, getGoogleAuthUrl } from "@/utils/oauth";
import type { LoginRequest } from "@/types";

function Login() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.login_id || !formData.password) {
      setError("이메일과 비밀번호를 입력해 주세요.");
      return;
    }

    try {
      await login(formData);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "이메일 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  return (
    <div className="min-h-[60vh] bg-white flex items-center justify-center py-12 px-4">
      <div className="max-w-sm w-full space-y-8">

        {/* 이메일 기반 로그인 */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-black mb-2 tracking-wide">
              ID
            </label>
            <input
              type="email"
              name="login_id"
              value={formData.login_id}
              onChange={handleChange}
              className="w-full border-b border-gray-300 focus:border-black focus:outline-none pb-2 text-sm transition-colors"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-black mb-2 tracking-wide">
              PASSWORD
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border-b border-gray-300 focus:border-black focus:outline-none pb-2 text-sm transition-colors"
              disabled={isLoading}
            />
          </div>

          {error && (
            <p className="text-xs text-red-500 text-center">{error}</p>
          )}

          <Button
            type="submit"
            className="w-full bg-black hover:bg-gray-800 rounded-none text-sm tracking-wide"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? "로그인 중..." : "OK"}
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full rounded-none text-sm tracking-wide border-black text-black hover:bg-gray-50"
            size="lg"
            onClick={() => navigate("/signup")}
            disabled={isLoading}
          >
            JOIN US
          </Button>

          <p className="text-center text-[11px] text-gray-400">
            Forgot your ID, PASSWORD?
          </p>
        </form>

        {/* 소셜 로그인/회원가입 통합 */}
        <div className="space-y-3">
          {/* 네이버 */}
          <Button
            type="button"
            variant="outline"
            className="w-full bg-[#03C75A] hover:bg-[#02B350] text-white border-none rounded-none text-sm tracking-wide"
            size="lg"
            onClick={() => { window.location.href = getNaverAuthUrl(); }}
            disabled={isLoading}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727v12.845z" />
            </svg>
            네이버
          </Button>

          {/* 카카오 */}
          <Button
            type="button"
            variant="outline"
            className="w-full bg-[#FEE500] hover:bg-[#FDD835] text-[#3C1E1E] border-none rounded-none text-sm tracking-wide"
            size="lg"
            onClick={() => { window.location.href = getKakaoAuthUrl(); }}
            disabled={isLoading}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3C6.477 3 2 6.463 2 10.714c0 2.683 1.764 5.037 4.418 6.373-.178.644-.644 2.337-.737 2.7-.115.456.167.45.35.328.145-.097 2.307-1.566 3.24-2.2.569.084 1.156.128 1.729.128 5.523 0 10-3.463 10-7.714C22 6.463 17.523 3 12 3z" />
            </svg>
            카카오계정
          </Button>

          {/* 구글 */}
          <Button
            type="button"
            variant="outline"
            className="w-full bg-white hover:bg-gray-50 text-gray-700 border-gray-300 rounded-none text-sm tracking-wide"
            size="lg"
            onClick={() => { window.location.href = getGoogleAuthUrl(); }}
            disabled={isLoading}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google
          </Button>
        </div>

      </div>
    </div>
  );
}

export default Login;
