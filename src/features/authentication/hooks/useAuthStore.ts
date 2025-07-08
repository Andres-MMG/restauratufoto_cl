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
            set({
              error: 'No se pudo obtener la información del usuario.',
              isLoading: false,
            });
          }
        } catch (error) {
          console.error('Login error:', error);
          set({ error: 'Error al iniciar sesión.', isLoading: false });
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
        } catch (error) {
          console.error('Registration error:', error);
          set({ error: 'Error al registrar usuario.', isLoading: false });
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
          });
        } catch (error) {
          console.error('Logout error:', error);
          set({ error: 'Error al cerrar sesión.', isLoading: false });
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
        } catch (error) {
          console.error('Session check error:', error);
          set({ isLoading: false });
        }
      },

      addCredits: (amount: number) => {
        set((state) => ({ credits: state.credits + amount }));
      },

      consumeCredit: () => {
        const { credits } = get();

        if (credits <= 0) {
          return false;
        }

        set((state) => ({ credits: state.credits - 1 }));
        return true;
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        credits: state.credits,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
