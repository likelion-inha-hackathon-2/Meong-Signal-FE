import authApi from "./authApi";

export const getChallenge = async () => {
  try {
    const response = await authApi.get("/walks/challenge");
    console.log("Response data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching challenge data:", error);
    throw error;
  }
};
