/*
  # Trial Quota System

  1. New Tables
    - `trial_quota`
      - `id` (uuid, primary key)
      - `daily_limit` (integer) - Maximum trials per day
      - `current_count` (integer) - Current count of trials for the day
      - `last_reset` (timestamp) - When the count was last reset
      - `updated_at` (timestamp)

    - `trial_usage`
      - `id` (uuid, primary key)
      - `ip_address` (text) - User's IP address
      - `used_at` (timestamp)
      - `created_at` (timestamp)

  2. Security Implementation
    - Enable RLS (Row Level Security) on both tables
    - Tables are only accessible by service_role, not regular users
    - Users can only access the check_trial_availability function
    - The function uses SECURITY DEFINER to run with elevated privileges
    - All user access is controlled through Node.js Functions for additional security
*/

-- Create trial_quota table
CREATE TABLE IF NOT EXISTS trial_quota (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  daily_limit integer NOT NULL DEFAULT 100,
  current_count integer NOT NULL DEFAULT 0,
  last_reset timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create trial_usage table
CREATE TABLE IF NOT EXISTS trial_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address text NOT NULL,
  used_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS (Row Level Security)
ALTER TABLE trial_quota ENABLE ROW LEVEL SECURITY;
ALTER TABLE trial_usage ENABLE ROW LEVEL SECURITY;

-- Create policies for service role
-- ONLY the service_role can access these tables directly
CREATE POLICY "Service role can manage trial quota"
  ON trial_quota
  FOR ALL
  TO service_role
  USING (true);

CREATE POLICY "Service role can manage trial usage"
  ON trial_usage
  FOR ALL
  TO service_role
  USING (true);

-- Create function to check trial availability
-- SECURITY DEFINER means this function runs with the privileges of its creator (usually a superuser)
-- This allows the function to access tables that the calling user cannot access directly
CREATE OR REPLACE FUNCTION check_trial_availability(user_ip text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  quota_record trial_quota%ROWTYPE;
  has_used boolean;
BEGIN
  -- Check if IP has already used trial
  SELECT EXISTS (
    SELECT 1 FROM trial_usage WHERE ip_address = user_ip
  ) INTO has_used;
  
  IF has_used THEN
    RETURN false;
  END IF;
  
  -- Get or create quota record
  SELECT * INTO quota_record FROM trial_quota LIMIT 1;
  IF NOT FOUND THEN
    INSERT INTO trial_quota DEFAULT VALUES RETURNING * INTO quota_record;
  END IF;
  
  -- Reset count if last_reset is from previous day
  IF quota_record.last_reset::date < CURRENT_DATE THEN
    UPDATE trial_quota 
    SET current_count = 0, 
        last_reset = now() 
    WHERE id = quota_record.id
    RETURNING * INTO quota_record;
  END IF;
  
  -- Check if under daily limit
  IF quota_record.current_count >= quota_record.daily_limit THEN
    RETURN false;
  END IF;
  
  -- Increment count and record usage
  UPDATE trial_quota 
  SET current_count = current_count + 1 
  WHERE id = quota_record.id;
  
  INSERT INTO trial_usage (ip_address) VALUES (user_ip);
  
  RETURN true;
END;
$$;