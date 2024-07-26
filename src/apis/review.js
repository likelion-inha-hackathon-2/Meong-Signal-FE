import authApi from "./authApi";

export const fetchReceivedReviews = async () => {
  try {
    const response = await authApi.get("/reviews/received");
    return response.data;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
};

export const fetchWrittenReviews = async () => {
  try {
    const response = await authApi.get("/reviews/written");
    return response.data;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
};

// 견주 입장 리뷰 작성 API (별점)
export const createOwnerReview = async (reviewData) => {
  try {
    const response = await authApi.post("/reviews/owner/new", reviewData);
    return response.data;
  } catch (error) {
    console.error("Error creating owner review:", error);
    throw error;
  }
};

// 사용자 입장 리뷰 작성 API(태그)
export const createUserReview = async (reviewData) => {
  try {
    const response = await authApi.post("/reviews/user/new", reviewData);
    return response.data;
  } catch (error) {
    console.error("Error creating user review:", error);
    throw error;
  }
};
