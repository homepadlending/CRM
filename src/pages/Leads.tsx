import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Mail, 
  Phone,
  ChevronRight,
  ChevronLeft,
  Target,
  TrendingUp,
  UserPlus,
  Download,
  Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Lead } from '@/types';
import { cn, formatDate } from '@/lib/utils';
import { motion } from 'motion/react';

const mockLeads: Lead[] = [
  {
    id: '1',
    first_name: 'Alex',
    last_name: 'Thompson',
    email: 'alex.t@example.com',
    phone: '(555) 123-4567',
    status: 'New',
    source: 'Facebook Ads',
    created_at: '2024-03-25T10:00:00Z',
    score: 85
  },
  {
    id: '2',
    first_name: 'Maria',
    last_name: 'Garcia',
    email: 'm.garcia@example.com',
    phone: '(555) 987-6543',
    status: 'Contacted',
    source: 'Google Search',
    created_at: '2024-03-24T14:30:00Z',
    score: 92
  },
  {
    id: '3',
    first_name: 'James',
    last_name: 'Wilson',
    email: 'j.wilson@example.com',
    phone: '(555) 456-7890',
    status: 'Pre-Qualified',
    source: 'Referral',
    created_at: '2024-03-23T09:15:00Z',
    score: 78
  },
  {
    id: '4',
    first_name: 'Linda',
    last_name: 'Chen',
    email: 'l.chen@example.com',
    phone: '(555) 222-3333',
    status: 'New',
    source: 'Website',
    created_at: '2024-03-25T16:45:00Z',
    score: 64
  },
  {
    id: '5',
    first_name: 'Robert',
    last_name: 'Smith',
    email: 'r.smith@example.com',
    phone: '(555) 888-9999',
    status: 'Dead',
    source: 'Zillow',
    created_at: '2024-03-20T11:20:00Z',
    score: 35
  }
];

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLeads();
  }, []);

  async function fetchLeads() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (data && data.length > 0) {
        setLeads(data);
      } else {
        // Fallback to mock data for demo purposes if DB is empty or connection fails
        setLeads(mockLeads);
      }
    } catch (err) {
      setLeads(mockLeads);
    } finally {
      setLoading(false);
    }
  }

  const filteredLeads = leads.filter(lead => 
    `${lead.first_name} ${lead.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Leads</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Manage and track your incoming prospects.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 rounded-xl text-sm font-bold text-white hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
            <Plus className="w-4 h-4" />
            Add Lead
          </button>
        </div>
      </div>

      {/* Leads Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Leads', value: leads.length.toString(), icon: Target, color: 'text-indigo-600' },
          { label: 'New Today', value: '12', icon: UserPlus, color: 'text-blue-500' },
          { label: 'Conversion Rate', value: '24%', icon: TrendingUp, color: 'text-emerald-500' },
          { label: 'Avg. Lead Score', value: '72', icon: Star, color: 'text-amber-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
              <stat.icon className={cn("w-4 h-4", stat.color)} />
            </div>
            <h3 className="text-2xl font-black text-slate-900">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name, email, or source..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border-transparent rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all">
              <Filter className="w-4 h-4 text-slate-400" />
              Filters
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Lead Name</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Source</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Score</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Created</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                [1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-6 py-6">
                      <div className="h-4 bg-slate-100 rounded w-full" />
                    </td>
                  </tr>
                ))
              ) : filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                        <Target className="w-8 h-8 text-slate-200" />
                      </div>
                      <p className="text-slate-500 font-bold">No leads found matching your search</p>
                      <button className="text-indigo-600 text-sm font-black hover:underline" onClick={() => setSearchTerm('')}>Clear search</button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-5">
                      <Link to={`/leads/${lead.id}`} className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-bold text-sm">
                          {lead.first_name[0]}{lead.last_name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{lead.first_name} {lead.last_name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{lead.email}</p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-5">
                      <span className={cn(
                        "px-2.5 py-1 text-[10px] font-black uppercase rounded-lg tracking-wider",
                        lead.status === 'new' ? "bg-blue-50 text-blue-600" :
                        lead.status === 'contacted' ? "bg-amber-50 text-amber-600" :
                        lead.status === 'qualified' ? "bg-emerald-50 text-emerald-600" :
                        "bg-slate-50 text-slate-500"
                      )}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{lead.source || '-'}</p>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 w-12 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={cn(
                              "h-full rounded-full",
                              (lead.score || 0) >= 80 ? "bg-emerald-500" : (lead.score || 0) >= 60 ? "bg-indigo-500" : "bg-slate-300"
                            )} 
                            style={{ width: `${lead.score || 0}%` }} 
                          />
                        </div>
                        <span className="text-xs font-black text-slate-900">{lead.score || 0}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-xs font-medium text-slate-500">{formatDate(lead.created_at)}</p>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                          <Mail className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                          <Phone className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-6 border-t border-slate-100 flex items-center justify-between">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Showing <span className="text-slate-900">{filteredLeads.length}</span> of <span className="text-slate-900">{leads.length}</span> leads
          </p>
          <div className="flex items-center gap-2">
            <button className="p-2 border border-slate-200 rounded-xl text-slate-400 hover:bg-slate-50 disabled:opacity-50" disabled>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-2 border border-slate-200 rounded-xl text-slate-400 hover:bg-slate-50 disabled:opacity-50" disabled>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
