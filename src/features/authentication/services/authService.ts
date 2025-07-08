import { supabase } from '../../../shared/config/supabase';

export type AuthError = {
  message: string;
};

/**
 * Registers a new user with email and password
 */
export async function signUp(
  email: string,
  password: string
): Promise<{ error: AuthError | null }> {
  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  return { error: error as AuthError | null };
}

/**
 * Signs in a user with email and password
 */
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

/**
 * Signs out the current user
 */
export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}

/**
 * Gets the current user from the session
 */
export async function getCurrentUser() {
  const { data } = await supabase.auth.getSession();
  return data?.session?.user;
}
