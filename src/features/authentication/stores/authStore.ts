import { create } from 'zustand';
import { persist } from 'zustand/middleware';
// Importar servicios de autenticación
import {
  signIn,
  signUp,
  signOut,
  getCurrentUser,
} from '../services/authService';
// Importar directamente desde el servicio para operaciones específicas
import { supabase } from '../../../lib/supabase';

type User = {
  id: string;
  email: string;
  full_name?: string;
  credits: number;
  trial_used: boolean;
} | null;

type AuthState = {
  user: User;
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

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
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

          // Obtener datos del usuario desde nuestra tabla
          await get().refreshUserData();
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      register: async (email: string, password: string, fullName?: string) => {
        set({ isLoading: true, error: null });
        try {
          const { error } = await signUp(email, password, fullName);

          if (error) {
            // Manejar el error de email no confirmado
            if (error.message.includes('Email not confirmed')) {
              set({
                error:
                  'Te hemos enviado un email de confirmación. Por favor, revisa tu bandeja de entrada y haz clic en el enlace para activar tu cuenta.',
                isLoading: false,
              });
            } else {
              set({ error: error.message, isLoading: false });
            }
            return;
          }

          // Si no hay error, mostrar mensaje de éxito
          set({
            error:
              'Cuenta creada exitosamente. Te hemos enviado un email de confirmación.',
            isLoading: false,
          });

          // Esperar un momento para que se cree el perfil
          setTimeout(async () => {
            await get().refreshUserData();
          }, 1000);
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
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
            error: null,
          });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      addCredits: (amount: number) => {
        const { user } = get();
        if (user) {
          const updatedUser = { ...user, credits: user.credits + amount };
          set({ user: updatedUser });

          // Actualizar en la base de datos
          supabase.rpc('add_user_credits', {
            user_id: user.id,
            credit_amount: amount,
          });
        }
      },

      consumeCredit: () => {
        const { user } = get();
        if (!user || user.credits <= 0) return false;

        const updatedUser = { ...user, credits: user.credits - 1 };
        set({ user: updatedUser });

        // Actualizar en la base de datos
        supabase.rpc('use_user_credit', { user_id: user.id });

        return true;
      },

      checkSession: async () => {
        set({ isLoading: true });
        try {
          const authUser = await getCurrentUser();

          if (authUser) {
            await get().refreshUserData();
          } else {
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        } catch (error) {
          set({
            error: (error as Error).message,
            isLoading: false,
            user: null,
            isAuthenticated: false,
          });
        }
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

          // Actualizar estado local
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

          // Obtener datos del perfil del usuario
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
              credits: userData.credits,
              trial_used: userData.trial_used,
            },
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
      partialize: state => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
