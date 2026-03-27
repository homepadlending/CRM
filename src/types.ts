export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: 'admin' | 'manager' | 'user';
  created_at: string;
};

export type Campaign = {
  id: string;
  name: string;
  type?: string | null;
  status?: string; // For compatibility with UI
  leads_count?: number; // For compatibility with UI
  conversion_rate?: number; // For compatibility with UI
  source?: string | null;
  spend?: number;
  leads_generated?: number;
  closings_generated?: number;
  revenue_generated?: number;
  start_date?: string | null;
  end_date?: string | null;
  notes?: string | null;
  owner_id?: string | null;
  created_at?: string;
};

export type Agent = {
  id: string;
  first_name: string;
  last_name: string;
  company_id?: string | null;
  brokerage?: string | null;
  company?: string | null; // For compatibility with UI
  phone?: string | null;
  email?: string | null;
  city?: string | null;
  state?: string | null;
  production_tier?: 'A' | 'B' | 'C' | null;
  relationship_status?: 'active' | 'inactive' | 'prospect' | null;
  status?: string; // For compatibility with UI
  total_closed_loans_referred?: number;
  total_loans?: number; // For compatibility with UI
  total_volume?: number; // For compatibility with UI
  last_referral_date?: string | null;
  last_contact_date?: string | null;
  next_follow_up_date?: string | null;
  notes?: string | null;
  owner_id?: string | null;
  created_at?: string;
};

export type Lead = {
  id: string;
  first_name: string;
  last_name: string;
  email?: string | null;
  phone?: string | null;
  source?: string | null;
  referral_agent_id?: string | null;
  assigned_lo_id?: string | null;
  target_city?: string | null;
  target_state?: string | null;
  purchase_timeline?: string | null;
  target_purchase_price?: number | null;
  estimated_down_payment?: number | null;
  estimated_credit_score_range?: string | null;
  income_type?: string | null;
  status?: string; // Made more flexible for UI
  source_campaign_id?: string | null;
  last_contact_date?: string | null;
  next_follow_up_date?: string | null;
  notes?: string | null;
  score?: number;
  owner_id?: string | null;
  created_at?: string;
  referral_agent?: Agent;
  campaign?: Campaign;
};

export type Application = {
  id: string;
  borrower_name: string;
  email?: string | null;
  phone?: string | null;
  loan_purpose?: 'Purchase' | 'Refinance' | 'Cash-out Refi';
  property_type?: 'Single Family' | 'Condo' | 'Multi-Family' | 'Townhouse';
  estimated_value?: number;
  loan_amount: number;
  loan_type?: string; // For compatibility with UI
  credit_score_range?: string;
  credit_score?: number; // For compatibility with UI
  status: string; // Made more flexible for UI
  created_at?: string;
  owner_id?: string | null;
};

export type LoanStage = {
  id: string;
  name: string;
  display_order: number;
};

export type Loan = {
  id: string;
  borrower_name: string;
  coborrower_name?: string | null;
  loan_type?: string | null;
  purpose?: string | null;
  property_address?: string | null;
  loan_amount: number;
  purchase_price?: number | null;
  estimated_value?: number | null;
  down_payment?: number | null;
  ltv?: number | null;
  interest_rate?: number | null;
  loan_term?: number | null;
  stage_id?: string | null;
  status?: string; // For compatibility with UI
  closing_date?: string; // For compatibility with UI
  assigned_lo_id?: string | null;
  processor_id?: string | null;
  referral_agent_id?: string | null;
  source_campaign_id?: string | null;
  milestone_dates?: Record<string, string> | null;
  notes?: string | null;
  owner_id?: string | null;
  created_at?: string;
  stage?: LoanStage;
  referral_agent?: Agent;
  campaign?: Campaign;
};

export type ClosedClient = {
  id: string;
  client_name: string;
  phone?: string | null;
  email?: string | null;
  property_address?: string | null;
  close_date?: string;
  closed_at?: string; // For compatibility with UI
  original_loan_amount?: number | null;
  loan_amount?: number | null; // For compatibility with UI
  current_estimated_home_value?: number | null;
  estimated_equity?: number | null;
  current_estimated_ltv?: number | null;
  interest_rate?: number | null;
  loan_term?: number | null;
  loan_type?: string | null;
  occupancy_type?: string | null;
  referral_agent_id?: string | null;
  agent_name?: string | null; // For compatibility with UI
  source_campaign_id?: string | null;
  assigned_lo_id?: string | null;
  anniversary_date?: string | null;
  notes?: string | null;
  owner_id?: string | null;
  created_at?: string;
  referral_agent?: Agent;
  campaign?: Campaign;
};

export type Task = {
  id: string;
  title: string;
  description?: string | null;
  type?: 'call' | 'text' | 'email' | 'follow-up' | 'agent check-in' | 'anniversary' | null;
  due_date?: string | null;
  priority?: string; // Made more flexible for UI
  status?: string; // Made more flexible for UI
  owner_id?: string | null;
  related_type?: 'lead' | 'loan' | 'closed_client' | 'agent' | null;
  related_id?: string | null;
  created_at?: string;
};

export type Activity = {
  id: string;
  type: 'note' | 'call' | 'email' | 'meeting';
  content: string;
  owner_id: string;
  related_type: string | null;
  related_id: string | null;
  created_at: string;
  owner?: Profile;
};

export type Document = {
  id: string;
  name: string;
  file_url?: string;
  category?: string | null; // Made more flexible for UI
  type?: string; // For compatibility with UI
  related_type?: string | null;
  related_id?: string | null;
  owner_id?: string | null;
  created_at?: string;
  size?: string; // For compatibility with UI
};

// Legacy types for compatibility
export type Company = {
  id: string;
  name: string;
  type?: string | null;
  website?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  notes?: string | null;
  owner_id?: string | null;
  created_at: string;
  updated_at?: string;
};

export type Contact = {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  job_title: string | null;
  company_id: string | null;
  owner_id: string | null;
  created_at: string;
  company?: Company;
};

export type Opportunity = {
  id: string;
  name: string;
  value: number;
  stage_id: string | null;
  company_id: string | null;
  contact_id: string | null;
  status?: string;
  expected_close_date: string | null;
  probability: number | null;
  owner_id: string | null;
  created_at: string;
  stage?: PipelineStage;
  company?: Company;
  contact?: Contact;
};

export type PipelineStage = {
  id: string;
  name: string;
  display_order: number;
};
