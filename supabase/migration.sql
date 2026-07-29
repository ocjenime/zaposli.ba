-- Profiles (extends Supabase Auth)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  role TEXT NOT NULL CHECK (role IN ('client', 'firm')),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own" ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Firms
CREATE TABLE firms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  email TEXT,
  phone TEXT,
  city TEXT,
  logo_url TEXT,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE firms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "firms_select_public" ON firms FOR SELECT USING (true);
CREATE POLICY "firms_insert_own" ON firms FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "firms_update_own" ON firms FOR UPDATE USING (auth.uid() = owner_id);

-- Firm categories (many-to-many)
CREATE TABLE firm_categories (
  firm_id UUID REFERENCES firms(id) ON DELETE CASCADE,
  category_slug TEXT NOT NULL,
  PRIMARY KEY (firm_id, category_slug)
);

ALTER TABLE firm_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "fc_select_public" ON firm_categories FOR SELECT USING (true);
CREATE POLICY "fc_insert_own" ON firm_categories FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM firms WHERE id = firm_id AND owner_id = auth.uid())
);

-- Jobs
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category_slug TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  city TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'bidding', 'in_progress', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "jobs_select_public" ON jobs FOR SELECT USING (true);
CREATE POLICY "jobs_insert_own" ON jobs FOR INSERT WITH CHECK (auth.uid() = client_id);
CREATE POLICY "jobs_update_own" ON jobs FOR UPDATE USING (auth.uid() = client_id);

-- Bids
CREATE TABLE bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  firm_id UUID NOT NULL REFERENCES firms(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE bids ENABLE ROW LEVEL SECURITY;

CREATE POLICY "bids_select_job_owner" ON bids FOR SELECT USING (
  auth.uid() IN (
    SELECT client_id FROM jobs WHERE id = job_id
    UNION
    SELECT owner_id FROM firms WHERE id = firm_id
  )
);
CREATE POLICY "bids_insert_own" ON bids FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM firms WHERE id = firm_id AND owner_id = auth.uid())
);
CREATE POLICY "bids_update_job_owner" ON bids FOR UPDATE USING (
  auth.uid() IN (SELECT client_id FROM jobs WHERE id = job_id)
);

-- Messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "messages_select_participant" ON messages FOR SELECT USING (
  auth.uid() IN (SELECT client_id FROM jobs WHERE id = job_id)
  OR auth.uid() IN (SELECT owner_id FROM firms WHERE id IN (
    SELECT firm_id FROM bids WHERE job_id = messages.job_id
  ))
);
CREATE POLICY "messages_insert_participant" ON messages FOR INSERT WITH CHECK (
  auth.uid() IN (SELECT client_id FROM jobs WHERE id = job_id)
  OR auth.uid() IN (SELECT owner_id FROM firms WHERE id IN (
    SELECT firm_id FROM bids WHERE job_id = job_id
  ))
);

-- Reviews
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID UNIQUE NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  firm_id UUID NOT NULL REFERENCES firms(id) ON DELETE CASCADE,
  rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reviews_select_public" ON reviews FOR SELECT USING (true);
CREATE POLICY "reviews_insert_own" ON reviews FOR INSERT WITH CHECK (
  auth.uid() = client_id
  AND EXISTS (SELECT 1 FROM jobs WHERE id = job_id AND client_id = auth.uid() AND status = 'completed')
);
