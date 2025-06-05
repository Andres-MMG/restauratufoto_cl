import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getCurrentUser, signIn, signOut, signUp } from '../lib/supabase';

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
  useCredit: () => boolean;
  checkSession: () => Promise<void>;
};

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
          
          // For demo, give one credit when logging in
          set({ 
            user: user ? { id: user.id, email: user.email as string } : null,
            isAuthenticated: !!user,
            credits: 1,
            isLoading: false 
          });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
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
          
          const user = await getCurrentUser();
          
          // For demo, give one credit when registering
          set({ 
            user: user ? { id: user.id, email: user.email as string } : null,
            isAuthenticated: !!user,
            credits: 1,
            isLoading: false 
          });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },
      
      logout: async () => {
        set({ isLoading: true });
        try {
          await signOut();
          set({ user: null, isAuthenticated: false, credits: 0, isLoading: false });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },
      
      addCredits: (amount: number) => {
        set((state) => ({ credits: state.credits + amount }));
      },
      
      useCredit: () => {
        const { credits } = get();
        if (credits <= 0) return false;
        
        set((state) => ({ credits: state.credits - 1 }));
        return true;
      },
      
      checkSession: async () => {
        set({ isLoading: true });
        try {
          const user = await getCurrentUser();
          
          set({ 
            user: user ? { id: user.id, email: user.email as string } : null,
            isAuthenticated: !!user,
            // Keep existing credits for demo purposes
            isLoading: false 
          });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user,
        credits: state.credits,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);