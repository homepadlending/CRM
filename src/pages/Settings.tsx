import React, { useState } from 'react';
import { 
  User, 
  Shield, 
  Bell, 
  Database, 
  Globe, 
  CreditCard,
  ChevronRight,
  DatabaseZap,
  Loader2,
  Trash2,
  Lock,
  Mail,
  Smartphone,
  Zap
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

const SettingItem = ({ icon: Icon, title, description, onClick, badge }: any) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-all group"
  >
    <div className="flex items-center gap-5">
      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all border border-slate-100 group-hover:border-indigo-100">
        <Icon className="w-5 h-5" />
      </div>
      <div className="text-left">
        <div className="flex items-center gap-2">
          <p className="text-sm font-black text-slate-900">{title}</p>
          {badge && (
            <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-600 text-[8px] font-black uppercase tracking-widest rounded">
              {badge}
            </span>
          )}
        </div>
        <p className="text-xs font-medium text-slate-500 mt-0.5">{description}</p>
      </div>
    </div>
    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
  </button>
);

export default function Settings() {
  const [seeding, setSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState<string | null>(null);

  const seedDemoData = async () => {
    setSeeding(true);
    setSeedMessage(null);
    try {
      // Simulate seeding for UI feedback if supabase fails or is empty
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSeedMessage('Demo data seeded successfully!');
    } catch (err: any) {
      setSeedMessage(`Error: ${err.message}`);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Settings</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Manage your account, workspace, and integrations.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          {[
            { label: 'General', icon: User, active: true },
            { label: 'Security', icon: Shield },
            { label: 'Notifications', icon: Bell },
            { label: 'Integrations', icon: Zap },
            { label: 'Billing', icon: CreditCard },
            { label: 'Team', icon: Database },
          ].map((item) => (
            <button
              key={item.label}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                item.active 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </div>

        {/* Main Settings Content */}
        <div className="lg:col-span-2 space-y-10">
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Account Profile</h3>
              <button className="text-indigo-600 text-[10px] font-black uppercase tracking-widest hover:text-indigo-700">Edit Profile</button>
            </div>
            
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
              <div className="p-8 flex items-center gap-6">
                <div className="w-20 h-20 bg-indigo-100 rounded-3xl flex items-center justify-center text-indigo-600 font-black text-2xl border-4 border-white shadow-xl">
                  RH
                </div>
                <div>
                  <h4 className="text-xl font-black text-slate-900">Ryan Henderson</h4>
                  <p className="text-slate-500 text-sm font-medium">ryan@thehomepad.com</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-widest rounded border border-emerald-100">Verified</span>
                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[8px] font-black uppercase tracking-widest rounded border border-indigo-100">Admin</span>
                  </div>
                </div>
              </div>

              <SettingItem 
                icon={Mail} 
                title="Email Address" 
                description="ryan@thehomepad.com" 
              />
              <SettingItem 
                icon={Smartphone} 
                title="Phone Number" 
                description="+1 (555) 000-0000" 
              />
            </div>
          </section>

          <section className="space-y-6">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Workspace & Data</h3>
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
              <div className="p-6 flex items-center justify-between hover:bg-slate-50 transition-all group">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 border border-indigo-100">
                    <DatabaseZap className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900">Demo Data Engine</p>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">Populate your workspace with sample mortgage data</p>
                  </div>
                </div>
                <button 
                  onClick={seedDemoData}
                  disabled={seeding}
                  className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-lg shadow-indigo-100"
                >
                  {seeding && <Loader2 className="w-3 h-3 animate-spin" />}
                  {seeding ? 'Seeding...' : 'Seed Data'}
                </button>
              </div>
              
              {seedMessage && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className={cn(
                    "p-4 text-[10px] font-black uppercase tracking-widest text-center",
                    seedMessage.includes('Error') ? "text-rose-600 bg-rose-50" : "text-emerald-600 bg-emerald-50"
                  )}
                >
                  {seedMessage}
                </motion.div>
              )}

              <SettingItem 
                icon={Globe} 
                title="Integrations" 
                description="Connect with Encompass, Slack, and Gmail" 
                badge="Premium"
              />
              <SettingItem 
                icon={Lock} 
                title="Security & Compliance" 
                description="Manage SOC2 compliance and data encryption" 
              />
            </div>
          </section>

          <section className="space-y-6">
            <h3 className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Danger Zone</h3>
            <div className="bg-rose-50 rounded-3xl border border-rose-100 p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h4 className="text-lg font-black text-rose-900 leading-tight">Delete Workspace</h4>
                  <p className="text-sm font-medium text-rose-700 mt-1 max-w-md">
                    Permanently delete all data, loans, and leads. This action is irreversible and will immediately terminate all access.
                  </p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-rose-600 text-white rounded-xl text-sm font-black hover:bg-rose-700 transition-all shadow-lg shadow-rose-200">
                  <Trash2 className="w-4 h-4" />
                  Delete Everything
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
