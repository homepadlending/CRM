import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Building2, 
  Calendar, 
  Tag, 
  MoreVertical,
  Send,
  User,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Lead, Activity } from '@/types';
import { cn, formatDate } from '@/lib/utils';

export default function LeadDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState<Lead | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState('');

  useEffect(() => {
    if (id) {
      fetchLeadData();
    }
  }, [id]);

  async function fetchLeadData() {
    setLoading(true);
    const [leadRes, activityRes] = await Promise.all([
      supabase.from('leads').select('*').eq('id', id).single(),
      supabase.from('activities').select('*, owner:profiles(*)').eq('related_id', id).order('created_at', { ascending: false })
    ]);

    if (leadRes.data) setLead(leadRes.data);
    if (activityRes.data) setActivities(activityRes.data);
    setLoading(false);
  }

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim() || !lead) return;

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    const { error } = await supabase.from('activities').insert({
      type: 'note',
      content: note,
      related_type: 'lead',
      related_id: lead.id,
      owner_id: userData.user.id
    });

    if (!error) {
      setNote('');
      fetchLeadData();
    }
  };

  const updateStatus = async (status: Lead['status']) => {
    if (!lead) return;
    const { error } = await supabase.from('leads').update({ status }).eq('id', lead.id);
    if (!error) {
      setLead({ ...lead, status });
    }
  };

  if (loading) return <div className="animate-pulse space-y-8">
    <div className="h-8 bg-slate-200 rounded w-1/4" />
    <div className="grid grid-cols-3 gap-8">
      <div className="col-span-2 h-96 bg-slate-100 rounded-xl" />
      <div className="h-96 bg-slate-100 rounded-xl" />
    </div>
  </div>;

  if (!lead) return <div className="text-center py-12">Lead not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/leads')}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-500" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{lead.first_name} {lead.last_name}</h1>
            <p className="text-slate-500">{lead.company_name || 'No company'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={lead.status}
            onChange={(e) => updateStatus(e.target.value as Lead['status'])}
            className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-500"
          >
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="unqualified">Unqualified</option>
            <option value="converted">Converted</option>
          </select>
          <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="font-bold text-slate-900">Lead Information</h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email</p>
                <div className="flex items-center gap-2 text-sm text-slate-900">
                  <Mail className="w-4 h-4 text-slate-400" />
                  {lead.email || 'N/A'}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phone</p>
                <div className="flex items-center gap-2 text-sm text-slate-900">
                  <Phone className="w-4 h-4 text-slate-400" />
                  {lead.phone || 'N/A'}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Company</p>
                <div className="flex items-center gap-2 text-sm text-slate-900">
                  <Building2 className="w-4 h-4 text-slate-400" />
                  {lead.company_name || 'N/A'}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Source</p>
                <div className="flex items-center gap-2 text-sm text-slate-900">
                  <Tag className="w-4 h-4 text-slate-400" />
                  {lead.source || 'N/A'}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Created At</p>
                <div className="flex items-center gap-2 text-sm text-slate-900">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  {formatDate(lead.created_at)}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="font-bold text-slate-900">Activity Timeline</h3>
            </div>
            <div className="p-6">
              <form onSubmit={handleAddNote} className="mb-8">
                <div className="relative">
                  <textarea 
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Add a note or log an activity..."
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all min-h-[100px] resize-none"
                  />
                  <button 
                    type="submit"
                    className="absolute bottom-3 right-3 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>

              <div className="space-y-8 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-px before:bg-slate-100">
                {activities.length === 0 ? (
                  <p className="text-center text-slate-400 text-sm py-8">No activities logged yet.</p>
                ) : (
                  activities.map((activity) => (
                    <div key={activity.id} className="relative pl-10">
                      <div className="absolute left-0 top-0 w-8 h-8 bg-white border border-slate-100 rounded-full flex items-center justify-center z-10 shadow-sm">
                        {activity.type === 'note' ? <FileText className="w-4 h-4 text-indigo-500" /> : <Clock className="w-4 h-4 text-slate-400" />}
                      </div>
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-bold text-slate-900">{activity.owner?.full_name || 'System'}</p>
                          <p className="text-xs text-slate-400">{formatDate(activity.created_at)}</p>
                        </div>
                        <p className="text-sm text-slate-600 whitespace-pre-wrap">{activity.content}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">
                <Mail className="w-4 h-4 text-slate-400" />
                Send Email
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">
                <Phone className="w-4 h-4 text-slate-400" />
                Log Call
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">
                <CheckCircle2 className="w-4 h-4 text-slate-400" />
                Create Task
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4">Owner</h3>
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

import { FileText } from 'lucide-react';
