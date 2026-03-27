"use client";

import React from 'react';
import { 
  Users, 
  Target, 
  DollarSign, 
  Clock, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Briefcase,
  UserCheck,
  AlertCircle,
  Award,
  History,
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
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { getDashboardStats, getActivities } from '@/lib/services';
import { Activity } from '@/types';

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
  const [stats, setStats] = React.useState<any>(null);
  const [activities, setActivities] = React.useState<Activity[]>([]);
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();

  React.useEffect(() => {
    async function loadDashboardData() {
      try {
        const [dashboardStats, recentActivities] = await Promise.all([
          getDashboardStats(),
          getActivities(5)
        ]);
        setStats(dashboardStats);
        setActivities(recentActivities);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const leadSourceData = stats?.leadSourceData?.length > 0 ? stats.leadSourceData : [
    { name: 'Zillow', value: 45 },
    { name: 'Agent Ref', value: 32 },
    { name: 'Google Ads', value: 18 },
    { name: 'Direct', value: 12 },
    { name: 'Social', value: 25 },
  ];

  const loanStageData = stats?.loanStageData?.length > 0 ? stats.loanStageData : [
    { name: 'Application', value: 15 },
    { name: 'Processing', value: 12 },
    { name: 'Underwriting', value: 8 },
    { name: 'Approval', value: 10 },
    { name: 'Closing', value: 5 },
  ];

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Executive Dashboard</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-slate-500 text-sm font-medium">Live Pipeline Status • Updated just now</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
          >
            <Download className="w-4 h-4" />
            Export Data
          </button>
          <button 
            onClick={() => router.push('/leads')}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 rounded-xl text-sm font-bold text-white hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
          >
            <Target className="w-4 h-4" />
            New Lead
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
        <StatCard 
          title="Total Leads" 
          value={stats?.leadsCount || 0} 
          icon={Target} 
          trend="up" 
          trendValue="+0%" 
          subtitle="All time leads"
          color="indigo"
        />
        <StatCard 
          title="Active Loans" 
          value={stats?.activeLoansCount || 0} 
          icon={Briefcase} 
          trend="up" 
          trendValue="+0" 
          subtitle="In pipeline"
          color="emerald"
        />
        <StatCard 
          title="Pending Tasks" 
          value={stats?.pendingTasksCount || 0} 
          icon={Clock} 
          trend="up" 
          trendValue="+0" 
          subtitle="To be completed"
          color="amber"
        />
        <StatCard 
          title="Total Agents" 
          value={stats?.recentContactsCount || 0} 
          icon={Users} 
          trend="up" 
          trendValue="+0" 
          subtitle="Referral partners"
          color="indigo"
        />
        <StatCard 
          title="Follow-Ups" 
          value={stats?.pendingTasksCount || 0} 
          icon={Clock} 
          trend="down" 
          trendValue="-0" 
          subtitle="Tasks due"
          color="amber"
        />
        <StatCard 
          title="Pipeline Vol" 
          value={formatCurrency(stats?.totalVolume || 0)} 
          icon={DollarSign} 
          trend="up" 
          trendValue="+0" 
          subtitle="Active loan volume"
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
            {stats?.leadsCount > 0 ? (
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
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <Target className="w-12 h-12 mb-2 opacity-20" />
                <p className="text-sm font-medium">No lead data available</p>
              </div>
            )}
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
            {stats?.activeLoansCount > 0 ? (
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
                    {loanStageData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <Briefcase className="w-12 h-12 mb-2 opacity-20" />
                <p className="text-sm font-medium">No loan data available</p>
              </div>
            )}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-black text-slate-900">{stats?.activeLoansCount || 0}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Loans</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-6">
            {loanStageData.map((stage: any, i: number) => (
              <div key={stage.name} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
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
            action={<span className="px-2 py-0.5 bg-rose-100 text-rose-600 text-[10px] font-bold rounded-full">{stats?.recentlyFunded?.length || 0} NEW</span>}
          />
          <div className="space-y-3">
            {stats?.recentlyFunded?.length > 0 ? (
              stats.recentlyFunded.map((loan: any) => (
                <div key={loan.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-900">{loan.client_name}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Funded: {formatCurrency(loan.loan_amount)}</p>
                  </div>
                  <div className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg">
                    <DollarSign className="w-3.5 h-3.5" />
                  </div>
                </div>
              ))
            ) : (
              <div className="h-[300px] flex flex-col items-center justify-center text-slate-400">
                <AlertCircle className="w-12 h-12 mb-2 opacity-20" />
                <p className="text-sm font-medium">No active alerts</p>
              </div>
            )}
          </div>
          <button 
            onClick={() => router.push('/loans')}
            className="w-full mt-6 py-3 text-sm font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-all"
          >
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
            <Link href="/agents" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-wider">View all</Link>
          </div>
          <div className="divide-y divide-slate-100 min-h-[200px]">
            {stats?.topAgents?.length > 0 ? (
              stats.topAgents.map((agent: any) => (
                <div key={agent.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
                      {agent.first_name[0]}{agent.last_name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{agent.first_name} {agent.last_name}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Volume: {formatCurrency(agent.total_volume || 0)}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-400">
                <Users className="w-12 h-12 mx-auto mb-2 opacity-20" />
                <p className="text-sm font-medium">No agents found</p>
              </div>
            )}
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
            <Link href="/loans" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-wider">View all</Link>
          </div>
          <div className="divide-y divide-slate-100 min-h-[200px]">
            {stats?.recentlyFunded?.length > 0 ? (
              stats.recentlyFunded.map((loan: any) => (
                <div key={loan.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm">
                      {loan.client_name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{loan.client_name}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Closed: {new Date(loan.closed_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-900">{formatCurrency(loan.loan_amount)}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-400">
                <UserCheck className="w-12 h-12 mx-auto mb-2 opacity-20" />
                <p className="text-sm font-medium">No closed clients yet</p>
              </div>
            )}
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
          <div className="p-6 space-y-6 min-h-[200px]">
            {activities.length > 0 ? (
              activities.map((activity, i) => (
                <div key={activity.id} className="flex gap-4 relative">
                  {i !== activities.length - 1 && <div className="absolute left-5 top-10 bottom-[-24px] w-px bg-slate-100" />}
                  <div className={cn(
                    "w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-black z-10 shadow-sm border-2 border-white bg-indigo-100 text-indigo-600"
                  )}>
                    {activity.owner?.full_name?.[0] || 'U'}
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-xs text-slate-600 leading-relaxed">
                      <span className="font-bold text-slate-900">{activity.owner?.full_name || 'User'}</span> {activity.content}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <Clock className="w-3 h-3 text-slate-300" />
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {new Date(activity.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <History className="w-12 h-12 mb-2 opacity-20" />
                <p className="text-sm font-medium">No recent activity</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

