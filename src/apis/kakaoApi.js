import axios from "axios";
import { getCurrentPosition } from "./geolocation";

const kakaoApi = axios.create({
  baseURL: "https://dapi.kakao.com/v2/local",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    Authorization: `KakaoAK ${process.env.REACT_APP_KAKAO_REST_API_KEY}`,
  },
});

// 현재 위치를 보내서 위도, 경도로 변환
export const getCoordinates = async () => {
  try {
    const position = await getCurrentPosition();
    const { latitude, longitude } = position;

    const response = await kakaoApi.get("/geo/coord2address.json", {
      params: {
        x: longitude,
        y: latitude,
      },
    });

    const { documents } = response.data;
    if (documents.length > 0) {
      return {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      };
    } else {
      throw new Error("No address found.");
    }
  } catch (error) {
    console.error("Error fetching address:", error);
    throw error;
  }
};

export default kakaoApi;
