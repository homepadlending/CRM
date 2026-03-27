'use client';

import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { Company } from '@/types';
import { createCompany, updateCompany } from '@/lib/services';
import { useAuth } from '@/hooks/useAuth';

interface CompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  company?: Company | null;
}

const CompanyModal: React.FC<CompanyModalProps> = ({ isOpen, onClose, onSuccess, company }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Company>>({
    name: '',
    type: '',
    website: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    notes: '',
  });

  useEffect(() => {
    if (company) {
      setFormData(company);
    } else {
      setFormData({
        name: '',
        type: '',
        website: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        notes: '',
      });
    }
  }, [company]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      if (company?.id) {
        await updateCompany(company.id, formData);
      } else {
        await createCompany({ ...formData, owner_id: user.id });
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving company:', error);
      alert('Failed to save company. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={company ? 'Edit Company' : 'Add New Company'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Company Name *</label>
            <input
              type="text"
              required
              className="w-full p-2 border rounded-md"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Type</label>
            <select
              className="w-full p-2 border rounded-md"
              value={formData.type || ''}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="">Select Type</option>
              <option value="Real Estate">Real Estate</option>
              <option value="Insurance">Insurance</option>
              <option value="Financial Planning">Financial Planning</option>
              <option value="Legal">Legal</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Website</label>
            <input
              type="url"
              className="w-full p-2 border rounded-md"
              value={formData.website || ''}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Phone</label>
            <input
              type="tel"
              className="w-full p-2 border rounded-md"
              value={formData.phone || ''}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          <div className="col-span-2 space-y-2">
            <label className="text-sm font-medium">Address</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              value={formData.address || ''}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">City</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              value={formData.city || ''}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">State</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              value={formData.state || ''}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Zip Code</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              value={formData.zip || ''}
              onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
            />
          </div>
          <div className="col-span-2 space-y-2">
            <label className="text-sm font-medium">Notes</label>
            <textarea
              className="w-full p-2 border rounded-md"
              rows={3}
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm border rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : company ? 'Update Company' : 'Add Company'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CompanyModal;
