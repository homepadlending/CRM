import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Briefcase, 
  TrendingUp,
  Calendar,
  DollarSign,
  MoreVertical
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Opportunity } from '@/types';
import { Link } from 'react-router-dom';
import { cn, formatCurrency, formatDate } from '@/lib/utils';

export default function Opportunities() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOpportunities();
  }, []);

  async function fetchOpportunities() {
    setLoading(true);
    const { data, error } = await supabase
      .from('opportunities')
      .select('*, company:companies(*), stage:pipeline_stages(*)')
      .order('created_at', { ascending: false });

    if (data) setOpportunities(data);
    setLoading(false);
  }

  const filteredOpps = opportunities.filter(opp => 
    opp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opp.company?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Opportunities</h1>
          <p className="text-slate-500">Track your sales pipeline and deal progress.</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 rounded-lg text-sm font-medium text-white hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200">
          <Plus className="w-4 h-4" />
          New Opportunity
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search deals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Deal Name</th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Value</th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Stage</th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Close Date</th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                [1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-6 py-4">
                      <div className="h-4 bg-slate-100 rounded w-full" />
                    </td>
                  </tr>
                ))
              ) : filteredOpps.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Briefcase className="w-12 h-12 text-slate-200" />
                      <p className="text-slate-500 font-medium">No opportunities found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOpps.map((opp) => (
                  <tr key={opp.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <Link to={`/opportunities/${opp.id}`}>
                        <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{opp.name}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <TrendingUp className="w-3 h-3 text-indigo-500" />
                          <span className="text-[10px] font-bold text-indigo-600 uppercase">{opp.probability}% probability</span>
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-600">{opp.company?.name || '-'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-900">{formatCurrency(opp.value)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase rounded tracking-wider">
                        {opp.stage?.name || 'New'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        {opp.expected_close_date ? formatDate(opp.expected_close_date) : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-1 text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="w-4 h-4" />
                      </button>
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
