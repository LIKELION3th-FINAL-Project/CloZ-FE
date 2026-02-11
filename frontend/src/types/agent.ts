import type { Gender, StyleType } from "./user";
import type { ClosetForAgent } from "./closet";

// 에이전트 요청에 포함되는 사용자 정보
export interface AgentUser {
  user_id: number;
  gender: Gender;
  height: number;
  weight: number;
  styles: StyleType[];
}

// 에이전트 요청
export interface AgentRequest {
  session_id: string;
  user: AgentUser;
  closet: ClosetForAgent;
  message: string;
  image_url?: string; // 특정 옷 포함 코디 시 첨부 이미지
}

// 코디 상품 정보
export interface OutfitProduct {
  product_id: number;
  category_main: string;
  category_sub: string;
  product_name: string;
}

// 코디 결과
export interface Outfit {
  outfit_id: number;
  image_url: string;
  products: OutfitProduct[];
}

// 에이전트 응답
export interface AgentResponse {
  session_id: string;
  message: string;
  outfits: Outfit[];
}

// 채팅 메시지 (UI용)
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  imageUrl?: string; // 사용자가 첨부한 이미지
  outfits?: Outfit[]; // AI가 추천한 코디
  timestamp: Date;
}
