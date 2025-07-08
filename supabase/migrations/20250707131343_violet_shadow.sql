/*
  # Sistema de Usuarios

  1. Nueva Tabla
    - `users`
      - `id` (uuid, primary key) - Vinculado con auth.users
      - `email` (text, unique) - Email del usuario
      - `full_name` (text) - Nombre completo
      - `credits` (integer) - Créditos disponibles
      - `trial_used` (boolean) - Si ya usó la prueba gratuita
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Seguridad
    - Habilitar RLS en la tabla users
    - Políticas para que los usuarios solo vean sus propios datos
    - Función para crear usuario automáticamente al registrarse

  3. Triggers
    - Trigger para crear perfil de usuario automáticamente
    - Trigger para actualizar updated_at
*/

-- Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  credits integer NOT NULL DEFAULT 0,
  trial_used boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
CREATE POLICY "Users can view own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Función para crear perfil de usuario automáticamente
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO users (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$;

-- Trigger para crear perfil automáticamente
DROP TRIGGER IF EXISTS create_user_profile_trigger ON auth.users;
CREATE TRIGGER create_user_profile_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_profile();

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Trigger para actualizar updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Función para agregar créditos
CREATE OR REPLACE FUNCTION add_user_credits(user_id uuid, credit_amount integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE users 
  SET credits = credits + credit_amount,
      updated_at = now()
  WHERE id = user_id;
END;
$$;

-- Función para usar créditos
CREATE OR REPLACE FUNCTION use_user_credit(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_credits integer;
BEGIN
  SELECT credits INTO current_credits
  FROM users
  WHERE id = user_id;
  
  IF current_credits > 0 THEN
    UPDATE users 
    SET credits = credits - 1,
        updated_at = now()
    WHERE id = user_id;
    RETURN true;
  ELSE
    RETURN false;
  END IF;
END;
$$;

-- Función para marcar trial como usado
CREATE OR REPLACE FUNCTION mark_trial_used(user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE users 
  SET trial_used = true,
      updated_at = now()
  WHERE id = user_id;
END;
$$;