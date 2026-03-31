"use client";

import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { Agent, Company } from '@/types';
import { createAgent, updateAgent, getCompanies } from '@/lib/services';
import { useAuth } from '@/hooks/useAuth';

interface AgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  agent?: Agent;
}

export default function AgentModal({ isOpen, onClose, onSuccess, agent }: AgentModalProps) {
  const { user } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [formData, setFormData] = useState<Partial<Agent>>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    company_id: '',
    brokerage: '',
    relationship_status: 'active',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchCompanies();
    }
  }, [isOpen]);

  useEffect(() => {
    if (agent) {
      setFormData({
        first_name: agent.first_name || '',
        last_name: agent.last_name || '',
        email: agent.email || '',
        phone: agent.phone || '',
        company_id: agent.company_id || '',
        brokerage: agent.brokerage || '',
        relationship_status: agent.relationship_status || 'active',
      });
    } else {
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        company_id: '',
        brokerage: '',
        relationship_status: 'active',
      });
    }
  }, [agent, isOpen]);

  const fetchCompanies = async () => {
    try {
      const data = await getCompanies();
      setCompanies(data);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      // If a company is selected, we might want to sync the brokerage name for legacy purposes
      const selectedCompany = companies.find(c => c.id === formData.company_id);
      const finalData = {
        ...formData,
        owner_id: user.id,
        brokerage: selectedCompany ? selectedCompany.name : formData.brokerage
      };
      
      if (agent) {
        await updateAgent(agent.id, finalData);
      } else {
        await createAgent(finalData);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving agent:', error);
      alert('Failed to save agent.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={agent ? "Edit Agent Partner" : "Add New Agent Partner"}
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
              placeholder="Sarah"
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
              placeholder="Jenkins"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</label>
            <input
              required
              type="email"
              value={formData.email || ''}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="sarah@eliterealty.com"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone</label>
            <input
              type="tel"
              value={formData.phone || ''}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="(555) 111-2222"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Company / Brokerage</label>
          <div className="flex gap-2">
            <select
              value={formData.company_id || ''}
              onChange={(e) => setFormData({ ...formData, company_id: e.target.value })}
              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all"
            >
              <option value="">Select Company</option>
              {companies.map(company => (
                <option key={company.id} value={company.id}>{company.name}</option>
              ))}
            </select>
            {!formData.company_id && (
              <input
                type="text"
                value={formData.brokerage || ''}
                onChange={(e) => setFormData({ ...formData, brokerage: e.target.value })}
                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all"
                placeholder="Or type brokerage name"
              />
            )}
          </div>
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
            {loading ? 'Adding...' : 'Add Agent'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
