import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  DollarSign, 
  Calendar, 
  User,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { motion, Reorder } from 'motion/react';

const stages = [
  { id: 'application', name: 'Application', color: 'bg-blue-500' },
  { id: 'processing', name: 'Processing', color: 'bg-indigo-500' },
  { id: 'underwriting', name: 'Underwriting', color: 'bg-amber-500' },
  { id: 'approval', name: 'Approval', color: 'bg-emerald-500' },
  { id: 'closing', name: 'Closing', color: 'bg-rose-500' },
];

const initialLoans = [
  { id: '1', borrower: 'Michael Chen', amount: 425000, type: 'Conventional', stage: 'application', date: '2024-03-24', credit: 745, ltv: 80 },
  { id: '2', borrower: 'Sarah Miller', amount: 310000, type: 'FHA', stage: 'processing', date: '2024-03-22', credit: 680, ltv: 96.5 },
  { id: '3', borrower: 'James Wilson', amount: 550000, type: 'VA', stage: 'underwriting', date: '2024-03-20', credit: 720, ltv: 100 },
  { id: '4', borrower: 'Emily Davis', amount: 285000, type: 'Conventional', stage: 'processing', date: '2024-03-25', credit: 760, ltv: 75 },
  { id: '5', borrower: 'Robert Taylor', amount: 620000, type: 'Jumbo', stage: 'approval', date: '2024-03-18', credit: 780, ltv: 80 },
  { id: '6', borrower: 'Linda White', amount: 395000, type: 'Conventional', stage: 'closing', date: '2024-03-15', credit: 710, ltv: 90 },
];

export default function Loans() {
  const [loans, setLoans] = useState(initialLoans);
  const [view, setView] = useState<'kanban' | 'table'>('kanban');

  const getLoansByStage = (stageId: string) => loans.filter(loan => loan.stage === stageId);

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Loan Pipeline</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Manage and track active mortgage applications.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
            <button 
              onClick={() => setView('kanban')}
              className={cn(
                "px-3 py-1.5 text-xs font-bold rounded-lg transition-all",
                view === 'kanban' ? "bg-indigo-600 text-white shadow-md shadow-indigo-100" : "text-slate-500 hover:text-slate-900"
              )}
            >
              Kanban
            </button>
            <button 
              onClick={() => setView('table')}
              className={cn(
                "px-3 py-1.5 text-xs font-bold rounded-lg transition-all",
                view === 'table' ? "bg-indigo-600 text-white shadow-md shadow-indigo-100" : "text-slate-500 hover:text-slate-900"
              )}
            >
              Table
            </button>
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 rounded-xl text-sm font-bold text-white hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
            <Plus className="w-4 h-4" />
            New Loan
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by borrower, loan ID, or property..."
            className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border-transparent rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all">
            <Filter className="w-4 h-4 text-slate-400" />
            Filters
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all">
            <Calendar className="w-4 h-4 text-slate-400" />
            Closing Date
          </button>
        </div>
      </div>

      {view === 'kanban' ? (
        <div className="flex gap-6 overflow-x-auto pb-8 min-h-[600px] -mx-4 px-4 scrollbar-hide">
          {stages.map((stage) => (
            <div key={stage.id} className="flex-shrink-0 w-80 flex flex-col gap-4">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <div className={cn("w-2 h-2 rounded-full", stage.color)} />
                  <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider">{stage.name}</h3>
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-black rounded-full">
                    {getLoansByStage(stage.id).length}
                  </span>
                </div>
                <button className="text-slate-400 hover:text-slate-600"><Plus className="w-4 h-4" /></button>
              </div>

              <div className="flex flex-col gap-4">
                {getLoansByStage(stage.id).map((loan) => (
                  <motion.div 
                    key={loan.id}
                    layoutId={loan.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{loan.borrower}</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-0.5">{loan.type} • ID: {loan.id}482</p>
                      </div>
                      <button className="text-slate-300 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400">Loan Amount</span>
                        <span className="text-sm font-black text-slate-900">{formatCurrency(loan.amount)}</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                          <p className="text-[8px] font-bold text-slate-400 uppercase">Credit Score</p>
                          <p className={cn(
                            "text-xs font-black mt-0.5",
                            loan.credit >= 740 ? "text-emerald-600" : loan.credit >= 700 ? "text-indigo-600" : "text-amber-600"
                          )}>{loan.credit}</p>
                        </div>
                        <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                          <p className="text-[8px] font-bold text-slate-400 uppercase">LTV Ratio</p>
                          <p className="text-xs font-black text-slate-900 mt-0.5">{loan.ltv}%</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-slate-300" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Updated 2h ago</span>
                      </div>
                      <div className="flex -space-x-2">
                        <div className="w-6 h-6 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-[8px] font-bold text-indigo-600">RP</div>
                        <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[8px] font-bold text-slate-600">SM</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {getLoansByStage(stage.id).length === 0 && (
                  <div className="h-24 border-2 border-dashed border-slate-100 rounded-2xl flex items-center justify-center">
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Empty Stage</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Borrower</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Amount</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Stage</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Type</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Credit</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loans.map((loan) => (
                <tr key={loan.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 font-bold text-xs">
                        {loan.borrower.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-sm font-bold text-slate-900">{loan.borrower}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">{formatCurrency(loan.amount)}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-1 text-[10px] font-black uppercase rounded-lg tracking-wider",
                      loan.stage === 'application' ? "bg-blue-50 text-blue-600" :
                      loan.stage === 'processing' ? "bg-indigo-50 text-indigo-600" :
                      loan.stage === 'underwriting' ? "bg-amber-50 text-amber-600" :
                      loan.stage === 'approval' ? "bg-emerald-50 text-emerald-600" :
                      "bg-rose-50 text-rose-600"
                    )}>
                      {loan.stage}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-500">{loan.type}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">{loan.credit}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
