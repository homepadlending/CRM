import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  CheckCircle2, 
  Circle, 
  Clock, 
  AlertCircle,
  MoreVertical,
  Calendar,
  Search,
  Filter,
  CheckCircle
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Task } from '@/types';
import { cn, formatDate } from '@/lib/utils';
import { motion } from 'motion/react';

const mockTasks: Task[] = [
  { id: '1', title: 'Follow up with Henderson Family', status: 'todo', priority: 'high', due_date: '2024-03-26T10:00:00Z', owner_id: '1' },
  { id: '2', title: 'Review underwriting conditions for Chen loan', status: 'todo', priority: 'medium', due_date: '2024-03-27T14:00:00Z', owner_id: '1' },
  { id: '3', title: 'Call Jessica Reynolds regarding new lead', status: 'completed', priority: 'high', due_date: '2024-03-25T09:00:00Z', owner_id: '1' },
  { id: '4', title: 'Prepare closing docs for Miller', status: 'todo', priority: 'high', due_date: '2024-03-28T11:00:00Z', owner_id: '1' },
  { id: '5', title: 'Update campaign attribution for March', status: 'todo', priority: 'low', due_date: '2024-03-30T16:00:00Z', owner_id: '1' },
];

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'today' | 'upcoming' | 'completed'>('all');

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('due_date', { ascending: true });

      if (data && data.length > 0) {
        setTasks(data);
      } else {
        setTasks(mockTasks);
      }
    } catch (err) {
      setTasks(mockTasks);
    } finally {
      setLoading(false);
    }
  }

  const toggleTask = async (task: Task) => {
    const newStatus = task.status === 'completed' ? 'todo' : 'completed';
    // Optimistic update
    setTasks(tasks.map(t => t.id === task.id ? { ...t, status: newStatus } : t));
    
    await supabase
      .from('tasks')
      .update({ status: newStatus })
      .eq('id', task.id);
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.status === 'completed';
    if (filter === 'all') return true;
    // Simple mock logic for today/upcoming
    return task.status !== 'completed';
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Tasks</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Stay organized and never miss a follow-up.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 rounded-xl text-sm font-bold text-white hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
          <Plus className="w-4 h-4" />
          New Task
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-xl shadow-sm">
            {(['all', 'today', 'upcoming', 'completed'] as const).map((f) => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-4 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all",
                  filter === f ? "bg-indigo-600 text-white shadow-md shadow-indigo-100" : "text-slate-500 hover:text-slate-900"
                )}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-slate-400 hover:text-slate-600">
              <Search className="w-4 h-4" />
            </button>
            <button className="p-2 text-slate-400 hover:text-slate-600">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {loading ? (
            [1, 2, 3].map(i => (
              <div key={i} className="p-6 animate-pulse flex items-center gap-4">
                <div className="w-6 h-6 bg-slate-100 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-100 rounded w-1/3" />
                  <div className="h-3 bg-slate-100 rounded w-1/4" />
                </div>
              </div>
            ))
          ) : filteredTasks.length === 0 ? (
            <div className="py-20 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-slate-200" />
              </div>
              <p className="text-slate-500 font-bold">All caught up! No tasks found.</p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <motion.div 
                key={task.id} 
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={cn(
                  "p-6 flex items-start gap-4 hover:bg-slate-50 transition-all group",
                  task.status === 'completed' && "bg-slate-50/30"
                )}
              >
                <button 
                  onClick={() => toggleTask(task)}
                  className={cn(
                    "mt-0.5 transition-all duration-300",
                    task.status === 'completed' ? "text-indigo-600" : "text-slate-300 hover:text-indigo-400"
                  )}
                >
                  {task.status === 'completed' ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <Circle className="w-6 h-6" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <h3 className={cn(
                    "text-sm font-bold text-slate-900 transition-all",
                    task.status === 'completed' && "line-through text-slate-400"
                  )}>
                    {task.title}
                  </h3>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                      <Calendar className="w-3 h-3" />
                      {task.due_date ? formatDate(task.due_date) : 'No due date'}
                    </div>
                    <div className={cn(
                      "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border",
                      task.priority === 'high' ? "bg-rose-50 text-rose-600 border-rose-100" :
                      task.priority === 'medium' ? "bg-amber-50 text-amber-600 border-amber-100" :
                      "bg-slate-50 text-slate-500 border-slate-200"
                    )}>
                      {task.priority}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
