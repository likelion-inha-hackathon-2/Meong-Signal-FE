import authApi from "./authApi";
import { getCurrentPosition } from "./geolocation";

// 모든 상태의 강아지 목록을 조회
export const getAllDogs = async () => {
  try {
    const position = await getCurrentPosition();
    const response = await authApi.post("/dogs/all-status", {
      latitude: position.latitude,
      longitude: position.longitude,
    });

    return response.data.dogs;
  } catch (error) {
    console.error(error.response);
    throw error;
  }
};
