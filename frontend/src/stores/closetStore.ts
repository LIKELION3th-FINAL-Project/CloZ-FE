import { create } from "zustand";
import type { ClosetItem, ClosetForAgent, ClosetCategory } from "@/types";
import * as closetsApi from "@/api/closets";

interface ClosetState {
  items: ClosetItem[];
  isLoading: boolean;

  // Computed
  getClosetForAgent: () => ClosetForAgent;
  getItemsByCategory: (category: string) => ClosetItem[];
  hasMinimumItems: () => boolean; // 3/3/3 체크

  // Actions
  fetchCloset: () => Promise<void>;
  addItem: (category: ClosetCategory, image: File) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
}

export const useClosetStore = create<ClosetState>((set, get) => ({
  items: [],
  isLoading: false,

  getClosetForAgent: () => {
    const items = get().items;
    const closet: ClosetForAgent = {
      TOP: [],
      BOTTOM: [],
      OUTER: [],
    };

    items.forEach((item) => {
      const category = item.category.toUpperCase();
      if (category === "상의" || category === "TOP") {
        closet.TOP.push({ image_url: item.image_url });
      } else if (category === "하의" || category === "바지" || category === "BOTTOM") {
        closet.BOTTOM.push({ image_url: item.image_url });
      } else if (category === "아우터" || category === "OUTER") {
        closet.OUTER.push({ image_url: item.image_url });
      }
    });

    return closet;
  },

  getItemsByCategory: (category: string) => {
    return get().items.filter(
      (item) => item.category.toLowerCase() === category.toLowerCase()
    );
  },

  // 3/3/3 충족 여부 확인 (아우터 3, 상의 3, 하의 3)
  hasMinimumItems: () => {
    const closet = get().getClosetForAgent();
    return (
      closet.TOP.length >= 3 &&
      closet.BOTTOM.length >= 3 &&
      closet.OUTER.length >= 3
    );
  },

  fetchCloset: async () => {
    set({ isLoading: true });
    try {
      const items = await closetsApi.getCloset();
      set({ items });
    } catch (error) {
      console.error("Failed to fetch closet:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  addItem: async (category: ClosetCategory, image: File) => {
    try {
      await closetsApi.addToCloset(category, image);
      await get().fetchCloset();
    } catch (error) {
      console.error("Failed to add item to closet:", error);
      throw error;
    }
  },

  removeItem: async (itemId: number) => {
    try {
      await closetsApi.removeFromCloset(itemId);
      set((state) => ({
        items: state.items.filter((item) => item.id !== itemId),
      }));
    } catch (error) {
      console.error("Failed to remove item from closet:", error);
      throw error;
    }
  },
}));
