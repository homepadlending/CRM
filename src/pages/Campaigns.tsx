import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  TrendingUp, 
  Target, 
  MousePointer2, 
  DollarSign,
  ChevronRight,
  BarChart3,
  PieChart,
  Calendar,
  MoreHorizontal
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { motion } from 'motion/react';

const initialCampaigns = [
  { 
    id: '1', 
    name: 'Spring Refi Blast', 
    type: 'Email', 
    status: 'Active', 
    leads: 45, 
    spend: 1200, 
    roi: 450,
    startDate: '2024-03-01'
  },
  { 
    id: '2', 
    name: 'Facebook First-Time Buyer', 
    type: 'Social', 
    status: 'Active', 
    leads: 128, 
    spend: 3500, 
    roi: 320,
    startDate: '2024-02-15'
  },
  { 
    id: '3', 
    name: 'Google Search - Mortgage', 
    type: 'Search', 
    status: 'Paused', 
    leads: 84, 
    spend: 2800, 
    roi: 210,
    startDate: '2024-01-10'
  },
  { 
    id: '4', 
    name: 'Direct Mail - Zip 90210', 
    type: 'Direct Mail', 
    status: 'Completed', 
    leads: 32, 
    spend: 4500, 
    roi: 180,
    startDate: '2023-12-01'
  },
];

export default function Campaigns() {
  const [campaigns] = useState(initialCampaigns);

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Campaigns</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Track your marketing attribution and ROI.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 rounded-xl text-sm font-bold text-white hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
            <Plus className="w-4 h-4" />
            Create Campaign
          </button>
        </div>
      </div>

      {/* Campaign Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Ad Spend', value: '$12,450', icon: DollarSign, color: 'text-slate-600' },
          { label: 'Total Leads', value: '295', icon: Target, color: 'text-indigo-600' },
          { label: 'Avg. Cost Per Lead', value: '$42.20', icon: MousePointer2, color: 'text-emerald-500' },
          { label: 'Avg. ROI', value: '285%', icon: TrendingUp, color: 'text-blue-500' },
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
              placeholder="Search by campaign name or type..."
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
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Campaign Name</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Type</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Performance</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">ROI</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {campaigns.map((campaign) => (
                <tr key={campaign.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 font-bold text-sm">
                        {campaign.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{campaign.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Started {campaign.startDate}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{campaign.type}</span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-xs font-black text-slate-900">{campaign.leads}</p>
                        <p className="text-[8px] font-bold text-slate-400 uppercase">Leads</p>
                      </div>
                      <div className="w-px h-6 bg-slate-100" />
                      <div>
                        <p className="text-xs font-black text-slate-900">{formatCurrency(campaign.spend)}</p>
                        <p className="text-[8px] font-bold text-slate-400 uppercase">Spend</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <TrendingUp className={cn(
                        "w-3 h-3",
                        campaign.roi >= 200 ? "text-emerald-500" : "text-amber-500"
                      )} />
                      <span className={cn(
                        "text-sm font-black",
                        campaign.roi >= 200 ? "text-emerald-600" : "text-amber-600"
                      )}>{campaign.roi}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold",
                      campaign.status === 'Active' ? "text-emerald-600 bg-emerald-50" :
                      campaign.status === 'Paused' ? "text-amber-600 bg-amber-50" :
                      campaign.status === 'Completed' ? "text-indigo-600 bg-indigo-50" :
                      "text-slate-400 bg-slate-50"
                    )}>
                      <div className={cn(
                        "w-1 h-1 rounded-full",
                        campaign.status === 'Active' ? "bg-emerald-500" :
                        campaign.status === 'Paused' ? "bg-amber-500" :
                        campaign.status === 'Completed' ? "bg-indigo-500" :
                        "bg-slate-400"
                      )} />
                      {campaign.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                        <BarChart3 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                        <MoreHorizontal className="w-4 h-4" />
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
