import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Building2, 
  Calendar, 
  Briefcase,
  MoreVertical,
  Send,
  Clock,
  FileText,
  UserCircle
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Contact, Activity, Opportunity } from '@/types';
import { cn, formatDate, formatCurrency } from '@/lib/utils';

export default function ContactDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contact, setContact] = useState<Contact | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState('');

  useEffect(() => {
    if (id) {
      fetchContactData();
    }
  }, [id]);

  async function fetchContactData() {
    setLoading(true);
    const [contactRes, activityRes, oppRes] = await Promise.all([
      supabase.from('contacts').select('*, company:companies(*)').eq('id', id).single(),
      supabase.from('activities').select('*, owner:profiles(*)').eq('related_id', id).order('created_at', { ascending: false }),
      supabase.from('opportunities').select('*, stage:pipeline_stages(*)').eq('contact_id', id)
    ]);

    if (contactRes.data) setContact(contactRes.data);
    if (activityRes.data) setActivities(activityRes.data);
    if (oppRes.data) setOpportunities(oppRes.data);
    setLoading(false);
  }

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim() || !contact) return;

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    const { error } = await supabase.from('activities').insert({
      type: 'note',
      content: note,
      related_type: 'contact',
      related_id: contact.id,
      owner_id: userData.user.id
    });

    if (!error) {
      setNote('');
      fetchContactData();
    }
  };

  if (loading) return <div className="animate-pulse space-y-8">
    <div className="h-8 bg-slate-200 rounded w-1/4" />
    <div className="grid grid-cols-3 gap-8">
      <div className="col-span-2 h-96 bg-slate-100 rounded-xl" />
      <div className="h-96 bg-slate-100 rounded-xl" />
    </div>
  </div>;

  if (!contact) return <div className="text-center py-12">Contact not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/contacts')}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-500" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-xl">
              {contact.first_name[0]}{contact.last_name[0]}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{contact.first_name} {contact.last_name}</h1>
              <p className="text-slate-500">{contact.job_title || 'No title'} at {contact.company?.name || 'No company'}</p>
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
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900">Contact Details</h3>
              <span className={cn(
                "px-2 py-1 text-[10px] font-bold uppercase rounded tracking-wider",
                contact.status === 'active' ? "bg-emerald-50 text-emerald-700" : "bg-slate-50 text-slate-600"
              )}>
                {contact.status}
              </span>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email</p>
                <div className="flex items-center gap-2 text-sm text-slate-900">
                  <Mail className="w-4 h-4 text-slate-400" />
                  {contact.email || 'N/A'}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phone</p>
                <div className="flex items-center gap-2 text-sm text-slate-900">
                  <Phone className="w-4 h-4 text-slate-400" />
                  {contact.phone || 'N/A'}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Company</p>
                <Link to={`/companies/${contact.company_id}`} className="flex items-center gap-2 text-sm text-indigo-600 hover:underline">
                  <Building2 className="w-4 h-4 text-slate-400" />
                  {contact.company?.name || 'N/A'}
                </Link>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Created At</p>
                <div className="flex items-center gap-2 text-sm text-slate-900">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  {formatDate(contact.created_at)}
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
                    placeholder="Log a call or add a note..."
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all min-h-[100px] resize-none"
                  />
                  <button 
                    type="submit"
                    className="absolute bottom-3 right-3 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
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
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900">Opportunities</h3>
              <button className="text-xs font-bold text-indigo-600 hover:underline">New</button>
            </div>
            <div className="divide-y divide-slate-100">
              {opportunities.length === 0 ? (
                <p className="p-6 text-center text-slate-400 text-sm">No linked opportunities.</p>
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
