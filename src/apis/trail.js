import authApi from "./authApi";
import { getCoordinates } from "./geolocation";

// 추천 산책로 조회
export const getRecommendedTrails = async () => {
  try {
    const { latitude, longitude } = await getCoordinates();
    const response = await authApi.post("/walks/recommended-trails", {
      latitude,
      longitude,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching recommended trails:", error);
    throw error;
  }
};

// 특정 산책로 데이터를 저장하는 토글
export const toggleTrail = async (trail) => {
  try {
    const response = await authApi.post("/walks/toggle", trail);
    return response.data;
  } catch (error) {
    console.error("Error toggling trail:", error);
    throw error;
  }
};

// 저장된 산책로 가져오기
export const getMarkedTrails = async () => {
  try {
    const response = await authApi.get("/walks/mark");
    return response.data;
  } catch (error) {
    console.error("Error fetching marked trails:", error);
    throw error;
  }
};

// id로 저장한 특정 산책로 삭제
export const deleteTrail = async (trailId) => {
  try {
    const response = await authApi.delete(`/walks/${trailId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting trail:", error);
    throw error;
  }
};
