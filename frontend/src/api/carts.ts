import api from "./client";
import type { CartResponse, AddToCartRequest } from "@/types";

// 장바구니 조회
export const getCart = async (): Promise<CartResponse> => {
  const response = await api.get<CartResponse>("/api/carts/");
  return response.data;
};

// 장바구니 추가
export const addToCart = async (
  data: AddToCartRequest
): Promise<{ message: string }> => {
  const response = await api.post("/api/carts/items/", data);
  return response.data;
};

// 장바구니 삭제
export const removeFromCart = async (
  productId: number
): Promise<{ message: string }> => {
  const response = await api.delete(`/api/carts/items/${productId}/`);
  return response.data;
};
