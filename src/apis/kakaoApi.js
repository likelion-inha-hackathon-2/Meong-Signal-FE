import axios from "axios";

const kakaoApi = axios.create({
  baseURL: "https://dapi.kakao.com/v2/local",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    Authorization: `KakaoAK ${process.env.REACT_APP_KAKAO_REST_API_KEY}`,
  },
});

/*
kakaoApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken"); // 로컬 스토리지에서 토큰 가져오기
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
*/

// 집 주소를 보내면 위도, 경도와 함께 변환
export const getCoordinates = async (roadAddress) => {
  try {
    const response = await kakaoApi.get("/search/address.json", {
      params: {
        query: roadAddress,
      },
    });
    const { documents } = response.data;
    if (documents.length > 0) {
      const { y: latitude, x: longitude } = documents[0].address;
      return {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      };
    } else {
      throw new Error("No coordinates found.");
    }
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    throw error;
  }
};

export default kakaoApi;
