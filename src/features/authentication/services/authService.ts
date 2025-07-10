import { supabase } from '../../../lib/supabase';

export type AuthError = {
  message: string;
};

/**
 * Registers a new user with email and password
 */
export async function signUp(
  email: string,
  password: string,
  fullName?: string
): Promise<{ error: AuthError | null }> {
  console.log(
    `Attempting to sign up user with email: ${email}, name: ${fullName || 'not provided'}`
  );

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || '',
        },
      },
    });

    if (error) {
      console.error('Supabase SignUp Error:', error.message);
    } else {
      console.log('Sign up successful, user:', data?.user?.id);
    }

    return { error: error as AuthError | null };
  } catch (e) {
    console.error('Unexpected error during signup:', e);
    return { error: { message: `Unexpected error: ${e}` } };
  }
}

/**
 * Signs in a user with email and password
 */
export async function signIn(
  email: string,
  password: string
): Promise<{ error: AuthError | null }> {
  console.log(`Attempting to sign in user with email: ${email}`);

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Supabase SignIn Error:', error.message);
    } else {
      console.log('Sign in successful, user:', data?.user?.id);
    }

    return { error: error as AuthError | null };
  } catch (e) {
    console.error('Unexpected error during signin:', e);
    return { error: { message: `Unexpected error: ${e}` } };
  }
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

/**
 * Tests the Supabase connection to identify potential issues
 */
export async function testConnection(): Promise<{
  ok: boolean;
  message: string;
}> {
  try {
    // Test if we can get the session
    const { error } = await supabase.auth.getSession();

    if (error) {
      console.error('Connection test failed:', error);
      return { ok: false, message: `Error en la conexión: ${error.message}` };
    }

    // Test if we can access the database
    const { error: dbError } = await supabase
      .from('users')
      .select('count')
      .limit(1)
      .single();

    if (dbError && dbError.code !== 'PGRST116') {
      // PGRST116 is "no rows returned" which is fine for the test
      console.warn('Database access test warning:', dbError);
      return {
        ok: false,
        message: `Error en acceso a la base de datos: ${dbError.message}`,
      };
    }

    return { ok: true, message: 'Conexión correcta a Supabase' };
  } catch (e) {
    console.error('Unexpected error testing connection:', e);
    return { ok: false, message: `Error inesperado: ${e}` };
  }
}
