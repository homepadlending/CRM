# MVP Mortgage CRM Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles & Roles
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'manager', 'user')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Campaigns (Marketing Attribution)
CREATE TABLE campaigns (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT, -- 'social', 'email', 'ads', 'referral', etc.
  source TEXT,
  spend DECIMAL(12,2) DEFAULT 0,
  leads_generated INTEGER DEFAULT 0,
  closings_generated INTEGER DEFAULT 0,
  revenue_generated DECIMAL(12,2) DEFAULT 0,
  start_date DATE,
  end_date DATE,
  notes TEXT,
  owner_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Companies (Referral Partner Firms / Brokerages)
CREATE TABLE companies (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT, -- 'Real Estate', 'Insurance', 'Financial Planning', etc.
  website TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  notes TEXT,
  owner_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Agents (Referral Partners / Real Estate Agents)
CREATE TABLE agents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  brokerage TEXT, -- Legacy field, can be used for quick entry
  phone TEXT,
  email TEXT,
  city TEXT,
  state TEXT,
  production_tier TEXT, -- 'A', 'B', 'C'
  relationship_status TEXT, -- 'active', 'inactive', 'prospect'
  total_closed_loans_referred INTEGER DEFAULT 0,
  last_referral_date DATE,
  last_contact_date DATE,
  next_follow_up_date DATE,
  notes TEXT,
  owner_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Leads
CREATE TABLE leads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  source TEXT,
  referral_agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
  assigned_lo_id UUID REFERENCES profiles(id),
  target_city TEXT,
  target_state TEXT,
  purchase_timeline TEXT,
  target_purchase_price DECIMAL(12,2),
  estimated_down_payment DECIMAL(12,2),
  estimated_credit_score_range TEXT,
  income_type TEXT,
  status TEXT DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Pre-Qualified', 'Pre-Approved', 'Nurture', 'Dead')),
  source_campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
  last_contact_date TIMESTAMPTZ,
  next_follow_up_date TIMESTAMPTZ,
  notes TEXT,
  owner_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Loan Pipeline Stages
CREATE TABLE loan_stages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  display_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Active Loans
CREATE TABLE loans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  borrower_name TEXT NOT NULL,
  coborrower_name TEXT,
  loan_type TEXT, -- 'Conventional', 'FHA', 'VA', 'USDA', 'Jumbo'
  purpose TEXT, -- 'Purchase', 'Refinance', 'Cash-out'
  property_address TEXT,
  loan_amount DECIMAL(12,2) NOT NULL,
  purchase_price DECIMAL(12,2),
  estimated_value DECIMAL(12,2),
  down_payment DECIMAL(12,2),
  ltv DECIMAL(5,2),
  interest_rate DECIMAL(5,3),
  loan_term INTEGER, -- in months
  stage_id UUID REFERENCES loan_stages(id),
  assigned_lo_id UUID REFERENCES profiles(id),
  processor_id UUID REFERENCES profiles(id),
  referral_agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
  source_campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
  milestone_dates JSONB, -- { "application": "...", "processing": "...", etc. }
  notes TEXT,
  owner_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Closed Clients (Remarketing Database)
CREATE TABLE closed_clients (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  client_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  property_address TEXT,
  close_date DATE NOT NULL,
  original_loan_amount DECIMAL(12,2),
  current_estimated_home_value DECIMAL(12,2),
  estimated_equity DECIMAL(12,2),
  current_estimated_ltv DECIMAL(5,2),
  interest_rate DECIMAL(5,3),
  loan_term INTEGER,
  loan_type TEXT,
  occupancy_type TEXT, -- 'Primary', 'Secondary', 'Investment'
  referral_agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
  source_campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
  assigned_lo_id UUID REFERENCES profiles(id),
  anniversary_date DATE,
  notes TEXT,
  owner_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Tasks
CREATE TABLE tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT, -- 'call', 'text', 'email', 'follow-up', 'agent check-in', 'anniversary'
  due_date TIMESTAMPTZ,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'completed')),
  owner_id UUID REFERENCES profiles(id),
  related_type TEXT, -- 'lead', 'loan', 'closed_client', 'agent'
  related_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Activities
CREATE TABLE activities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  type TEXT NOT NULL, -- 'note', 'call', 'email', 'meeting'
  content TEXT NOT NULL,
  owner_id UUID REFERENCES profiles(id),
  related_type TEXT,
  related_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Documents
CREATE TABLE documents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  category TEXT, -- 'borrower', 'loan', 'agent', 'marketing'
  related_type TEXT,
  related_id UUID,
  owner_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Tags
CREATE TABLE tags (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  color TEXT
);

CREATE TABLE record_tags (
  record_id UUID NOT NULL,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (record_id, tag_id)
);

-- RLS POLICIES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);

ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for authenticated" ON campaigns FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for authenticated" ON agents FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for authenticated" ON companies FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for authenticated" ON leads FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE loan_stages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for authenticated" ON loan_stages FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE loans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for authenticated" ON loans FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE closed_clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for authenticated" ON closed_clients FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for authenticated" ON tasks FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for authenticated" ON activities FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for authenticated" ON documents FOR ALL USING (auth.role() = 'authenticated');

-- SEED DATA
INSERT INTO loan_stages (name, display_order) VALUES
('Application', 1),
('Disclosures Out', 2),
('Processing', 3),
('Underwriting', 4),
('Conditional Approval', 5),
('Clear to Close', 6),
('Funded', 7);
