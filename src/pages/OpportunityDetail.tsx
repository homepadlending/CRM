import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  Building2, 
  UserCircle,
  MoreVertical,
  Send,
  Clock,
  FileText,
  CheckCircle2
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Opportunity, Activity, PipelineStage } from '@/types';
import { cn, formatDate, formatCurrency } from '@/lib/utils';

export default function OpportunityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [stages, setStages] = useState<PipelineStage[]>([]);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState('');

  useEffect(() => {
    if (id) {
      fetchOpportunityData();
    }
  }, [id]);

  async function fetchOpportunityData() {
    setLoading(true);
    const [oppRes, activityRes, stageRes] = await Promise.all([
      supabase.from('opportunities').select('*, company:companies(*), stage:pipeline_stages(*)').eq('id', id).single(),
      supabase.from('activities').select('*, owner:profiles(*)').eq('related_id', id).order('created_at', { ascending: false }),
      supabase.from('pipeline_stages').select('*').order('display_order', { ascending: true })
    ]);

    if (oppRes.data) setOpportunity(oppRes.data);
    if (activityRes.data) setActivities(activityRes.data);
    if (stageRes.data) setStages(stageRes.data);
    setLoading(false);
  }

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim() || !opportunity) return;

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    const { error } = await supabase.from('activities').insert({
      type: 'note',
      content: note,
      related_type: 'opportunity',
      related_id: opportunity.id,
      owner_id: userData.user.id
    });

    if (!error) {
      setNote('');
      fetchOpportunityData();
    }
  };

  const updateStage = async (stageId: string) => {
    if (!opportunity) return;
    const { error } = await supabase.from('opportunities').update({ stage_id: stageId }).eq('id', opportunity.id);
    if (!error) {
      fetchOpportunityData();
    }
  };

  if (loading) return <div className="animate-pulse space-y-8">
    <div className="h-8 bg-slate-200 rounded w-1/4" />
    <div className="grid grid-cols-3 gap-8">
      <div className="col-span-2 h-96 bg-slate-100 rounded-xl" />
      <div className="h-96 bg-slate-100 rounded-xl" />
    </div>
  </div>;

  if (!opportunity) return <div className="text-center py-12">Opportunity not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/opportunities')}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-500" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{opportunity.name}</h1>
            <Link to={`/companies/${opportunity.company_id}`} className="text-indigo-600 hover:underline text-sm font-medium">
              {opportunity.company?.name}
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={opportunity.status}
            onChange={async (e) => {
              const status = e.target.value as Opportunity['status'];
              await supabase.from('opportunities').update({ status }).eq('id', opportunity.id);
              setOpportunity({ ...opportunity, status });
            }}
            className={cn(
              "px-3 py-2 border rounded-lg text-sm font-bold uppercase tracking-wider",
              opportunity.status === 'won' ? "bg-emerald-50 border-emerald-200 text-emerald-700" :
              opportunity.status === 'lost' ? "bg-rose-50 border-rose-200 text-rose-700" :
              "bg-white border-slate-200 text-slate-600"
            )}
          >
            <option value="open">Open</option>
            <option value="won">Won</option>
            <option value="lost">Lost</option>
          </select>
          <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between gap-1">
          {stages.map((stage, idx) => {
            const isCurrent = stage.id === opportunity.stage_id;
            const isPast = stages.findIndex(s => s.id === opportunity.stage_id) > idx;
            
            return (
              <button 
                key={stage.id}
                onClick={() => updateStage(stage.id)}
                className={cn(
                  "flex-1 py-2 px-1 text-[10px] font-bold uppercase tracking-wider rounded transition-all",
                  isCurrent ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" :
                  isPast ? "bg-indigo-50 text-indigo-600" :
                  "bg-slate-50 text-slate-400 hover:bg-slate-100"
                )}
              >
                {stage.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Value</p>
              <h3 className="text-xl font-bold text-slate-900">{formatCurrency(opportunity.value)}</h3>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Probability</p>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-slate-900">{opportunity.probability || opportunity.stage?.probability}%</h3>
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Expected Close</p>
              <h3 className="text-xl font-bold text-slate-900">{opportunity.expected_close_date ? formatDate(opportunity.expected_close_date) : 'N/A'}</h3>
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
                    placeholder="Log a meeting or add a note..."
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
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4">Account Details</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{opportunity.company?.name}</p>
                  <p className="text-xs text-slate-500">{opportunity.company?.industry}</p>
                </div>
              </div>
              <button className="w-full py-2 bg-slate-50 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-100 transition-colors">
                View Company Profile
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4">Deal Owner</h3>
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
