"use client";

import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { Loan } from '@/types';
import { createLoan, updateLoan } from '@/lib/services';
import { useAuth } from '@/hooks/useAuth';

interface LoanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  loan?: Loan;
}

export default function LoanModal({ isOpen, onClose, onSuccess, loan }: LoanModalProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState<Partial<Loan>>({
    borrower_name: '',
    loan_amount: 0,
    loan_type: 'Conventional',
    status: 'New',
    interest_rate: 6.5,
    property_address: '',
    closing_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (loan) {
      setFormData({
        borrower_name: loan.borrower_name || '',
        loan_amount: loan.loan_amount || 0,
        loan_type: loan.loan_type || 'Conventional',
        status: loan.status || 'New',
        interest_rate: loan.interest_rate || 6.5,
        property_address: loan.property_address || '',
        closing_date: loan.closing_date ? loan.closing_date.split('T')[0] : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });
    } else {
      setFormData({
        borrower_name: '',
        loan_amount: 0,
        loan_type: 'Conventional',
        status: 'New',
        interest_rate: 6.5,
        property_address: '',
        closing_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });
    }
  }, [loan, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      if (loan) {
        await updateLoan(loan.id, formData);
      } else {
        await createLoan({ ...formData, owner_id: user.id });
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving loan:', error);
      alert('Failed to save loan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={loan ? "Edit Loan Application" : "New Loan Application"}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Borrower Name</label>
          <input
            required
            type="text"
            value={formData.borrower_name || ''}
            onChange={(e) => setFormData({ ...formData, borrower_name: e.target.value })}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all"
            placeholder="John Doe"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Loan Amount ($)</label>
            <input
              required
              type="number"
              value={formData.loan_amount ?? ''}
              onChange={(e) => setFormData({ ...formData, loan_amount: Number(e.target.value) })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="450000"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Interest Rate (%)</label>
            <input
              required
              type="number"
              step="0.125"
              value={formData.interest_rate ?? ''}
              onChange={(e) => setFormData({ ...formData, interest_rate: Number(e.target.value) })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="6.5"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Loan Type</label>
            <select
              value={formData.loan_type || 'Conventional'}
              onChange={(e) => setFormData({ ...formData, loan_type: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all"
            >
              <option value="Conventional">Conventional</option>
              <option value="FHA">FHA</option>
              <option value="VA">VA</option>
              <option value="Jumbo">Jumbo</option>
              <option value="USDA">USDA</option>
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
              <option value="Pre-Qualified">Pre-Qualified</option>
              <option value="In Processing">In Processing</option>
              <option value="Underwriting">Underwriting</option>
              <option value="Approved">Approved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Property Address</label>
          <input
            type="text"
            value={formData.property_address || ''}
            onChange={(e) => setFormData({ ...formData, property_address: e.target.value })}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all"
            placeholder="123 Main St, Anytown, ST 12345"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estimated Closing Date</label>
          <input
            required
            type="date"
            value={formData.closing_date ? formData.closing_date.split('T')[0] : ''}
            onChange={(e) => setFormData({ ...formData, closing_date: e.target.value })}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all"
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
            {loading ? 'Creating...' : 'Create Loan'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
