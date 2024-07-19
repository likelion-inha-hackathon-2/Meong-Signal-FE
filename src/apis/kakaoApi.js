import axios from "axios";

const kakaoApi = axios.create({
  baseURL: "https://dapi.kakao.com/v2/local",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    Authorization: `KakaoAK ${process.env.REACT_APP_KAKAO_REST_API_KEY}`,
  },
});

// 집 주소를 보내면 위도, 경도와 함께 변환
export const getCoordinates = async (roadAddress) => {
  try {
    const response = await axios.post("/walks/coordinate", {
      road_address: roadAddress,
    });
    const { latitude, longitude } = response.data;
    return { latitude: parseFloat(latitude), longitude: parseFloat(longitude) };
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    throw error;
  }
};

export default kakaoApi;
