"use client";

import React, { useState, useEffect } from 'react';
import { 
  User, 
  Bell, 
  Lock, 
  Shield, 
  CreditCard, 
  Globe, 
  Mail,
  Save,
  Camera,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { getProfile, updateProfile } from '@/lib/services';
import { Profile } from '@/types';

export default function Settings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [notifications, setNotifications] = useState({
    email_leads: true,
    email_tasks: true,
    email_marketing: false,
    push_leads: true,
    push_tasks: false,
  });

  useEffect(() => {
    if (user?.id) {
      fetchProfile();
    }
  }, [user?.id]);

  async function fetchProfile() {
    setLoading(true);
    try {
      const data = await getProfile(user!.id);
      setProfile(data);
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!user?.id || !profile) return;
    setSaving(true);
    try {
      await updateProfile(user.id, {
        full_name: profile.full_name,
        avatar_url: profile.avatar_url,
      });
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
    } finally {
      setSaving(false);
    }
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ];

  return (
    <div className="space-y-8 max-w-[1000px] mx-auto">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Settings</h1>
        <p className="text-slate-500 text-sm font-medium mt-1">Manage your account preferences and system configuration.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                activeTab === tab.id 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
          {activeTab === 'profile' && (
            <div className="p-8 space-y-8">
              <div className="flex items-center gap-6 pb-8 border-b border-slate-100">
                <div className="relative group">
                  <div className="w-24 h-24 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-2xl border-2 border-dashed border-indigo-200">
                    {profile?.full_name?.[0] || user?.email?.[0].toUpperCase()}
                  </div>
                  <button className="absolute -bottom-2 -right-2 p-2 bg-white border border-slate-200 rounded-xl shadow-sm text-slate-600 hover:text-indigo-600 transition-all">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Profile Picture</h3>
                  <p className="text-slate-500 text-xs font-medium mt-1">PNG, JPG or GIF. Max 2MB.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                  <input 
                    type="text" 
                    value={profile?.full_name || ''}
                    onChange={(e) => setProfile(prev => prev ? { ...prev, full_name: e.target.value } : null)}
                    className="w-full px-4 py-3 bg-slate-50 border-transparent rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="email" 
                      value={user?.email || ''}
                      disabled
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border-transparent rounded-xl text-sm font-medium text-slate-400 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-end">
                <button 
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 bg-indigo-600 rounded-xl text-sm font-bold text-white hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="p-8 space-y-8">
              <div>
                <h3 className="text-lg font-black text-slate-900">Notification Preferences</h3>
                <p className="text-slate-500 text-sm font-medium mt-1">Choose how you want to be notified about important updates.</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Notifications</h4>
                  {[
                    { id: 'email_leads', label: 'New Leads', desc: 'Get notified when a new lead is assigned to you.' },
                    { id: 'email_tasks', label: 'Task Reminders', desc: 'Receive daily summaries of your upcoming tasks.' },
                    { id: 'email_marketing', label: 'Marketing Updates', desc: 'Stay informed about new features and updates.' },
                  ].map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div>
                        <p className="text-sm font-bold text-slate-900">{item.label}</p>
                        <p className="text-xs text-slate-500 font-medium">{item.desc}</p>
                      </div>
                      <button 
                        onClick={() => setNotifications(prev => ({ ...prev, [item.id]: !prev[item.id as keyof typeof notifications] }))}
                        className={cn(
                          "w-12 h-6 rounded-full transition-all relative",
                          notifications[item.id as keyof typeof notifications] ? "bg-indigo-600" : "bg-slate-200"
                        )}
                      >
                        <div className={cn(
                          "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                          notifications[item.id as keyof typeof notifications] ? "left-7" : "left-1"
                        )} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Push Notifications</h4>
                  {[
                    { id: 'push_leads', label: 'Real-time Lead Alerts', desc: 'Instant browser notifications for new leads.' },
                    { id: 'push_tasks', label: 'Task Deadlines', desc: 'Alerts for tasks due in the next hour.' },
                  ].map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div>
                        <p className="text-sm font-bold text-slate-900">{item.label}</p>
                        <p className="text-xs text-slate-500 font-medium">{item.desc}</p>
                      </div>
                      <button 
                        onClick={() => setNotifications(prev => ({ ...prev, [item.id]: !prev[item.id as keyof typeof notifications] }))}
                        className={cn(
                          "w-12 h-6 rounded-full transition-all relative",
                          notifications[item.id as keyof typeof notifications] ? "bg-indigo-600" : "bg-slate-200"
                        )}
                      >
                        <div className={cn(
                          "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                          notifications[item.id as keyof typeof notifications] ? "left-7" : "left-1"
                        )} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-end">
                <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 rounded-xl text-sm font-bold text-white hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                  <Save className="w-4 h-4" />
                  Save Preferences
                </button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="p-8 space-y-8">
              <div>
                <h3 className="text-lg font-black text-slate-900">Security Settings</h3>
                <p className="text-slate-500 text-sm font-medium mt-1">Manage your password and account security options.</p>
              </div>

              <div className="space-y-6">
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600">
                      <Shield className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-slate-900">Two-Factor Authentication</h4>
                      <p className="text-xs text-slate-500 font-medium mt-1">Add an extra layer of security to your account by requiring more than just a password to log in.</p>
                      <button className="mt-4 px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all">
                        Enable 2FA
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Change Password</h4>
                  <div className="grid grid-cols-1 gap-4">
                    <input 
                      type="password" 
                      placeholder="Current Password"
                      className="w-full px-4 py-3 bg-slate-50 border-transparent rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                    <input 
                      type="password" 
                      placeholder="New Password"
                      className="w-full px-4 py-3 bg-slate-50 border-transparent rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                    <input 
                      type="password" 
                      placeholder="Confirm New Password"
                      className="w-full px-4 py-3 bg-slate-50 border-transparent rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-end">
                <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 rounded-xl text-sm font-bold text-white hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                  <Save className="w-4 h-4" />
                  Update Password
                </button>
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="p-8 space-y-8">
              <div>
                <h3 className="text-lg font-black text-slate-900">Subscription & Billing</h3>
                <p className="text-slate-500 text-sm font-medium mt-1">Manage your plan, payment methods, and billing history.</p>
              </div>

              <div className="p-6 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <span className="px-3 py-1 bg-white/20 rounded-lg text-[10px] font-black uppercase tracking-widest">Current Plan</span>
                    <span className="text-2xl font-black">$49/mo</span>
                  </div>
                  <h4 className="text-xl font-black mb-1">Professional Plan</h4>
                  <p className="text-indigo-100 text-sm font-medium mb-6">Your next billing date is April 15, 2026.</p>
                  <div className="flex gap-3">
                    <button className="px-4 py-2 bg-white text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-50 transition-all">
                      Upgrade Plan
                    </button>
                    <button className="px-4 py-2 bg-indigo-500 text-white rounded-lg text-xs font-bold hover:bg-indigo-400 transition-all">
                      Manage Subscription
                    </button>
                  </div>
                </div>
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Payment Method</h4>
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-8 bg-slate-100 rounded flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Visa ending in 4242</p>
                      <p className="text-xs text-slate-500 font-medium">Expires 12/28</p>
                    </div>
                  </div>
                  <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700">Edit</button>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recent Invoices</h4>
                <div className="divide-y divide-slate-100">
                  {[
                    { date: 'Mar 15, 2026', amount: '$49.00', status: 'Paid' },
                    { date: 'Feb 15, 2026', amount: '$49.00', status: 'Paid' },
                    { date: 'Jan 15, 2026', amount: '$49.00', status: 'Paid' },
                  ].map((invoice, i) => (
                    <div key={i} className="py-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-slate-900">{invoice.date}</p>
                        <p className="text-xs text-slate-500 font-medium">{invoice.amount}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase rounded-lg tracking-wider">
                          {invoice.status}
                        </span>
                        <button className="p-2 text-slate-400 hover:text-indigo-600 transition-all">
                          <Globe className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
