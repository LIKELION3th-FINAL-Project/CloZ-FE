// 옷장 카테고리
export type ClosetCategory = "TOP" | "BOTTOM" | "OUTER";

// 옷장 아이템
export interface ClosetItem {
  id: number;
  category: string;
  image_url: string;
  created_at: string;
}

// 에이전트용 옷장 데이터 구조
export interface ClosetForAgent {
  TOP: { image_url: string }[];
  BOTTOM: { image_url: string }[];
  OUTER: { image_url: string }[];
}
