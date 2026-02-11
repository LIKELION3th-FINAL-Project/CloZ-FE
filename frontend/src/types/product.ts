// 메인 카테고리
export type CategoryMain = "아우터" | "상의" | "바지" | "원피스" | "스커트" | "신발" | "가방" | "액세서리";

// 상품 기본 정보
export interface Product {
  id: number;
  category_main: string;
  category_sub: string;
  brand: string;
  product_name: string;
  price: number;
  product_url: string;
  image_url: string;
}

// 상품 목록 응답
export interface ProductListResponse {
  offset: number;
  limit: number;
  count?: number;
  products: Product[];
}

// 검색 응답
export interface SearchResponse {
  keyword: string;
  offset: number;
  limit: number;
  products: Product[];
}

// 상품 상세 (Product와 동일 구조)
export type ProductDetail = Product;
