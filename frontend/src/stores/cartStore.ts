import { create } from "zustand";
import type { CartItem } from "@/types";
import * as cartsApi from "@/api/carts";

interface CartState {
  items: CartItem[];
  cartId: number | null;
  isLoading: boolean;

  // Computed
  totalPrice: () => number;
  totalQuantity: () => number;

  // Actions
  fetchCart: () => Promise<void>;
  addItem: (productId: number, quantity: number) => Promise<void>;
  removeItem: (productId: number) => Promise<void>;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  cartId: null,
  isLoading: false,

  totalPrice: () => {
    return get().items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  },

  totalQuantity: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const response = await cartsApi.getCart();
      set({
        items: response.items,
        cartId: response.cart_id,
      });
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  addItem: async (productId: number, quantity: number) => {
    try {
      await cartsApi.addToCart({ product_id: productId, quantity });
      // 카트 새로고침
      await get().fetchCart();
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      throw error;
    }
  },

  removeItem: async (productId: number) => {
    try {
      await cartsApi.removeFromCart(productId);
      // 로컬 상태 즉시 업데이트
      set((state) => ({
        items: state.items.filter((item) => item.product_id !== productId),
      }));
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
      throw error;
    }
  },

  clearCart: () => {
    set({ items: [], cartId: null });
  },
}));
