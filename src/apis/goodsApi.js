import authApi from "./authApi";

// 카테고리 별 상품 조회
export const getProducts = async (category) => {
  try {
    const response = await authApi.get(`/shop/category/${category}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch goods by category ${category}:`, error);
    throw error;
  }
};

// 상품 구매
export const purchaseProduct = async (productId) => {
  try {
    const response = await authApi.post("/shop/purchase", {
      product_id: productId,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to purchase product:", error);
    throw error;
  }
};

// 구매한 상품 조회
export const getMyProducts = async () => {
  try {
    const response = await authApi.get("/shop/my-products");
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch my products:`, error);
    throw error;
  }
};
