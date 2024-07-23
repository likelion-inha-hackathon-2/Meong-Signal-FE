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
