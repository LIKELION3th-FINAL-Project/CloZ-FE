import { useNavigate } from "react-router-dom";
import { SignupForm, SocialLoginButtons } from "@/components/auth";
import { useAuthStore } from "@/stores/authStore";
import { getKakaoAuthUrl, getNaverAuthUrl, getGoogleAuthUrl } from "@/utils/oauth";
import type { SignupRequest } from "@/types";

function Signup() {
  const navigate = useNavigate();
  const { signup, isLoading } = useAuthStore();

  const handleSignup = async (data: SignupRequest) => {
    await signup(data);
    navigate("/");
  };

  return (
    <div className="min-h-[60vh] bg-white flex items-center justify-center py-12 px-4">
      <div className="max-w-sm w-full">
        {/* 타이틀 */}
        <div className="text-center mb-10">
          <p className="text-sm text-gray-400">회원가입하고 나만의 스타일을 찾아보세요</p>
        </div>

        {/* 회원가입 카드 */}
        <div className="space-y-6">
          {/* 소셜 회원가입 */}
          <SocialLoginButtons
            onKakaoLogin={() => { window.location.href = getKakaoAuthUrl(); }}
            onGoogleLogin={() => { window.location.href = getGoogleAuthUrl(); }}
            onNaverLogin={() => { window.location.href = getNaverAuthUrl(); }}
            isLoading={isLoading}
          />

          {/* 구분선 */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-4 bg-white text-gray-400">or sign up with email</span>
            </div>
          </div>

          {/* 이메일 회원가입 폼 */}
          <SignupForm onSubmit={handleSignup} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}

export default Signup;
