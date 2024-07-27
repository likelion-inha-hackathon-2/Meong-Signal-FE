import authApi from "./authApi";

// 모든 업적 조회
export const getAllAchievements = async () => {
  try {
    const response = await authApi.get("/achievements/all");
    return response.data;
  } catch (error) {
    console.error("Error fetching all achievements:", error);
    throw error;
  }
};

// 대표 업적 설정하기 - 업적 id 필요
export const setRepresentativeAchievement = async (achievementId) => {
  try {
    console.log("보내는 업적 id", { id: achievementId });
    const response = await authApi.post("/achievements/set-represent", {
      id: achievementId,
    });
    console.log("받는 데이터: ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error response data:", error.response.data);
  }
};

// 설정한 대표 업적 조회
export const getRepresentativeAchievement = async () => {
  try {
    const response = await authApi.get("/achievements/represent");
    return response.data;
  } catch (error) {
    console.error("Error fetching representative achievement:", error);
    throw error;
  }
};
