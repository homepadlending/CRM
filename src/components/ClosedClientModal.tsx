"use client";

import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { ClosedClient, Agent } from '@/types';
import { createClosedClient, updateClosedClient, getAgents } from '@/lib/services';
import { useAuth } from '@/hooks/useAuth';

interface ClosedClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  client?: ClosedClient;
}

export default function ClosedClientModal({ isOpen, onClose, onSuccess, client }: ClosedClientModalProps) {
  const { user } = useAuth();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [formData, setFormData] = useState<Partial<ClosedClient>>({
    client_name: '',
    email: '',
    phone: '',
    property_address: '',
    loan_amount: 0,
    interest_rate: 0,
    loan_type: 'Conventional',
    referral_agent_id: '',
    agent_name: '',
    closed_at: new Date().toISOString().split('T')[0],
    notes: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchAgents();
    }
  }, [isOpen]);

  useEffect(() => {
    if (client) {
      setFormData({
        client_name: client.client_name || '',
        email: client.email || '',
        phone: client.phone || '',
        property_address: client.property_address || '',
        loan_amount: client.loan_amount || 0,
        interest_rate: client.interest_rate || 0,
        loan_type: client.loan_type || 'Conventional',
        referral_agent_id: client.referral_agent_id || '',
        agent_name: client.agent_name || '',
        closed_at: client.closed_at ? new Date(client.closed_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        notes: client.notes || '',
      });
    } else {
      setFormData({
        client_name: '',
        email: '',
        phone: '',
        property_address: '',
        loan_amount: 0,
        interest_rate: 0,
        loan_type: 'Conventional',
        referral_agent_id: '',
        agent_name: '',
        closed_at: new Date().toISOString().split('T')[0],
        notes: '',
      });
    }
  }, [client, isOpen]);

  const fetchAgents = async () => {
    try {
      const data = await getAgents();
      setAgents(data);
    } catch (error) {
      console.error('Error fetching agents:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      const selectedAgent = agents.find(a => a.id === formData.referral_agent_id);
      const finalData = {
        ...formData,
        owner_id: user.id,
        agent_name: selectedAgent ? `${selectedAgent.first_name} ${selectedAgent.last_name}` : formData.agent_name
      };
      
      if (client) {
        await updateClosedClient(client.id, finalData);
      } else {
        await createClosedClient(finalData);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving closed client:', error);
      alert('Failed to save closed client.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={client ? "Edit Closed Client" : "Add Closed Client"}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Client Name</label>
            <input
              type="text"
              required
              value={formData.client_name}
              onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border-transparent rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="Full Name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Email</label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border-transparent rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all"
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Phone</label>
              <input
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border-transparent rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all"
                placeholder="(555) 000-0000"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Property Address</label>
            <input
              type="text"
              value={formData.property_address || ''}
              onChange={(e) => setFormData({ ...formData, property_address: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border-transparent rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="123 Main St, City, ST"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Loan Amount</label>
              <input
                type="number"
                required
                value={formData.loan_amount ?? ''}
                onChange={(e) => setFormData({ ...formData, loan_amount: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-slate-50 border-transparent rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Interest Rate (%)</label>
              <input
                type="number"
                step="0.001"
                value={formData.interest_rate ?? ''}
                onChange={(e) => setFormData({ ...formData, interest_rate: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-slate-50 border-transparent rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all"
                placeholder="0.000"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Loan Type</label>
              <select
                value={formData.loan_type || ''}
                onChange={(e) => setFormData({ ...formData, loan_type: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border-transparent rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all"
              >
                <option value="Conventional">Conventional</option>
                <option value="FHA">FHA</option>
                <option value="VA">VA</option>
                <option value="Jumbo">Jumbo</option>
                <option value="Non-QM">Non-QM</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Closed Date</label>
              <input
                type="date"
                required
                value={formData.closed_at}
                onChange={(e) => setFormData({ ...formData, closed_at: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border-transparent rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Referral Agent</label>
            <select
              value={formData.referral_agent_id || ''}
              onChange={(e) => setFormData({ ...formData, referral_agent_id: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border-transparent rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all"
            >
              <option value="">No Agent</option>
              {agents.map(agent => (
                <option key={agent.id} value={agent.id}>
                  {agent.first_name} {agent.last_name} ({agent.brokerage})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Notes</label>
            <textarea
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border-transparent rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all"
              rows={3}
              placeholder="Additional details..."
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50"
          >
            {loading ? 'Saving...' : (client ? 'Update Client' : 'Add Client')}
          </button>
        </div>
      </form>
    </Modal>
  );
}
