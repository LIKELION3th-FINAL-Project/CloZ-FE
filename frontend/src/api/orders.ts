import api from "./client";
import type {
  CreateOrderRequest,
  CreateOrderResponse,
  Order,
} from "@/types";

// 주문 생성
export const createOrder = async (
  data: CreateOrderRequest
): Promise<CreateOrderResponse> => {
  const response = await api.post<CreateOrderResponse>("/api/orders/", data);
  return response.data;
};

// 주문 내역 조회
export const getOrders = async (): Promise<Order[]> => {
  const response = await api.get<Order[]>("/api/orders/");
  return response.data;
};
