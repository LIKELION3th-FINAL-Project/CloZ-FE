import api from "./client";
import type {
  ProductListResponse,
  SearchResponse,
  ProductDetail,
} from "@/types";

// 상품 목록 조회
export const getProducts = async (
  offset: number = 0,
  limit: number = 20
): Promise<ProductListResponse> => {
  const response = await api.get<ProductListResponse>("/api/products/", {
    params: { offset, limit },
  });
  return response.data;
};

// 카테고리별 상품 목록 조회
export const getProductsByCategory = async (
  categoryMain: string,
  offset: number = 0,
  limit: number = 20,
  categorySub?: string
): Promise<ProductListResponse> => {
  const params: Record<string, string | number> = { offset, limit };
  if (categorySub) {
    params.category_sub = categorySub;
  }
  const response = await api.get<ProductListResponse>(
    `/api/products/categories/${encodeURIComponent(categoryMain)}/`,
    { params }
  );
  return response.data;
};

// 상품 검색
export const searchProducts = async (
  keyword: string,
  offset: number = 0,
  limit: number = 20
): Promise<SearchResponse> => {
  const response = await api.get<SearchResponse>("/api/products/search/", {
    params: { keyword, offset, limit },
  });
  return response.data;
};

// 상품 상세 조회
export const getProductDetail = async (
  productId: number
): Promise<ProductDetail> => {
  const response = await api.get<ProductDetail>(`/api/products/${productId}/`);
  return response.data;
};
