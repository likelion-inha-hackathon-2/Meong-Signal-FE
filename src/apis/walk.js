import authApi from "./authApi";

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

// 산책 완료 시 기록 저장
export const saveWalkData = async () => {
  try {
    const response = await authApi.post("/walks/new");
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error.response);
    throw error;
  }
};

/*
// 산책 관련 유저 이미지 조회
export const getUserImage = async (walkId) => {
  try {
    const response = await authApi.get(`/walks/user-image/${walkId}`);
    return response.data;
  } catch (error) {
    console.error(error.response);
    throw error;
  }
};

// 산책 정보와 그에 달린 리뷰 조회
export const getWalkReviewInfo = async () => {
  try {
    const response = await authApi.post("/walks/walk-review-info");
    return response.data;
  } catch (error) {
    console.error(error.response);
    throw error;
  }
};
*/
