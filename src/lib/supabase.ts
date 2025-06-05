import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://supabase.inteliai.cl';
const supabaseAnonKey = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc0NTg5MTEwMCwiZXhwIjo0OTAxNTY0NzAwLCJyb2xlIjoiYW5vbiJ9.8UyiFY1t8tNCHd_Y13GwBSekVjUg95FoRX1_ytfYxjM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type AuthError = {
  message: string;
};

export async function signUp(email: string, password: string): Promise<{ error: AuthError | null }> {
  const { error } = await supabase.auth.signUp({
    email,
    password,
  });
  
  return { error: error as AuthError | null };
}

export async function signIn(email: string, password: string): Promise<{ error: AuthError | null }> {
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
export function onAuthStateChange(callback: (event: string, session: any) => void) {
  return supabase.auth.onAuthStateChange(callback);
}