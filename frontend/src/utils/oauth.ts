const REDIRECT_BASE = `${window.location.origin}/callback`;

export function getKakaoAuthUrl() {
  const params = new URLSearchParams({
    client_id: import.meta.env.VITE_KAKAO_REST_API_KEY,
    redirect_uri: `${REDIRECT_BASE}/kakao`,
    response_type: "code",
    prompt: "login",
  });
  return `https://kauth.kakao.com/oauth/authorize?${params}`;
}

export function getNaverAuthUrl() {
  const params = new URLSearchParams({
    client_id: import.meta.env.VITE_NAVER_CLIENT_ID,
    redirect_uri: `${REDIRECT_BASE}/naver`,
    response_type: "code",
    state: "cloz_state",
    auth_type: "reprompt",
  });
  return `https://nid.naver.com/oauth2.0/authorize?${params}`;
}

export function getGoogleAuthUrl() {
  const params = new URLSearchParams({
    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    redirect_uri: `${REDIRECT_BASE}/google`,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "select_account",
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}
