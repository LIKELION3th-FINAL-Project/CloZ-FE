// 주문 상태
export type OrderStatus = "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED";

// 주문 생성용 아이템
export interface OrderCreateItem {
  product_id: number;
  quantity: number;
}

// 주문 응답용 아이템 (상세 정보 포함)
export interface OrderDetailItem {
  product_name: string;
  brand: string;
  price: number;
  quantity: number;
  image_url: string;
}

// 주문 생성 요청
export interface CreateOrderRequest {
  items: OrderCreateItem[];
  address_id: number;
}

// 주문 생성 응답
export interface CreateOrderResponse {
  order_id: number;
  status: OrderStatus;
}

// 주문 내역
export interface Order {
  id: number;
  status: OrderStatus;
  total_price: number;
  total_quantity: number;
  created_at: string;
  items: OrderDetailItem[];
}

// 결제 준비 요청
export interface PreparePaymentRequest {
  order_id: number;
}

// 결제 준비 응답
export interface PreparePaymentResponse {
  payment_key: string;
  price: number;
}

// 결제 확인 요청
export interface ConfirmPaymentRequest {
  order_id: number;
  payment_key: string;
}

// 결제 확인 응답
export interface ConfirmPaymentResponse {
  status: "PAID";
}

// 결제 내역
export interface Payment {
  id: number;
  order_id: number;
  order_status: OrderStatus;
  payment_key: string;
  price: number;
  status: "PAID" | "PENDING" | "FAILED";
  created_at: string;
  paid_at: string;
}
