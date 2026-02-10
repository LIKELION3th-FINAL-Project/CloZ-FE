import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import * as usersApi from "@/api/users";

function OAuthCallback() {
  const { provider } = useParams<{ provider: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAuth, fetchUser } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get("code");

    if (!provider || !code) {
      setError("잘못된 접근입니다.");
      return;
    }

    const redirectUri = `${window.location.origin}/callback/${provider}`;

    (async () => {
      try {
        // 1차 호출: POST /social-auth/ (code 전송)
        const response = await usersApi.socialAuth({
          provider: provider as "kakao" | "google" | "naver",
          code,
          redirect_uri: redirectUri,
        });

        if (response.is_new_user) {
          // 신규 유저 → 회원가입 폼으로 이동
          // social_access_token, email, nickname 전달
          navigate("/complete-profile", {
            replace: true,
            state: {
              provider,
              social_access_token: response.social_access_token,
              email: response.email,
              nickname: response.nickname,
            },
          });
        } else {
          // 기존 유저 → JWT 저장 후 홈으로 이동
          setAuth(response);
          await fetchUser();
          navigate("/", { replace: true });
        }
      } catch (err: any) {
        console.error("Social auth failed:", err);
        setError(err.response?.data?.message || err.message || "소셜 인증에 실패했습니다.");
      }
    })();
  }, [provider, searchParams]);

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <p className="text-sm text-red-500 mb-4">{error}</p>
        <button
          onClick={() => navigate("/login")}
          className="text-xs text-gray-400 hover:text-black underline"
        >
          로그인 페이지로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <p className="text-sm text-gray-400">로그인 처리 중...</p>
    </div>
  );
}

export default OAuthCallback;
