import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  getCurrentUser,
  signIn,
  signOut,
  signUp,
} from '../services/authService';

type User = {
  id: string;
  email: string;
} | null;

type AuthState = {
  user: User;
  credits: number;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  addCredits: (amount: number) => void;
  consumeCredit: () => boolean;
  checkSession: () => Promise<void>;
  clearError: () => void;
};

/**
 * Authentication store using Zustand for global state management
 * Persists authentication state to localStorage
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      credits: 0,
      isLoading: false,
      error: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
          const { error } = await signIn(email, password);

          if (error) {
            set({ error: error.message, isLoading: false });
            return;
          }

          const user = await getCurrentUser();

          if (user) {
            set({
              user: { id: user.id, email: user.email as string },
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            const errorMsg = 'No se pudo obtener la información del usuario.';
            set({
              error: errorMsg,
              isLoading: false,
            });
          }
        } catch {
          const errorMsg = 'Error al iniciar sesión.';
          set({ error: errorMsg, isLoading: false });
        }
      },

      register: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
          const { error } = await signUp(email, password);

          if (error) {
            set({ error: error.message, isLoading: false });
            return;
          }

          // Auto-login after registration
          await get().login(email, password);
        } catch {
          const errorMsg = 'Error al registrar usuario.';
          set({ error: errorMsg, isLoading: false });
        }
      },

      logout: async () => {
        set({ isLoading: true });

        try {
          await signOut();
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            credits: 0,
            error: null, // Limpiar errores al cerrar sesión
          });
        } catch {
          const errorMsg = 'Error al cerrar sesión.';
          set({ error: errorMsg, isLoading: false });
        }
      },

      checkSession: async () => {
        set({ isLoading: true });

        try {
          const user = await getCurrentUser();

          if (user) {
            set({
              user: { id: user.id, email: user.email as string },
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            set({ isLoading: false });
          }
        } catch {
          set({ isLoading: false });
        }
      },

      addCredits: (amount: number) => {
        set(state => ({ credits: state.credits + amount }));
      },

      consumeCredit: () => {
        const { credits } = get();

        if (credits <= 0) {
          return false;
        }

        set(state => ({ credits: state.credits - 1 }));
        return true;
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      partialize: state => ({
        user: state.user,
        credits: state.credits,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
