import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Mail, 
  Phone, 
  TrendingUp, 
  Home, 
  RefreshCw,
  ChevronRight,
  Star,
  AlertCircle
} from 'lucide-react';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { motion } from 'motion/react';

const initialClients = [
  { 
    id: '1', 
    name: 'The Henderson Family', 
    closedDate: '2023-10-12', 
    loanAmount: 425000, 
    currentRate: 7.25, 
    estEquity: 145000, 
    ltv: 72,
    opportunity: 'Refinance',
    score: 85
  },
  { 
    id: '2', 
    name: 'Kevin & Lisa Park', 
    closedDate: '2023-08-05', 
    loanAmount: 310000, 
    currentRate: 6.875, 
    estEquity: 280000, 
    ltv: 45,
    opportunity: 'HELOC',
    score: 92
  },
  { 
    id: '3', 
    name: 'Marcus Johnson', 
    closedDate: '2022-12-20', 
    loanAmount: 550000, 
    currentRate: 4.5, 
    estEquity: 120000, 
    ltv: 82,
    opportunity: 'None',
    score: 45
  },
  { 
    id: '4', 
    name: 'Sarah Williams', 
    closedDate: '2024-01-15', 
    loanAmount: 275000, 
    currentRate: 7.5, 
    estEquity: 45000, 
    ltv: 85,
    opportunity: 'Refinance',
    score: 78
  },
];

export default function ClosedClients() {
  const [clients] = useState(initialClients);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Closed Clients</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Your remarketing database and retention engine.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
            <Download className="w-4 h-4" />
            Export List
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 rounded-xl text-sm font-bold text-white hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
            <RefreshCw className="w-4 h-4" />
            Sync Equity Data
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-indigo-600 p-6 rounded-2xl shadow-lg shadow-indigo-100 text-white">
          <p className="text-indigo-100 text-xs font-bold uppercase tracking-wider">Total Portfolio Volume</p>
          <h3 className="text-3xl font-black mt-1">$12.4M</h3>
          <p className="text-indigo-200 text-[10px] mt-2 font-medium">42 active client relationships</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Refinance Opportunities</p>
          <h3 className="text-3xl font-black text-slate-900 mt-1">14</h3>
          <p className="text-emerald-600 text-[10px] mt-2 font-bold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +3 this week
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Avg. Portfolio Equity</p>
          <h3 className="text-3xl font-black text-slate-900 mt-1">$185k</h3>
          <p className="text-slate-400 text-[10px] mt-2 font-medium">Based on current market estimates</p>
        </div>
      </div>

      {/* Main Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name, address, or loan ID..."
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
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Loan Details</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Equity / LTV</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Opportunity</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Score</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {clients.map((client) => (
                <tr key={client.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 font-bold text-sm">
                        {client.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{client.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Closed {formatDate(client.closedDate)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-slate-900">{formatCurrency(client.loanAmount)}</p>
                    <p className="text-xs text-slate-500 font-medium">{client.currentRate}% Fixed</p>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-emerald-600">{formatCurrency(client.estEquity)}</p>
                    <p className="text-xs text-slate-500 font-medium">{client.ltv}% LTV</p>
                  </td>
                  <td className="px-6 py-5">
                    {client.opportunity !== 'None' ? (
                      <div className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider",
                        client.opportunity === 'Refinance' ? "bg-blue-50 text-blue-600" : "bg-amber-50 text-amber-600"
                      )}>
                        <RefreshCw className="w-3 h-3" />
                        {client.opportunity}
                      </div>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Watching</span>
                    )}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full",
                            client.score >= 80 ? "bg-emerald-500" : client.score >= 60 ? "bg-indigo-500" : "bg-slate-300"
                          )} 
                          style={{ width: `${client.score}%` }} 
                        />
                      </div>
                      <span className="text-xs font-black text-slate-900">{client.score}</span>
                    </div>
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
