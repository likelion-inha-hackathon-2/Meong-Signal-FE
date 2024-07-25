import authApi from "./authApi";

// 보유한 멍 조회
export const getMyMeong = async () => {
  try {
    const response = await authApi.get("/shop/meong");
    return response.data;
  } catch (error) {
    console.error("Error fetching my meong getting:", error);
    throw error;
  }
};
