// 장바구니 아이템
export interface CartItem {
  product_id: number;
  product_name: string;
  price: number;
  quantity: number;
  image_url?: string;
}

// 장바구니 응답
export interface CartResponse {
  cart_id: number;
  items: CartItem[];
}

// 장바구니 추가 요청
export interface AddToCartRequest {
  product_id: number;
  quantity: number;
}
