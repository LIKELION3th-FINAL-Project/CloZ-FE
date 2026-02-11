import api from "./client";
import type {
  PreparePaymentRequest,
  PreparePaymentResponse,
  ConfirmPaymentRequest,
  ConfirmPaymentResponse,
  Payment,
} from "@/types";

// 결제 준비
export const preparePayment = async (
  data: PreparePaymentRequest
): Promise<PreparePaymentResponse> => {
  const response = await api.post<PreparePaymentResponse>(
    "/api/payments/prepare/",
    data
  );
  return response.data;
};

// 결제 확인
export const confirmPayment = async (
  data: ConfirmPaymentRequest
): Promise<ConfirmPaymentResponse> => {
  const response = await api.post<ConfirmPaymentResponse>(
    "/api/payments/confirm/",
    data
  );
  return response.data;
};

// 결제 내역 조회
export const getPayments = async (): Promise<Payment[]> => {
  const response = await api.get<Payment[]>("/api/payments/");
  return response.data;
};
