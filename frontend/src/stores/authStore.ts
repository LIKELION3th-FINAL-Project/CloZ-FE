import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  User,
  LoginRequest,
  SignupRequest,
  AuthResponse,
  UpdateUserRequest,
} from "@/types";
import * as usersApi from "@/api/users";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  login: (credentials: LoginRequest) => Promise<void>;
  signup: (data: SignupRequest) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
  updateUser: (data: UpdateUserRequest) => Promise<void>;
  setAuth: (response: AuthResponse) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      setAuth: (response: AuthResponse) => {
        localStorage.setItem("access_token", response.access_token);
        set({
          token: response.access_token,
          isAuthenticated: true,
          user: {
            id: response.user_id,
            nickname: response.nickname,
            profile_image: "",
            height: 0,
            weight: 0,
            gender: "FEMALE",
            styles: [],
          },
        });
      },

      login: async (credentials: LoginRequest) => {
        set({ isLoading: true });
        try {
          const response = await usersApi.login(credentials);
          get().setAuth(response);
          await get().fetchUser();
        } finally {
          set({ isLoading: false });
        }
      },

      signup: async (data: SignupRequest) => {
        set({ isLoading: true });
        try {
          const response = await usersApi.signup(data);
          get().setAuth(response);
          await get().fetchUser();
        } finally {
          set({ isLoading: false });
        }
      },

      logout: () => {
        localStorage.removeItem("access_token");
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      fetchUser: async () => {
        try {
          const user = await usersApi.getMyPage();
          set({ user });
        } catch (error) {
          console.error("Failed to fetch user:", error);
        }
      },

      updateUser: async (data: UpdateUserRequest) => {
        set({ isLoading: true });
        try {
          const updatedUser = await usersApi.updateMyPage(data);
          set({ user: updatedUser });
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
