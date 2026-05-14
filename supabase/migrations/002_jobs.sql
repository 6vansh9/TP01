CREATE TABLE jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  skills text[] DEFAULT '{}',
  category text,
  job_type text CHECK (job_type IN ('hourly','fixed')) DEFAULT 'hourly',
  budget_min numeric,
  budget_max numeric,
  duration text,
  level text CHECK (level IN ('entry','intermediate','expert')) DEFAULT 'intermediate',
  status text CHECK (status IN ('draft','open','closed')) DEFAULT 'open',
  proposals_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read open jobs" ON jobs FOR SELECT USING (status = 'open');
CREATE POLICY "Clients can manage own jobs" ON jobs FOR ALL USING (auth.uid() = client_id);
