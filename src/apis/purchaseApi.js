import authApi from "./authApi";

export const purchaseApi = async (goodsId) => {
  try {
    const response = await authApi.post(`/shop/purchase/${goodsId}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to purchase goods with id ${goodsId}:`, error);
    throw error;
  }
};
export default purchaseApi;
