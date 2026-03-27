'use client';

import React, { useState } from 'react';
import Modal from './Modal';
import { Document } from '@/types';
import { createDocument } from '@/lib/services';
import { useAuth } from '@/hooks/useAuth';

interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const DocumentModal: React.FC<DocumentModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Document>>({
    name: '',
    category: 'borrower',
    type: 'PDF',
    size: '0 KB',
    file_url: 'https://example.com/placeholder.pdf', // Placeholder for real upload
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      await createDocument({ ...formData, owner_id: user.id });
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving document:', error);
      alert('Failed to save document.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upload New Document">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Document Name</label>
          <input
            type="text"
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Tax Return 2023"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Category</label>
            <select
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.category || ''}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="borrower">Borrower</option>
              <option value="loan">Loan</option>
              <option value="agent">Agent</option>
              <option value="marketing">Marketing</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">File Type</label>
            <select
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.type || ''}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="PDF">PDF</option>
              <option value="DOCX">DOCX</option>
              <option value="XLSX">XLSX</option>
              <option value="JPG">JPG/PNG</option>
            </select>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">File URL (Mock Upload)</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            value={formData.file_url || ''}
            onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
            placeholder="https://example.com/file.pdf"
          />
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm border rounded-lg hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Uploading...' : 'Upload Document'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default DocumentModal;
