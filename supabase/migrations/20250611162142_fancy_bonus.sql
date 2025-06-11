/*
  # Complete System Setup Migration

  1. Missing Tables and Columns
    - Fix mesas table structure
    - Add missing audit logs table
    - Fix user roles enum
    - Add missing indexes and constraints

  2. Security
    - Update RLS policies
    - Fix authentication flows
    - Ensure proper data isolation

  3. Functions and Triggers
    - Add helper functions
    - Update triggers for real-time updates
*/

-- First, let's ensure we have the correct user role enum
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'kitchen', 'waiter', 'cashier', 'stock');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Fix mesas table - add restaurante_id if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'mesas' AND column_name = 'restaurante_id'
  ) THEN
    ALTER TABLE mesas ADD COLUMN restaurante_id uuid REFERENCES restaurantes(id);
    
    -- Update existing records with a default restaurante_id
    UPDATE mesas 
    SET restaurante_id = (SELECT id FROM restaurantes LIMIT 1)
    WHERE restaurante_id IS NULL;
    
    ALTER TABLE mesas ALTER COLUMN restaurante_id SET NOT NULL;
  END IF;
END $$;

-- Ensure audit_logs table exists
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  action_type text NOT NULL,
  entity_type text NOT NULL,
  entity_id text,
  details jsonb,
  ip_address inet,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on audit_logs if not already enabled
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Create or replace audit logs policies
DROP POLICY IF EXISTS "Users can view own audit logs" ON audit_logs;
DROP POLICY IF EXISTS "Users can create audit logs" ON audit_logs;

CREATE POLICY "Users can view own audit logs"
  ON audit_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create audit logs"
  ON audit_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Fix user_roles table structure
ALTER TABLE user_roles ALTER COLUMN role TYPE text;
DROP TYPE IF EXISTS user_role CASCADE;
CREATE TYPE user_role AS ENUM ('admin', 'kitchen', 'waiter', 'cashier', 'stock');
ALTER TABLE user_roles ALTER COLUMN role TYPE user_role USING role::user_role;

-- Add missing company_profiles columns
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'company_profiles' AND column_name = 'address'
  ) THEN
    ALTER TABLE company_profiles ADD COLUMN address jsonb;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'company_profiles' AND column_name = 'contact'
  ) THEN
    ALTER TABLE company_profiles ADD COLUMN contact jsonb;
  END IF;
END $$;

