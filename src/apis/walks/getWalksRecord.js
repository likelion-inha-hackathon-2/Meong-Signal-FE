import authApi from "../authApi";

// 내 정보에서 산책 기록을 조회
export const getWalksRecord = async () => {
  try {
    const response = await authApi.get("/walks/all");
    return response.data;
  } catch (error) {
    console.error(error.response);
    throw error;
  }
};
