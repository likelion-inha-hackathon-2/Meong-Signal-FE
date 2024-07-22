// src/apis/getUserInfo.js
import authApi from "./authApi";

export const getUserInfo = async () => {
  try {
    const response = await authApi.get("/users/me");
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch user info");
  }
};
