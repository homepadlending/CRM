"use client";

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Calendar, 
  Target, 
  Star, 
  MoreVertical,
  ChevronRight,
  MessageSquare,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Lead } from '@/types';
import { cn, formatDate } from '@/lib/utils';

export default function LeadDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchLead();
  }, [id]);

  async function fetchLead() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('id', id)
        .single();

      if (data) {
        setLead(data);
      } else {
        // Mock data fallback
        setLead({
          id,
          first_name: 'Alex',
          last_name: 'Thompson',
          email: 'alex.t@example.com',
          phone: '(555) 123-4567',
          status: 'New',
          source: 'Facebook Ads',
          created_at: '2024-03-25T10:00:00Z',
          score: 85
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500 font-bold">Lead not found</p>
        <Link href="/leads" className="text-indigo-600 hover:underline mt-4 inline-block">Back to Leads</Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all">
            Edit Profile
          </button>
          <button className="px-4 py-2 bg-indigo-600 rounded-xl text-sm font-bold text-white hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
            Convert to Loan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center">
            <div className="w-24 h-24 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-600 font-black text-3xl mx-auto mb-6">
              {lead.first_name[0]}{lead.last_name[0]}
            </div>
            <h2 className="text-2xl font-black text-slate-900">{lead.first_name} {lead.last_name}</h2>
            <p className="text-slate-500 text-sm font-medium mt-1">{lead.source} • Lead</p>
            
            <div className="mt-8 flex items-center justify-center gap-3">
              <button className="p-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all">
                <Mail className="w-5 h-5" />
              </button>
              <button className="p-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all">
                <Phone className="w-5 h-5" />
              </button>
              <button className="p-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all">
                <MessageSquare className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Contact Information</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-slate-400" />
                <p className="text-sm font-bold text-slate-700">{lead.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-slate-400" />
                <p className="text-sm font-bold text-slate-700">{lead.phone || '-'}</p>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-slate-400" />
                <p className="text-sm font-bold text-slate-700">Added {formatDate(lead.created_at)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Lead Score</h3>
            <div className="flex items-center gap-4">
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "h-full rounded-full",
                    (lead.score || 0) >= 80 ? "bg-emerald-500" : (lead.score || 0) >= 60 ? "bg-indigo-500" : "bg-slate-300"
                  )} 
                  style={{ width: `${lead.score || 0}%` }} 
                />
              </div>
              <span className="text-lg font-black text-slate-900">{lead.score || 0}</span>
            </div>
          </div>
        </div>

        {/* Activity & Details */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex border-b border-slate-100">
              {['Activity', 'Notes', 'Documents', 'Tasks'].map((tab) => (
                <button 
                  key={tab}
                  className={cn(
                    "px-8 py-5 text-sm font-bold border-b-2 transition-all",
                    tab === 'Activity' ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-400 hover:text-slate-600"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
            
            <div className="p-8 space-y-8">
              <div className="relative pl-8 space-y-8 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-px before:bg-slate-100">
                {[
                  { title: 'Lead Created', date: 'Mar 25, 2024 • 10:00 AM', icon: Target, color: 'bg-indigo-50 text-indigo-600' },
                  { title: 'Initial Email Sent', date: 'Mar 25, 2024 • 10:15 AM', icon: Mail, color: 'bg-blue-50 text-blue-600' },
                  { title: 'Phone Call Attempt', date: 'Mar 26, 2024 • 02:30 PM', icon: Phone, color: 'bg-amber-50 text-amber-600' },
                ].map((item, i) => (
                  <div key={i} className="relative">
                    <div className={cn("absolute -left-10 top-0 w-4 h-4 rounded-full border-2 border-white ring-4 ring-slate-50", item.color.split(' ')[0])} />
                    <div className="flex items-start gap-4">
                      <div className={cn("p-2 rounded-xl", item.color)}>
                        <item.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{item.title}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{item.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-8 border-t border-slate-100">
                <button className="w-full py-4 bg-slate-50 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-all">
                  View Full History
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Upcoming Tasks</h3>
                <ListTodo className="w-4 h-4 text-slate-400" />
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <div className="w-2 h-2 rounded-full bg-rose-500" />
                  <p className="text-xs font-bold text-slate-700">Follow up call</p>
                  <p className="text-[10px] font-bold text-slate-400 ml-auto">Tomorrow</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Documents</h3>
                <FileText className="w-4 h-4 text-slate-400" />
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  <p className="text-xs font-bold text-slate-700">ID_Verification.pdf</p>
                  <ChevronRight className="w-3 h-3 text-slate-400 ml-auto" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ListTodo(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 16 2 2 4-4" />
      <path d="m3 6 2 2 4-4" />
      <path d="M13 6h8" />
      <path d="M13 12h8" />
      <path d="M13 18h8" />
    </svg>
  );
}
