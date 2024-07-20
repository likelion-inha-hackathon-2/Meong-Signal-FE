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
    const token = localStorage.getItem("token");
    if (token && config.url !== "/users/signup") {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 회원가입 요청 함수
export const signUp = (data) => {
  return authApi.post("/users/signup", data);
};

export default authApi;
