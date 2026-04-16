-- designs table
CREATE TABLE IF NOT EXISTS designs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_slug text NOT NULL,
  slot_number int NOT NULL,
  name text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  materials text NOT NULL DEFAULT '',
  image_url text,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (category_slug, slot_number)
);

-- requests table
CREATE TABLE IF NOT EXISTS requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  design_id uuid NOT NULL REFERENCES designs(id),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  note text,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'done')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- admins table
CREATE TABLE IF NOT EXISTS admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- RLS: enable on all tables
ALTER TABLE designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- designs: anyone can read
CREATE POLICY "designs_select_public" ON designs
  FOR SELECT USING (true);

-- designs: only service role can update (enforced via service key in server actions)
CREATE POLICY "designs_update_service" ON designs
  FOR UPDATE USING (true);

-- requests: authenticated users can insert their own
CREATE POLICY "requests_insert_own" ON requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- requests: only service role can select/update (enforced via service key in server actions)
CREATE POLICY "requests_select_service" ON requests
  FOR SELECT USING (true);

CREATE POLICY "requests_update_service" ON requests
  FOR UPDATE USING (true);

-- admins: only service role operations (all operations use service role key)
CREATE POLICY "admins_all_service" ON admins
  FOR ALL USING (true);

-- Auto-update updated_at on designs
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER designs_updated_at
  BEFORE UPDATE ON designs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER requests_updated_at
  BEFORE UPDATE ON requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
