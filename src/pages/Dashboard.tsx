import React from 'react';
import { 
  Users, 
  Target, 
  DollarSign, 
  Clock, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Briefcase,
  UserCheck,
  AlertCircle,
  Award,
  History,
  Calendar,
  ChevronRight,
  Filter,
  Download
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { formatCurrency, cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

const leadSourceData = [
  { name: 'Zillow', value: 45 },
  { name: 'Agent Ref', value: 32 },
  { name: 'Google Ads', value: 18 },
  { name: 'Direct', value: 12 },
  { name: 'Social', value: 25 },
];

const loanStageData = [
  { name: 'Application', value: 15 },
  { name: 'Processing', value: 12 },
  { name: 'Underwriting', value: 8 },
  { name: 'Approval', value: 10 },
  { name: 'Closing', value: 5 },
];

const sparklineData = [
  { value: 30 }, { value: 45 }, { value: 35 }, { value: 50 }, { value: 40 }, { value: 60 }, { value: 55 }
];

const COLORS = ['#4f46e5', '#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe'];

const StatCard = ({ title, value, icon: Icon, trend, trendValue, subtitle, color = "indigo" }: any) => {
  const isPositive = trend === 'up';
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 group"
    >
      <div className="flex items-center justify-between mb-3">
        <div className={cn(
          "p-2.5 rounded-xl transition-colors duration-300",
          color === "indigo" ? "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white" :
          color === "emerald" ? "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white" :
          color === "amber" ? "bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white" :
          "bg-slate-50 text-slate-600 group-hover:bg-slate-600 group-hover:text-white"
        )}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="h-8 w-16">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparklineData}>
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={isPositive ? "#10b981" : "#f43f5e"} 
                fill={isPositive ? "#d1fae5" : "#ffe4e6"} 
                strokeWidth={2}
                fillOpacity={0.4}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
        <div className="flex items-baseline gap-2 mt-1">
          <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
          <div className={cn(
            "flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-full",
            isPositive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
          )}>
            {isPositive ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
            {trendValue}
          </div>
        </div>
        {subtitle && <p className="text-[10px] text-slate-400 mt-1 font-medium">{subtitle}</p>}
      </div>
    </motion.div>
  );
};

const SectionHeader = ({ title, icon: Icon, action }: any) => (
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center gap-2">
      <div className="p-1.5 bg-indigo-50 rounded-lg">
        <Icon className="w-4 h-4 text-indigo-600" />
      </div>
      <h3 className="font-bold text-slate-900">{title}</h3>
    </div>
    {action}
  </div>
);

export default function Dashboard() {
  return (
    <div className="max-w-[1600px] mx-auto space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Executive Dashboard</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-slate-500 text-sm font-medium">Live Pipeline Status • Updated 2m ago</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
            <Download className="w-4 h-4" />
            Export Data
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 rounded-xl text-sm font-bold text-white hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
            <Target className="w-4 h-4" />
            New Lead
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
        <StatCard 
          title="New Leads" 
          value="42" 
          icon={Target} 
          trend="up" 
          trendValue="+12%" 
          subtitle="14 pending review"
          color="indigo"
        />
        <StatCard 
          title="Active Loans" 
          value="28" 
          icon={Briefcase} 
          trend="up" 
          trendValue="+4" 
          subtitle="Avg. $312k per loan"
          color="emerald"
        />
        <StatCard 
          title="Closed (MTD)" 
          value="12" 
          icon={UserCheck} 
          trend="up" 
          trendValue="+2" 
          subtitle="$4.2M total volume"
          color="amber"
        />
        <StatCard 
          title="Agent Refs" 
          value="18" 
          icon={Users} 
          trend="up" 
          trendValue="+5" 
          subtitle="6 active partners"
          color="indigo"
        />
        <StatCard 
          title="Follow-Ups" 
          value="9" 
          icon={Clock} 
          trend="down" 
          trendValue="-3" 
          subtitle="4 overdue tasks"
          color="amber"
        />
        <StatCard 
          title="Pipeline Vol" 
          value={formatCurrency(8450000)} 
          icon={DollarSign} 
          trend="up" 
          trendValue="+1.2M" 
          subtitle="Projected $12M Q1"
          color="emerald"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lead Source Performance */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
        >
          <SectionHeader 
            title="Lead Source Performance" 
            icon={TrendingUp}
            action={<button className="text-slate-400 hover:text-slate-600"><Filter className="w-4 h-4" /></button>}
          />
          <div className="h-[300px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={leadSourceData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" fill="#4f46e5" radius={[6, 6, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Loan Stage Distribution */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
        >
          <SectionHeader 
            title="Pipeline Distribution" 
            icon={Briefcase}
          />
          <div className="h-[250px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={loanStageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {loanStageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-black text-slate-900">50</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Loans</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-6">
            {loanStageData.map((stage, i) => (
              <div key={stage.name} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-[10px] font-bold text-slate-600 uppercase">{stage.name}</span>
                </div>
                <span className="text-xs font-bold text-slate-900">{stage.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Opportunity Alerts */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
        >
          <SectionHeader 
            title="Opportunity Alerts" 
            icon={AlertCircle}
            action={<span className="px-2 py-0.5 bg-rose-100 text-rose-600 text-[10px] font-bold rounded-full">3 NEW</span>}
          />
          <div className="space-y-3">
            {[
              { name: 'Michael Chen', type: 'Refinance', rate: '7.25% → 6.5%', equity: '$145k', priority: 'high' },
              { name: 'Sarah Miller', type: 'HELOC', equity: '$280k', ltv: '65%', priority: 'medium' },
              { name: 'James Wilson', type: 'Anniversary', date: 'Oct 12', priority: 'low' },
            ].map((alert, i) => (
              <div key={i} className="group p-4 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{alert.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        alert.priority === 'high' ? "bg-rose-500" : alert.priority === 'medium' ? "bg-amber-500" : "bg-indigo-500"
                      )} />
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{alert.type}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-400 transition-all group-hover:translate-x-1" />
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50">
                  <span className="text-xs font-bold text-indigo-600">{alert.rate || alert.equity || `Closed ${alert.date}`}</span>
                  <span className="text-[10px] font-medium text-slate-400">View Details</span>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-3 text-sm font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-all">
            View All Opportunities
          </button>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Top Performing Agents */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
        >
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-slate-900">Top Referral Partners</h3>
            </div>
            <Link to="/agents" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-wider">View all</Link>
          </div>
          <div className="divide-y divide-slate-100">
            {[
              { name: 'David Rodriguez', brokerage: 'RE/MAX Elite', closed: 12, vol: '$4.2M', rank: 1 },
              { name: 'Emily Thompson', brokerage: 'Compass', closed: 8, vol: '$3.1M', rank: 2 },
              { name: 'Robert Garcia', brokerage: 'Keller Williams', closed: 7, vol: '$2.8M', rank: 3 },
            ].map((agent, i) => (
              <div key={i} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-lg">
                      {agent.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="absolute -top-2 -left-2 w-6 h-6 bg-white border-2 border-slate-50 rounded-full flex items-center justify-center text-[10px] font-black text-slate-900 shadow-sm">
                      {agent.rank}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{agent.name}</p>
                    <p className="text-xs text-slate-500 font-medium">{agent.brokerage}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-slate-900">{agent.vol}</p>
                  <p className="text-[10px] text-emerald-600 font-black uppercase">{agent.closed} closed</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recently Closed Clients */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
        >
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-emerald-500" />
              <h3 className="font-bold text-slate-900">Recently Funded</h3>
            </div>
            <Link to="/closed-clients" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-wider">View all</Link>
          </div>
          <div className="divide-y divide-slate-100">
            {[
              { name: 'The Henderson Family', date: '2 days ago', amount: '$425,000', type: 'Purchase', icon: "🏠" },
              { name: 'Kevin & Lisa Park', date: '4 days ago', amount: '$310,000', type: 'Refinance', icon: "🔄" },
              { name: 'Marcus Johnson', date: '1 week ago', amount: '$550,000', type: 'Purchase', icon: "🏠" },
            ].map((client, i) => (
              <div key={i} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-2xl">
                    {client.icon}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{client.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{client.type}</span>
                      <span className="text-[10px] text-slate-300">•</span>
                      <span className="text-[10px] font-medium text-slate-400">{client.date}</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm font-black text-emerald-600">{client.amount}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
        >
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-slate-900">Activity Stream</h3>
            </div>
          </div>
          <div className="p-6 space-y-6">
            {[
              { user: 'Ryan', action: 'updated stage to Underwriting', target: 'Loan #4829', time: '12m ago', color: 'indigo' },
              { user: 'System', action: 'imported 12 new leads from', target: 'Zillow', time: '45m ago', color: 'slate' },
              { user: 'Sarah', action: 'logged a call with', target: 'Agent David R.', time: '1h ago', color: 'emerald' },
              { user: 'Ryan', action: 'uploaded disclosures for', target: 'The Hendersons', time: '3h ago', color: 'amber' },
            ].map((activity, i) => (
              <div key={i} className="flex gap-4 relative">
                {i !== 3 && <div className="absolute left-5 top-10 bottom-[-24px] w-px bg-slate-100" />}
                <div className={cn(
                  "w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-black z-10 shadow-sm border-2 border-white",
                  activity.color === 'indigo' ? "bg-indigo-100 text-indigo-600" :
                  activity.color === 'emerald' ? "bg-emerald-100 text-emerald-600" :
                  activity.color === 'amber' ? "bg-amber-100 text-amber-600" :
                  "bg-slate-100 text-slate-600"
                )}>
                  {activity.user[0]}
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <span className="font-bold text-slate-900">{activity.user}</span> {activity.action}{' '}
                    <span className="font-bold text-indigo-600">{activity.target}</span>
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Clock className="w-3 h-3 text-slate-300" />
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{activity.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
