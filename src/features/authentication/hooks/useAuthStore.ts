import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  getCurrentUser,
  signIn,
  signOut,
  signUp,
} from '../services/authService';
import { supabase } from '../../../shared/config/supabase';

type User = {
  id: string;
  email: string;
  full_name?: string;
  trial_used?: boolean;
} | null;

type AuthState = {
  user: User;
  credits: number;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    fullName?: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  addCredits: (amount: number) => void;
  consumeCredit: () => boolean;
  checkSession: () => Promise<void>;
  updateProfile: (data: { full_name?: string }) => Promise<void>;
  refreshUserData: () => Promise<void>;
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

          // Get user data from our database
          await get().refreshUserData();
        } catch (error) {
          console.error('Login error:', error);
          set({ error: 'Error al iniciar sesión.', isLoading: false });
        }
      },

      register: async (email: string, password: string, fullName?: string) => {
        set({ isLoading: true, error: null });

        try {
          const { error } = await signUp(email, password, fullName);

          if (error) {
            set({ error: error.message, isLoading: false });
            return;
          }

          // Wait for profile to be created, then refresh user data
          setTimeout(async () => {
            await get().refreshUserData();
          }, 1000);
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
            await get().refreshUserData();
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

      updateProfile: async (data: { full_name?: string }) => {
        const { user } = get();
        if (!user) return;

        set({ isLoading: true, error: null });

        try {
          const { error } = await supabase
            .from('users')
            .update(data)
            .eq('id', user.id);

          if (error) throw error;

          // Update local state
          set({
            user: { ...user, ...data },
            isLoading: false,
          });
        } catch (error) {
          set({
            error: (error as Error).message,
            isLoading: false,
          });
        }
      },

      refreshUserData: async () => {
        try {
          const authUser = await getCurrentUser();

          if (!authUser) {
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
            });
            return;
          }

          // Get user profile data
          const { data: userData, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', authUser.id)
            .single();

          if (error) {
            console.error('Error fetching user data:', error);
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: 'Error al cargar datos del usuario',
            });
            return;
          }

          set({
            user: {
              id: userData.id,
              email: userData.email,
              full_name: userData.full_name,
              trial_used: userData.trial_used,
            },
            credits: userData.credits || 0,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            error: (error as Error).message,
            isLoading: false,
            user: null,
            isAuthenticated: false,
          });
        }
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
