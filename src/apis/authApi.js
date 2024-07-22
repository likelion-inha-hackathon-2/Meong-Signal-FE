import axios from "axios";

const authApi = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  timeout: 5000,
  headers: {
    Accept: "application/json, text/plain, */*",
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

export default authApi;
