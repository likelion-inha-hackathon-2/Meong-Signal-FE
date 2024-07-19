import axios from "axios";

const authApi = axios.create({
  baseURL: "http://meong-signal-back.p-e.kr",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 토큰 인터셉터 요청
authApi.interceptors.request.use(
  (config) => {
    const tokenExcludedUrls = ["/users/signup", "/users/login"];
    const isTokenRequired = !tokenExcludedUrls.some((url) =>
      config.url.includes(url),
    );

    if (isTokenRequired) {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 로그인 및 토큰 인증 처리
export const login = async (email, password) => {
  try {
    const response = await authApi.post("/users/login", { email, password });
    if (response.data && response.data.status === "200") {
      const { access_token, refresh_token } = response.data;
      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("refreshToken", refresh_token);
      authApi.defaults.headers.common["Authorization"] =
        `Bearer ${access_token}`;
    }
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

// 사용자 정보 가져오기 (MyInfoMain)
export const getUserInfo = async () => {
  try {
    const response = await authApi.get("/users/me");
    return response.data;
  } catch (error) {
    console.error("Get user info error:", error);
    throw error;
  }
};

export default authApi;
