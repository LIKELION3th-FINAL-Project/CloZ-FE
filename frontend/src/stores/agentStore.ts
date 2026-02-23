import { create } from "zustand";
import type { ChatMessage, Outfit } from "@/types";
import * as agentsApi from "@/api/agents";
import { useAuthStore } from "./authStore";
import { useClosetStore } from "./closetStore";

interface AgentState {
  sessionId: string;
  messages: ChatMessage[];
  isLoading: boolean;

  // Actions
  sendMessage: (message: string, imageUrl?: string) => Promise<void>;
  clearSession: () => void;
  addUserMessage: (content: string, imageUrl?: string) => void;
  addAssistantMessage: (
    content: string,
    outfits?: Outfit[]
  ) => void;
}

// UUID 생성 함수 (uuid 패키지 없이)
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const useAgentStore = create<AgentState>((set, get) => ({
  sessionId: "",
  messages: [],
  isLoading: false,

  addUserMessage: (content: string, imageUrl?: string) => {
    const message: ChatMessage = {
      id: generateId(),
      role: "user",
      content,
      imageUrl,
      timestamp: new Date(),
    };
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },

  addAssistantMessage: (content: string, outfits?: Outfit[]) => {
    const message: ChatMessage = {
      id: generateId(),
      role: "assistant",
      content,
      outfits,
      timestamp: new Date(),
    };
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },

  sendMessage: async (message: string, imageUrl?: string) => {
    const { sessionId } = get();
    const user = useAuthStore.getState().user;
    const closet = useClosetStore.getState().getClosetForAgent();

    if (!user) {
      throw new Error("로그인이 필요합니다.");
    }

    // 사용자 메시지 추가
    get().addUserMessage(message, imageUrl);

    set({ isLoading: true });

    try {
      const response = await agentsApi.sendMessage({
        session_id: sessionId,
        user: {
          user_id: user.id,
          gender: user.gender,
          height: user.height,
          weight: user.weight,
          styles: user.styles,
          body_image_url: user.body_image_url ?? null,
        },
        closet,
        message,
        image_url: imageUrl,
      });

      // 세션 ID 업데이트 (첫 요청 시)
      if (response.session_id && response.session_id !== sessionId) {
        set({ sessionId: response.session_id });
      }

      // AI 응답 메시지 추가
      get().addAssistantMessage(response.message, response.outfits);
    } catch (error) {
      console.error("Failed to send message:", error);
      get().addAssistantMessage(
        "죄송합니다. 오류가 발생했습니다. 다시 시도해 주세요."
      );
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  clearSession: () => {
    set({
      sessionId: "",
      messages: [],
    });
  },
}));
