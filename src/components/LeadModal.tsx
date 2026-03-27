"use client";

import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { Lead } from '@/types';
import { createLead, updateLead } from '@/lib/services';
import { useAuth } from '@/hooks/useAuth';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  lead?: Lead | null;
}

export default function LeadModal({ isOpen, onClose, onSuccess, lead }: LeadModalProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState<Partial<Lead>>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    source: '',
    status: 'New',
    notes: '',
    score: 50
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (lead) {
      setFormData(lead);
    } else {
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        source: '',
        status: 'New',
        notes: '',
        score: 50
      });
    }
  }, [lead, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      if (lead?.id) {
        await updateLead(lead.id, formData);
      } else {
        await createLead({ ...formData, owner_id: user.id });
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving lead:', error);
      alert('Failed to save lead. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={lead ? 'Edit Lead' : 'Add New Lead'}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">First Name</label>
            <input
              required
              type="text"
              value={formData.first_name || ''}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="John"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Name</label>
            <input
              required
              type="text"
              value={formData.last_name || ''}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="Doe"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</label>
            <input
              type="email"
              value={formData.email || ''}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="john@example.com"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone</label>
            <input
              type="tel"
              value={formData.phone || ''}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="(555) 000-0000"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Source</label>
            <select
              value={formData.source || ''}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all"
            >
              <option value="">Select Source</option>
              <option value="Zillow">Zillow</option>
              <option value="Facebook Ads">Facebook Ads</option>
              <option value="Google Search">Google Search</option>
              <option value="Referral">Referral</option>
              <option value="Website">Website</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</label>
            <select
              value={formData.status || 'New'}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all"
            >
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Pre-Qualified">Pre-Qualified</option>
              <option value="Pre-Approved">Pre-Approved</option>
              <option value="Nurture">Nurture</option>
              <option value="Dead">Dead</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Notes</label>
          <textarea
            value={formData.notes || ''}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all min-h-[100px]"
            placeholder="Add any additional details..."
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50"
          >
            {loading ? 'Saving...' : lead ? 'Update Lead' : 'Create Lead'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
