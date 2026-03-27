import { supabase } from './supabase';
import { 
  Lead, 
  Agent, 
  Loan, 
  Application, 
  ClosedClient, 
  Task, 
  Document, 
  Campaign,
  Activity,
  Profile,
  Company
} from '@/types';

// --- Profiles ---
export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return data as Profile;
};

// --- Leads ---
export const getLeads = async () => {
  const { data, error } = await supabase
    .from('leads')
    .select('*, referral_agent:agents(first_name, last_name), source_campaign:campaigns(name)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as Lead[];
};

export const createLead = async (lead: Partial<Lead>) => {
  const { data, error } = await supabase
    .from('leads')
    .insert(lead)
    .select()
    .single();
  if (error) throw error;
  return data as Lead;
};

export const updateLead = async (id: string, updates: Partial<Lead>) => {
  const { data, error } = await supabase
    .from('leads')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as Lead;
};

export const deleteLead = async (id: string) => {
  const { error } = await supabase
    .from('leads')
    .delete()
    .eq('id', id);
  if (error) throw error;
};

// --- Agents ---
export const getAgents = async () => {
  const { data, error } = await supabase
    .from('agents')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as Agent[];
};

export const createAgent = async (agent: Partial<Agent>) => {
  const { data, error } = await supabase
    .from('agents')
    .insert(agent)
    .select()
    .single();
  if (error) throw error;
  return data as Agent;
};

// --- Loans ---
export const getLoans = async () => {
  const { data, error } = await supabase
    .from('loans')
    .select('*, stage:loan_stages(name), referral_agent:agents(first_name, last_name)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as Loan[];
};

export const createLoan = async (loan: Partial<Loan>) => {
  const { data, error } = await supabase
    .from('loans')
    .insert(loan)
    .select()
    .single();
  if (error) throw error;
  return data as Loan;
};

// --- Tasks ---
export const getTasks = async () => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('due_date', { ascending: true });
  if (error) throw error;
  return data as Task[];
};

export const createTask = async (task: Partial<Task>) => {
  const { data, error } = await supabase
    .from('tasks')
    .insert(task)
    .select()
    .single();
  if (error) throw error;
  return data as Task;
};

export const updateTask = async (id: string, updates: Partial<Task>) => {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as Task;
};

// --- Activities ---
export const getActivities = async (limit = 10) => {
  const { data, error } = await supabase
    .from('activities')
    .select('*, owner:profiles(full_name)')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data as Activity[];
};

export const createActivity = async (activity: Partial<Activity>) => {
  const { data, error } = await supabase
    .from('activities')
    .insert(activity)
    .select()
    .single();
  if (error) throw error;
  return data as Activity;
};

// --- Applications ---
export const getApplications = async () => {
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as Application[];
};

export const createApplication = async (application: Partial<Application>) => {
  const { data, error } = await supabase
    .from('applications')
    .insert(application)
    .select()
    .single();
  if (error) throw error;
  return data as Application;
};

// --- Closed Clients ---
export const getClosedClients = async () => {
  const { data, error } = await supabase
    .from('closed_clients')
    .select('*')
    .order('closed_at', { ascending: false });
  if (error) throw error;
  return data as ClosedClient[];
};

// --- Campaigns ---
export const getCampaigns = async () => {
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as Campaign[];
};

// --- Profiles ---
export const updateProfile = async (userId: string, profile: Partial<Profile>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(profile)
    .eq('id', userId)
    .select()
    .single();
  if (error) throw error;
  return data as Profile;
};

export const createCampaign = async (campaign: Partial<Campaign>) => {
  const { data, error } = await supabase
    .from('campaigns')
    .insert(campaign)
    .select()
    .single();
  if (error) throw error;
  return data as Campaign;
};

export const deleteCampaign = async (id: string) => {
  const { error } = await supabase
    .from('campaigns')
    .delete()
    .eq('id', id);
  if (error) throw error;
};

// --- Documents ---
export const getDocuments = async () => {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as Document[];
};

export const createDocument = async (document: Partial<Document>) => {
  const { data, error } = await supabase
    .from('documents')
    .insert(document)
    .select()
    .single();
  if (error) throw error;
  return data as Document;
};

export const deleteDocument = async (id: string) => {
  const { error } = await supabase
    .from('documents')
    .delete()
    .eq('id', id);
  if (error) throw error;
};

// --- Companies ---
export const getCompanies = async () => {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .order('name', { ascending: true });
  if (error) throw error;
  return data as Company[];
};

export const createCompany = async (company: Partial<Company>) => {
  const { data, error } = await supabase
    .from('companies')
    .insert(company)
    .select()
    .single();
  if (error) throw error;
  return data as Company;
};

export const updateCompany = async (id: string, company: Partial<Company>) => {
  const { data, error } = await supabase
    .from('companies')
    .update(company)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as Company;
};

export const deleteCompany = async (id: string) => {
  const { error } = await supabase
    .from('companies')
    .delete()
    .eq('id', id);
  if (error) throw error;
};

// --- Dashboard Stats ---
export const getDashboardStats = async () => {
  const [
    { data: leads },
    { data: loans },
    { data: tasks },
    { data: agents },
    { data: fundedLoans }
  ] = await Promise.all([
    supabase.from('leads').select('source'),
    supabase.from('loans').select('status, loan_amount'),
    supabase.from('tasks').select('id').eq('status', 'Pending'),
    supabase.from('agents').select('id, first_name, last_name, total_volume').order('total_volume', { ascending: false }).limit(5),
    supabase.from('loans').select('id, client_name, loan_amount, closed_at').eq('status', 'Closed').order('closed_at', { ascending: false }).limit(5)
  ]);

  // Aggregate lead sources
  const leadSourceMap: Record<string, number> = {};
  leads?.forEach((l: any) => {
    const source = l.source || 'Unknown';
    leadSourceMap[source] = (leadSourceMap[source] || 0) + 1;
  });
  const leadSourceData = Object.entries(leadSourceMap).map(([name, value]) => ({ name, value }));

  // Aggregate loan stages
  const loanStageMap: Record<string, number> = {};
  let totalVolume = 0;
  loans?.forEach((l: any) => {
    const stage = l.status || 'Unknown';
    loanStageMap[stage] = (loanStageMap[stage] || 0) + 1;
    if (l.status !== 'Closed' && l.status !== 'Cancelled') {
      totalVolume += l.loan_amount || 0;
    }
  });
  const loanStageData = Object.entries(loanStageMap).map(([name, value]) => ({ name, value }));

  return {
    leadsCount: leads?.length || 0,
    activeLoansCount: loans?.filter((l: any) => l.status !== 'Closed' && l.status !== 'Cancelled').length || 0,
    pendingTasksCount: tasks?.length || 0,
    recentContactsCount: agents?.length || 0,
    totalVolume,
    leadSourceData,
    loanStageData,
    topAgents: agents || [],
    recentlyFunded: fundedLoans || []
  };
};
