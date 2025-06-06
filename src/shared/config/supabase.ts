import { createClient } from '@supabase/supabase-js';

// Load from environment variables in a real app
const supabaseUrl = 'https://supabase.inteliai.cl';
const supabaseAnonKey = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc0NTg5MTEwMCwiZXhwIjo0OTAxNTY0NzAwLCJyb2xlIjoiYW5vbiJ9.8UyiFY1t8tNCHd_Y13GwBSekVjUg95FoRX1_ytfYxjM';

/**
 * Supabase client instance for interacting with the Supabase backend
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
