"use client";

import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { Application } from '@/types';
import { createApplication, updateApplication } from '@/lib/services';
import { useAuth } from '@/hooks/useAuth';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  application?: Application;
}

export default function ApplicationModal({ isOpen, onClose, onSuccess, application }: ApplicationModalProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState<Partial<Application>>({
    borrower_name: '',
    email: '',
    phone: '',
    loan_purpose: 'Purchase',
    property_type: 'Single Family',
    estimated_value: 0,
    loan_amount: 0,
    loan_type: 'Conventional',
    credit_score: 700,
    status: 'Pending Review',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (application) {
      setFormData({
        borrower_name: application.borrower_name || '',
        email: application.email || '',
        phone: application.phone || '',
        loan_purpose: application.loan_purpose || 'Purchase',
        property_type: application.property_type || 'Single Family',
        estimated_value: application.estimated_value || 0,
        loan_amount: application.loan_amount || 0,
        loan_type: application.loan_type || 'Conventional',
        credit_score: application.credit_score || 700,
        status: application.status || 'Pending Review',
      });
    } else {
      setFormData({
        borrower_name: '',
        email: '',
        phone: '',
        loan_purpose: 'Purchase',
        property_type: 'Single Family',
        estimated_value: 0,
        loan_amount: 0,
        loan_type: 'Conventional',
        credit_score: 700,
        status: 'Pending Review',
      });
    }
  }, [application, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      const finalData = {
        ...formData,
        owner_id: user.id,
      };
      
      if (application) {
        await updateApplication(application.id, finalData);
      } else {
        await createApplication(finalData);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving application:', error);
      alert('Failed to save application.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={application ? "Edit Application" : "New Application"}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Borrower Name</label>
            <input
              type="text"
              required
              value={formData.borrower_name}
              onChange={(e) => setFormData({ ...formData, borrower_name: e.target.value })}
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Loan Purpose</label>
              <select
                value={formData.loan_purpose}
                onChange={(e) => setFormData({ ...formData, loan_purpose: e.target.value as any })}
                className="w-full px-4 py-3 bg-slate-50 border-transparent rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all"
              >
                <option value="Purchase">Purchase</option>
                <option value="Refinance">Refinance</option>
                <option value="Cash-out Refi">Cash-out Refi</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Property Type</label>
              <select
                value={formData.property_type}
                onChange={(e) => setFormData({ ...formData, property_type: e.target.value as any })}
                className="w-full px-4 py-3 bg-slate-50 border-transparent rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all"
              >
                <option value="Single Family">Single Family</option>
                <option value="Condo">Condo</option>
                <option value="Multi-Family">Multi-Family</option>
                <option value="Townhouse">Townhouse</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Loan Amount</label>
              <input
                type="number"
                required
                value={formData.loan_amount}
                onChange={(e) => setFormData({ ...formData, loan_amount: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-slate-50 border-transparent rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Estimated Value</label>
              <input
                type="number"
                value={formData.estimated_value}
                onChange={(e) => setFormData({ ...formData, estimated_value: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-slate-50 border-transparent rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all"
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Loan Type</label>
              <select
                value={formData.loan_type}
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
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Credit Score</label>
              <input
                type="number"
                value={formData.credit_score}
                onChange={(e) => setFormData({ ...formData, credit_score: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-slate-50 border-transparent rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all"
                placeholder="700"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border-transparent rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all"
            >
              <option value="Pending Review">Pending Review</option>
              <option value="Documents Needed">Documents Needed</option>
              <option value="In Processing">In Processing</option>
              <option value="Approved">Approved</option>
              <option value="Denied">Denied</option>
            </select>
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
            {loading ? 'Saving...' : (application ? 'Update Application' : 'Create Application')}
          </button>
        </div>
      </form>
    </Modal>
  );
}
