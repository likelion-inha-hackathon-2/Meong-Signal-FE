import authApi from "./authApi";

// 새로운 약속 생성
export const createAppointment = async (appointment) => {
  try {
    const response = await authApi.post("/schedule/appointment", appointment);
    return response.data;
  } catch (error) {
    console.error("Error creating appointment:", error);
    throw error;
  }
};

// 약속 정보 수정
export const updateAppointment = async (id, appointment) => {
  try {
    const response = await authApi.put(`/schedule/${id}`, appointment);
    return response.data;
  } catch (error) {
    console.error("Error updating appointment:", error);
    throw error;
  }
};

// 남은 시간이 3일 이하인 약속 목록 조회
export const getUpcomingAppointment = async () => {
  try {
    const response = await authApi.get(`/schedule/upcoming`);
    return response.data;
  } catch (error) {
    console.error("Error updating appointment:", error);
    throw error;
  }
};
