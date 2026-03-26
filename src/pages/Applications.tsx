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
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Download,
  ClipboardList
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Application } from '@/types';
import { cn, formatDate, formatCurrency } from '@/lib/utils';
import { motion } from 'motion/react';

const mockApplications: Application[] = [
  {
    id: '1',
    borrower_name: 'David Miller',
    email: 'd.miller@example.com',
    phone: '(555) 111-2222',
    loan_purpose: 'Purchase',
    property_type: 'Single Family',
    estimated_value: 450000,
    loan_amount: 360000,
    credit_score_range: '740+',
    status: 'In Review',
    created_at: '2024-03-25T10:00:00Z',
    owner_id: '1'
  },
  {
    id: '2',
    borrower_name: 'Sarah Jenkins',
    email: 's.jenkins@example.com',
    phone: '(555) 333-4444',
    loan_purpose: 'Refinance',
    property_type: 'Condo',
    estimated_value: 320000,
    loan_amount: 240000,
    credit_score_range: '700-739',
    status: 'Information Requested',
    created_at: '2024-03-24T14:30:00Z',
    owner_id: '1'
  },
  {
    id: '3',
    borrower_name: 'Michael & Emily Brown',
    email: 'browns@example.com',
    phone: '(555) 555-6666',
    loan_purpose: 'Purchase',
    property_type: 'Single Family',
    estimated_value: 600000,
    loan_amount: 480000,
    credit_score_range: '740+',
    status: 'Approved',
    created_at: '2024-03-23T09:15:00Z',
    owner_id: '1'
  },
  {
    id: '4',
    borrower_name: 'Kevin Zhang',
    email: 'k.zhang@example.com',
    phone: '(555) 777-8888',
    loan_purpose: 'Cash-out Refi',
    property_type: 'Multi-Family',
    estimated_value: 850000,
    loan_amount: 500000,
    credit_score_range: '680-699',
    status: 'Started',
    created_at: '2024-03-25T16:45:00Z',
    owner_id: '1'
  }
];

export default function Applications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  async function fetchApplications() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (data && data.length > 0) {
        setApplications(data);
      } else {
        setApplications(mockApplications);
      }
    } catch (err) {
      setApplications(mockApplications);
    } finally {
      setLoading(false);
    }
  }

  const filteredApplications = applications.filter(app => 
    app.borrower_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'In Review': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'Information Requested': return <AlertCircle className="w-4 h-4 text-amber-500" />;
      default: return <FileText className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Applications</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Track formal loan applications in progress.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 rounded-xl text-sm font-bold text-white hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
            <Plus className="w-4 h-4" />
            New Application
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Active Apps', value: applications.length.toString(), icon: ClipboardList, color: 'text-indigo-600' },
          { label: 'In Review', value: '8', icon: Clock, color: 'text-blue-500' },
          { label: 'Approved', value: '14', icon: CheckCircle2, color: 'text-emerald-500' },
          { label: 'Pending Docs', value: '5', icon: AlertCircle, color: 'text-amber-500' },
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
              placeholder="Search by borrower name or email..."
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
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Borrower</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Purpose</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Loan Amount</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Credit</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Submitted</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                [1, 2, 3, 4].map((i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={7} className="px-6 py-6">
                      <div className="h-4 bg-slate-100 rounded w-full" />
                    </td>
                  </tr>
                ))
              ) : filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                        <ClipboardList className="w-8 h-8 text-slate-200" />
                      </div>
                      <p className="text-slate-500 font-bold">No applications found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-bold text-sm">
                          {app.borrower_name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{app.borrower_name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{app.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-xs font-bold text-slate-700">{app.loan_purpose}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{app.property_type}</p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-black text-slate-900">{formatCurrency(app.loan_amount)}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Val: {formatCurrency(app.estimated_value)}</p>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(app.status)}
                        <span className={cn(
                          "px-2.5 py-1 text-[10px] font-black uppercase rounded-lg tracking-wider",
                          app.status === 'Approved' ? "bg-emerald-50 text-emerald-600" :
                          app.status === 'In Review' ? "bg-blue-50 text-blue-600" :
                          app.status === 'Information Requested' ? "bg-amber-50 text-amber-600" :
                          "bg-slate-50 text-slate-500"
                        )}>
                          {app.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-xs font-black text-slate-700">{app.credit_score_range}</p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-xs font-medium text-slate-500">{formatDate(app.created_at)}</p>
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
                          <MoreVertical className="w-4 h-4" />
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
            Showing <span className="text-slate-900">{filteredApplications.length}</span> of <span className="text-slate-900">{applications.length}</span> applications
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
