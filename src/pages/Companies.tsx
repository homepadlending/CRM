import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Building2, 
  Globe, 
  Users,
  MoreVertical,
  ExternalLink
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Company } from '@/types';

import { Link } from 'react-router-dom';

export default function Companies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCompanies();
  }, []);

  async function fetchCompanies() {
    setLoading(true);
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order('name', { ascending: true });

    if (data) setCompanies(data);
    setLoading(false);
  }

  const filteredCompanies = companies.filter(company => 
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.industry?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Companies</h1>
          <p className="text-slate-500">Manage your accounts and organizations.</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 rounded-lg text-sm font-medium text-white hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200">
          <Plus className="w-4 h-4" />
          Add Company
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="md:col-span-2 lg:col-span-3">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {loading ? (
          [1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 bg-white rounded-xl border border-slate-200 animate-pulse" />
          ))
        ) : filteredCompanies.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-white rounded-xl border border-slate-200">
            <Building2 className="w-12 h-12 text-slate-200 mx-auto mb-2" />
            <p className="text-slate-500 font-medium">No companies found</p>
          </div>
        ) : (
          filteredCompanies.map((company) => (
            <div key={company.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600">
                  <Building2 className="w-6 h-6" />
                </div>
                <button className="text-slate-400 hover:text-slate-600">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
              <Link to={`/companies/${company.id}`}>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{company.name}</h3>
              </Link>
              <div className="mt-4 space-y-2">
                {company.website && (
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Globe className="w-4 h-4" />
                    <a href={company.website} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 flex items-center gap-1">
                      {company.website.replace(/^https?:\/\//, '')}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Users className="w-4 h-4" />
                  <span>{company.industry || 'No industry'} • {company.size || 'Unknown size'}</span>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Active Deals: 0</span>
                <button className="text-xs font-bold text-indigo-600 hover:underline">View Details</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
