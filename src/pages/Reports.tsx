import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Calendar, 
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  FileSpreadsheet
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

const volumeData = [
  { month: 'Oct', volume: 4.2 },
  { month: 'Nov', volume: 3.8 },
  { month: 'Dec', volume: 5.1 },
  { month: 'Jan', volume: 4.5 },
  { month: 'Feb', volume: 6.2 },
  { month: 'Mar', volume: 7.8 },
];

const sourceData = [
  { name: 'Referral', value: 45, color: '#4f46e5' },
  { name: 'Direct', value: 25, color: '#10b981' },
  { name: 'Social', value: 15, color: '#f59e0b' },
  { name: 'Other', value: 15, color: '#64748b' },
];

export default function Reports() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Reports & Analytics</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Comprehensive insights into your mortgage pipeline and performance.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
            <Calendar className="w-4 h-4" />
            Last 30 Days
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 rounded-xl text-sm font-bold text-white hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
            <Download className="w-4 h-4" />
            Export Data
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Volume', value: '$24.8M', change: '+12.5%', trend: 'up', icon: BarChart3, color: 'indigo' },
          { label: 'Avg. Loan Size', value: '$412K', change: '+3.2%', trend: 'up', icon: TrendingUp, color: 'emerald' },
          { label: 'Conversion Rate', value: '18.4%', change: '-1.2%', trend: 'down', icon: PieChartIcon, color: 'amber' },
          { label: 'Pull-through', value: '72%', change: '+5.4%', trend: 'up', icon: LineChartIcon, color: 'rose' },
        ].map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center",
                stat.color === 'indigo' ? "bg-indigo-50 text-indigo-600" :
                stat.color === 'emerald' ? "bg-emerald-50 text-emerald-600" :
                stat.color === 'amber' ? "bg-amber-50 text-amber-600" :
                "bg-rose-50 text-rose-600"
              )}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div className={cn(
                "flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg",
                stat.trend === 'up' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
              )}>
                {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.change}
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">{stat.value}</div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-black text-slate-900">Volume Trends</h3>
              <p className="text-slate-500 text-xs font-medium">Monthly funded volume in millions</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-indigo-600" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Year</span>
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={volumeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                  tickFormatter={(value) => `$${value}M`}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}
                />
                <Bar dataKey="volume" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Side Chart */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-black text-slate-900 mb-2">Lead Sources</h3>
          <p className="text-slate-500 text-xs font-medium mb-8">Distribution of incoming opportunities</p>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-4">
            {sourceData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs font-bold text-slate-600">{item.name}</span>
                </div>
                <span className="text-xs font-black text-slate-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Report List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-black text-slate-900">Standard Reports</h3>
          <button className="text-indigo-600 text-xs font-black uppercase tracking-widest hover:text-indigo-700">View All</button>
        </div>
        <div className="divide-y divide-slate-100">
          {[
            { name: 'Monthly Funding Summary', desc: 'Detailed breakdown of all loans funded in the current month.', type: 'Financial' },
            { name: 'Agent Referral Performance', desc: 'Ranking of referral partners by volume and pull-through rate.', type: 'Sales' },
            { name: 'Lead Conversion Audit', desc: 'Analysis of lead-to-app and app-to-fund ratios by source.', type: 'Marketing' },
            { name: 'Compliance & Disclosure Log', desc: 'Audit trail for all regulatory disclosures and timelines.', type: 'Compliance' },
          ].map((report) => (
            <div key={report.name} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{report.name}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{report.desc}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="px-2 py-1 bg-slate-100 text-slate-500 rounded text-[8px] font-black uppercase tracking-widest">
                  {report.type}
                </span>
                <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
