import authApi from "./authApi";
// 내 강아지 목록 가져오기
export const fetchMyDogs = async () => {
  try {
    const response = await authApi.get("/dogs/all");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch dogs:", error);
    throw error;
  }
};
