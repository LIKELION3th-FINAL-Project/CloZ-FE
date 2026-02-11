import api from "./client";
import type { ClosetItem, ClosetCategory } from "@/types";

// 옷장 조회
export const getCloset = async (): Promise<ClosetItem[]> => {
  const response = await api.get<ClosetItem[]>("/api/closets/");
  return response.data;
};

// 옷장에 옷 추가 (multipart/form-data)
export const addToCloset = async (
  category: ClosetCategory,
  image: File
): Promise<{ message: string }> => {
  const formData = new FormData();
  formData.append("category", category);
  formData.append("image", image);

  const response = await api.post("/api/closets/items/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// 옷장에서 옷 삭제
export const removeFromCloset = async (
  itemId: number
): Promise<{ message: string }> => {
  const response = await api.delete(`/api/closets/items/${itemId}/`);
  return response.data;
};
