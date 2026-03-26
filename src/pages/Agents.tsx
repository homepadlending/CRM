import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  UserPlus, 
  TrendingUp, 
  Award, 
  MessageSquare, 
  Calendar,
  ChevronRight,
  Star,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

const initialAgents = [
  { 
    id: '1', 
    name: 'Jessica Reynolds', 
    company: 'Elite Realty Group', 
    tier: 'Platinum', 
    referrals: 12, 
    closed: 8, 
    lastActivity: '2024-03-22',
    status: 'Active'
  },
  { 
    id: '2', 
    name: 'David Miller', 
    company: 'Skyline Properties', 
    tier: 'Gold', 
    referrals: 8, 
    closed: 5, 
    lastActivity: '2024-03-15',
    status: 'Active'
  },
  { 
    id: '3', 
    name: 'Sarah Chen', 
    company: 'Modern Living RE', 
    tier: 'Silver', 
    referrals: 4, 
    closed: 2, 
    lastActivity: '2024-03-25',
    status: 'New'
  },
  { 
    id: '4', 
    name: 'Robert Garcia', 
    company: 'Heritage Homes', 
    tier: 'Gold', 
    referrals: 9, 
    closed: 6, 
    lastActivity: '2024-02-28',
    status: 'Inactive'
  },
];

const tierColors = {
  'Platinum': 'bg-indigo-50 text-indigo-600 border-indigo-100',
  'Gold': 'bg-amber-50 text-amber-600 border-amber-100',
  'Silver': 'bg-slate-50 text-slate-600 border-slate-100',
};

export default function Agents() {
  const [agents] = useState(initialAgents);

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Referral Partners</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Manage and grow your real estate agent relationships.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 rounded-xl text-sm font-bold text-white hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
            <UserPlus className="w-4 h-4" />
            Add Partner
          </button>
        </div>
      </div>

      {/* Partner Tiers Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Partners', value: '48', icon: Award, color: 'text-indigo-600' },
          { label: 'Platinum Tier', value: '6', icon: Star, color: 'text-amber-500' },
          { label: 'Active Referrals', value: '18', icon: TrendingUp, color: 'text-emerald-500' },
          { label: 'Conversion Rate', value: '64%', icon: Award, color: 'text-blue-500' },
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

      {/* Main Content */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name, company, or tier..."
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
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Agent / Company</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Tier</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Performance</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Last Contact</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {agents.map((agent) => (
                <tr key={agent.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-bold text-sm">
                        {agent.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{agent.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{agent.company}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={cn(
                      "px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border",
                      tierColors[agent.tier as keyof typeof tierColors]
                    )}>
                      {agent.tier}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-xs font-black text-slate-900">{agent.referrals}</p>
                        <p className="text-[8px] font-bold text-slate-400 uppercase">Refs</p>
                      </div>
                      <div className="w-px h-6 bg-slate-100" />
                      <div>
                        <p className="text-xs font-black text-emerald-600">{agent.closed}</p>
                        <p className="text-[8px] font-bold text-slate-400 uppercase">Closed</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Calendar className="w-3 h-3" />
                      <span className="text-xs font-medium">{agent.lastActivity}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold",
                      agent.status === 'Active' ? "text-emerald-600 bg-emerald-50" :
                      agent.status === 'New' ? "text-blue-600 bg-blue-50" :
                      "text-slate-400 bg-slate-50"
                    )}>
                      <div className={cn(
                        "w-1 h-1 rounded-full",
                        agent.status === 'Active' ? "bg-emerald-500" :
                        agent.status === 'New' ? "bg-blue-500" :
                        "bg-slate-400"
                      )} />
                      {agent.status}
                    </span>
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
