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
    const response = await authApi.post(
      "/achievements/achievements/set-represent",
      { achievement_id: achievementId },
    );
    return response.data;
  } catch (error) {
    console.error("Error setting representative achievement:", error);
    throw error;
  }
};
