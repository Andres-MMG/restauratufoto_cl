import { createClient, type Session } from '@supabase/supabase-js';

// Usar variables de entorno para la configuración de Supabase
const supabaseUrl =
  import.meta.env.VITE_URLSUPABASE || 'https://supabase.restauratufoto.cl';
const supabaseAnonKey = import.meta.env.VITE_ANONSUPABASE || '';

// Para depuración - revisar valores de configuración
console.log('Supabase URL:', supabaseUrl);
// No imprimas la clave completa por seguridad
console.log(
  'Supabase Key (primeros caracteres):',
  supabaseAnonKey.substring(0, 10) + '...'
);

// Asegurarnos de que la URL no tenga espacios en blanco u otros problemas
const cleanSupabaseUrl = supabaseUrl.trim();

// Singleton pattern para evitar múltiples instancias
let supabaseInstance: ReturnType<typeof createClient> | null = null;

function createSupabaseClient() {
  if (supabaseInstance) {
    console.log('Returning existing Supabase client instance');
    return supabaseInstance;
  }

  console.log('Creating new Supabase client instance');
  supabaseInstance = createClient(cleanSupabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      storageKey: 'restauratufoto-auth-storage',
    },
  });

  return supabaseInstance;
}

// Crear y exportar el cliente de Supabase
export const supabase = createSupabaseClient();

export type AuthError = {
  message: string;
};

export async function signUp(
  email: string,
  password: string,
  fullName?: string
): Promise<{ error: AuthError | null }> {
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName || '',
      },
    },
  });

  return { error: error as AuthError | null };
}

export async function signIn(
  email: string,
  password: string
): Promise<{ error: AuthError | null }> {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { error: error as AuthError | null };
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}

// Get the current logged in user
export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser();
  return data?.user;
}

// Subscribe to auth changes
export function onAuthStateChange(
  callback: (event: string, session: Session | null) => void
) {
  return supabase.auth.onAuthStateChange(callback);
}
