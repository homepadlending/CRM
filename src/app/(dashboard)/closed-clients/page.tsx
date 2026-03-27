"use client";

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
  CheckCircle,
  TrendingUp,
  Award,
  Download,
  Star,
  DollarSign,
  Calendar
} from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { ClosedClient } from '@/types';
import { cn, formatDate } from '@/lib/utils';
import { getClosedClients } from '@/lib/services';

export default function ClosedClients() {
  const [clients, setClients] = useState<ClosedClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchClients();
  }, []);

  async function fetchClients() {
    setLoading(true);
    try {
      const data = await getClosedClients();
      setClients(data);
    } catch (err) {
      console.error('Error fetching closed clients:', err);
    } finally {
      setLoading(false);
    }
  }

  const filteredClients = clients.filter(client => 
    client.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.agent_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Closed Clients</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Review your successfully closed transactions.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Closed Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Closed', value: clients.length.toString(), icon: CheckCircle, color: 'text-emerald-600' },
          { label: 'Total Volume', value: `$${(clients.reduce((acc, c) => acc + (c.loan_amount || 0), 0) / 1000000).toFixed(2)}M`, icon: DollarSign, color: 'text-indigo-600' },
          { label: 'Avg. Rate', value: clients.length > 0 ? `${(clients.reduce((acc, c) => acc + (c.interest_rate || 0), 0) / clients.length).toFixed(3)}%` : '0%', icon: TrendingUp, color: 'text-blue-500' },
          { label: 'Top Agent', value: 'Sarah J.', icon: Award, color: 'text-amber-500' },
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
              placeholder="Search by client or agent..."
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
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Client Name</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Loan Amount</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Agent</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Interest Rate</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Closed Date</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                [1, 2, 3].map((i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-6 py-6">
                      <div className="h-4 bg-slate-100 rounded w-full" />
                    </td>
                  </tr>
                ))
              ) : filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <p className="text-slate-500 font-bold">No closed clients found matching your search</p>
                  </td>
                </tr>
              ) : (
                filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-5">
                      <Link href={`/closed-clients/${client.id}`} className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 font-bold text-sm">
                          {client.client_name?.[0]}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">{client.client_name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{client.loan_type}</p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-black text-slate-900">${(client.loan_amount || 0).toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-xs font-bold text-slate-600">{client.agent_name || '-'}</p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-xs font-black text-slate-900">{client.interest_rate}%</p>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <p className="text-xs font-medium text-slate-500">{formatDate(client.closed_at)}</p>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                          <Mail className="w-4 h-4" />
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
      </div>
    </div>
  );
}
