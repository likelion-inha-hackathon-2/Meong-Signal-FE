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

// 멍 충전
export const addMyMeong = async (add_meong) => {
  try {
    const response = await authApi.post("/shop/meong", {
      meong: add_meong,
    });
    return response.data;
  } catch (error) {
    console.error("Error adding my meong:", error);
    throw error;
  }
};
