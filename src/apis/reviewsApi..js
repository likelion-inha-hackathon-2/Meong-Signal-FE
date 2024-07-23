import authApi from "./authApi"; 

export const submitReview = async (review) => {
  try {
    const response = await authApi.post("/reviews/owner/new", review);
    return response.data;
  } catch (error) {
    console.error("Error submitting review:", error);
    throw error;
  }
};


