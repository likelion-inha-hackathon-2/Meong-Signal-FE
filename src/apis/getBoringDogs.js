import authApi from "./authApi";
import { getCurrentPosition } from "./geolocation";

// 심심한 상태의 강아지를 조회
export const getBoringDogs = async () => {
  try {
    const position = await getCurrentPosition();
    const response = await authApi.post("/dogs/boring", {
      latitude: position.latitude,
      longitude: position.longitude,
    });
    // console.log("심심한 강아지 목록:", response.data); // 테스트 로그
    return response.data.dogs;
  } catch (error) {
    console.error(
      "Error fetching boring dogs:",
      error.response ? error.response.data : error.message,
    );
    throw error;
  }
};
