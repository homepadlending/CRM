import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Globe, 
  Building2, 
  Users, 
  MoreVertical,
  Briefcase,
  UserCircle,
  Plus,
  ExternalLink
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Company, Contact, Opportunity } from '@/types';
import { cn, formatCurrency } from '@/lib/utils';

export default function CompanyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState<Company | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchCompanyData();
    }
  }, [id]);

  async function fetchCompanyData() {
    setLoading(true);
    const [companyRes, contactRes, oppRes] = await Promise.all([
      supabase.from('companies').select('*').eq('id', id).single(),
      supabase.from('contacts').select('*').eq('company_id', id),
      supabase.from('opportunities').select('*, stage:pipeline_stages(*)').eq('company_id', id)
    ]);

    if (companyRes.data) setCompany(companyRes.data);
    if (contactRes.data) setContacts(contactRes.data);
    if (oppRes.data) setOpportunities(oppRes.data);
    setLoading(false);
  }

  if (loading) return <div className="animate-pulse space-y-8">
    <div className="h-8 bg-slate-200 rounded w-1/4" />
    <div className="grid grid-cols-3 gap-8">
      <div className="col-span-2 h-96 bg-slate-100 rounded-xl" />
      <div className="h-96 bg-slate-100 rounded-xl" />
    </div>
  </div>;

  if (!company) return <div className="text-center py-12">Company not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/companies')}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-500" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{company.name}</h1>
              <p className="text-slate-500">{company.industry || 'No industry'} • {company.size || 'Unknown size'}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
            Edit
          </button>
          <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="font-bold text-slate-900">About</h3>
            </div>
            <div className="p-6 space-y-6">
              <p className="text-sm text-slate-600 leading-relaxed">
                {company.description || 'No description provided for this company.'}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-50">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Website</p>
                  {company.website ? (
                    <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-indigo-600 hover:underline">
                      <Globe className="w-4 h-4 text-slate-400" />
                      {company.website.replace(/^https?:\/\//, '')}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : <p className="text-sm text-slate-500">N/A</p>}
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Industry</p>
                  <p className="text-sm text-slate-900">{company.industry || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900">Contacts</h3>
              <button className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:underline">
                <Plus className="w-3 h-3" />
                Add Contact
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              {contacts.length === 0 ? (
                <p className="p-6 text-center text-slate-400 text-sm">No contacts linked to this company.</p>
              ) : (
                contacts.map((contact) => (
                  <Link key={contact.id} to={`/contacts/${contact.id}`} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-bold text-xs">
                        {contact.first_name[0]}{contact.last_name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600">{contact.first_name} {contact.last_name}</p>
                        <p className="text-xs text-slate-500">{contact.job_title || 'No title'}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600" />
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900">Opportunities</h3>
              <button className="text-xs font-bold text-indigo-600 hover:underline">New</button>
            </div>
            <div className="divide-y divide-slate-100">
              {opportunities.length === 0 ? (
                <p className="p-6 text-center text-slate-400 text-sm">No active opportunities.</p>
              ) : (
                opportunities.map((opp) => (
                  <Link key={opp.id} to={`/opportunities/${opp.id}`} className="p-4 block hover:bg-slate-50 transition-colors">
                    <p className="text-sm font-bold text-slate-900">{opp.name}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-slate-500">{opp.stage?.name}</span>
                      <span className="text-sm font-bold text-slate-900">{formatCurrency(opp.value)}</span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4">Account Owner</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold">
                RP
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Ryan Pad</p>
                <p className="text-xs text-slate-500">Account Manager</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { ChevronRight } from 'lucide-react';