-- Create function to automatically create restaurant for new users
CREATE OR REPLACE FUNCTION create_default_restaurant()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create restaurant for admin users
  IF EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = NEW.id AND role = 'admin'
  ) THEN
    INSERT INTO restaurantes (user_id, nome, telefone)
    VALUES (
      NEW.id, 
      COALESCE(NEW.raw_user_meta_data->>'name', 'Meu Restaurante'),
      '(00) 00000-0000'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic restaurant creation
DROP TRIGGER IF EXISTS create_restaurant_for_new_user ON auth.users;
CREATE TRIGGER create_restaurant_for_new_user
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_default_restaurant();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers to all tables that need them
DO $$
DECLARE
  table_name text;
  tables_with_updated_at text[] := ARRAY[
    'restaurantes', 'mesas', 'produtos', 'comandas', 'itens_comanda',
    'caixas', 'profiles', 'user_roles', 'company_profiles', 'employees',
    'insumos', 'cardapio_online'
  ];
BEGIN
  FOREACH table_name IN ARRAY tables_with_updated_at
  LOOP
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = table_name AND column_name = 'updated_at'
    ) THEN
      EXECUTE format('DROP TRIGGER IF EXISTS update_%s_updated_at ON %s', table_name, table_name);
      EXECUTE format('CREATE TRIGGER update_%s_updated_at
        BEFORE UPDATE ON %s
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()', table_name, table_name);
    END IF;
  END LOOP;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS mesas_status_idx ON mesas (status);
CREATE INDEX IF NOT EXISTS comandas_status_idx ON comandas (status);
CREATE INDEX IF NOT EXISTS itens_comanda_status_idx ON itens_comanda (status);
CREATE INDEX IF NOT EXISTS produtos_categoria_idx ON produtos (categoria);
CREATE INDEX IF NOT EXISTS produtos_disponivel_idx ON produtos (disponivel);
CREATE INDEX IF NOT EXISTS caixas_status_idx ON caixas (status);
CREATE INDEX IF NOT EXISTS vendas_created_at_idx ON vendas (created_at);
CREATE INDEX IF NOT EXISTS audit_logs_created_at_idx ON audit_logs (created_at);

-- Function to calculate comanda total
CREATE OR REPLACE FUNCTION calculate_comanda_total(comanda_uuid uuid)
RETURNS decimal AS $$
DECLARE
  total decimal := 0;
BEGIN
  SELECT COALESCE(SUM(quantidade * preco_unitario), 0)
  INTO total
  FROM itens_comanda
  WHERE comanda_id = comanda_uuid;
  
  RETURN total;
END;
$$ LANGUAGE plpgsql;

-- Function to update mesa total
CREATE OR REPLACE FUNCTION update_mesa_total_from_comandas(mesa_uuid uuid)
RETURNS void AS $$
DECLARE
  total decimal := 0;
BEGIN
  SELECT COALESCE(SUM(valor_total), 0)
  INTO total
  FROM comandas
  WHERE mesa_id = mesa_uuid AND status = 'aberta';
  
  UPDATE mesas
  SET valor_total = total,
      updated_at = now()
  WHERE id = mesa_uuid;
END;
$$ LANGUAGE plpgsql;

-- Improved trigger function for comanda totals
CREATE OR REPLACE FUNCTION update_comanda_total()
RETURNS TRIGGER AS $$
DECLARE
  comanda_uuid uuid;
  mesa_uuid uuid;
  new_total decimal;
BEGIN
  comanda_uuid := COALESCE(NEW.comanda_id, OLD.comanda_id);
  
  -- Calculate new total
  new_total := calculate_comanda_total(comanda_uuid);
  
  -- Update comanda
  UPDATE comandas
  SET valor_total = new_total,
      updated_at = now()
  WHERE id = comanda_uuid;
  
  -- Get mesa_id and update mesa total
  SELECT mesa_id INTO mesa_uuid
  FROM comandas
  WHERE id = comanda_uuid;
  
  IF mesa_uuid IS NOT NULL THEN
    PERFORM update_mesa_total_from_comandas(mesa_uuid);
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Recreate triggers
DROP TRIGGER IF EXISTS update_comanda_total_trigger ON itens_comanda;
CREATE TRIGGER update_comanda_total_trigger
  AFTER INSERT OR UPDATE OR DELETE ON itens_comanda
  FOR EACH ROW EXECUTE FUNCTION update_comanda_total();

-- Function to handle user signup
CREATE OR REPLACE FUNCTION handle_new_user_signup()
RETURNS TRIGGER AS $$
BEGIN
  -- Create profile
  INSERT INTO profiles (id, name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'name')
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    updated_at = now();
  
  -- Create user role (default to admin for new signups)
  INSERT INTO user_roles (user_id, role)
  VALUES (NEW.id, 'admin')
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the user creation trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user_signup();

-- Ensure all tables have proper RLS policies
-- Restaurantes policies
DROP POLICY IF EXISTS "Users can create own restaurant" ON restaurantes;
CREATE POLICY "Users can create own restaurant"
  ON restaurantes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Mesas policies
DROP POLICY IF EXISTS "Users can manage restaurant tables" ON mesas;
CREATE POLICY "Users can manage restaurant tables"
  ON mesas FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM restaurantes
      WHERE restaurantes.id = mesas.restaurante_id
      AND restaurantes.user_id = auth.uid()
    )
  );

-- Add constraint to ensure unique table numbers per restaurant
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'mesas_restaurante_numero_unique'
  ) THEN
    ALTER TABLE mesas ADD CONSTRAINT mesas_restaurante_numero_unique 
    UNIQUE (restaurante_id, numero);
  END IF;
END $$;

-- Create a view for dashboard statistics
CREATE OR REPLACE VIEW dashboard_stats AS
SELECT 
  r.id as restaurante_id,
  r.user_id,
  COUNT(DISTINCT m.id) as total_mesas,
  COUNT(DISTINCT CASE WHEN m.status = 'ocupada' THEN m.id END) as mesas_ocupadas,
  COUNT(DISTINCT CASE WHEN m.status = 'livre' THEN m.id END) as mesas_livres,
  COUNT(DISTINCT p.id) as total_produtos,
  COUNT(DISTINCT CASE WHEN c.status = 'aberta' THEN c.id END) as comandas_abertas,
  COALESCE(SUM(CASE WHEN v.created_at::date = CURRENT_DATE THEN v.valor_total END), 0) as vendas_hoje,
  COALESCE(SUM(CASE WHEN v.created_at >= date_trunc('month', CURRENT_DATE) THEN v.valor_total END), 0) as vendas_mes
FROM restaurantes r
LEFT JOIN mesas m ON m.restaurante_id = r.id
LEFT JOIN produtos p ON p.restaurante_id = r.id
LEFT JOIN comandas c ON c.mesa_id = m.id
LEFT JOIN vendas v ON v.restaurante_id = r.id
GROUP BY r.id, r.user_id;

-- Grant access to the view
GRANT SELECT ON dashboard_stats TO authenticated;

-- Create RLS policy for the view
CREATE POLICY "Users can view own restaurant stats"
  ON dashboard_stats FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to create audit log
CREATE OR REPLACE FUNCTION create_audit_log(
  p_action_type text,
  p_entity_type text,
  p_entity_id text DEFAULT NULL,
  p_details jsonb DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  INSERT INTO audit_logs (
    user_id,
    action_type,
    entity_type,
    entity_id,
    details,
    ip_address
  ) VALUES (
    auth.uid(),
    p_action_type,
    p_entity_type,
    p_entity_id,
    p_details,
    inet_client_addr()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;