'use client';

import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Search, 
  Plus, 
  MoreVertical, 
  ExternalLink, 
  Phone, 
  MapPin,
  Trash2,
  Edit2,
  Filter
} from 'lucide-react';
import { Company } from '@/types';
import { getCompanies, deleteCompany } from '@/lib/services';
import CompanyModal from '@/components/CompanyModal';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const data = await getCompanies();
      setCompanies(data);
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this company?')) return;
    try {
      await deleteCompany(id);
      fetchCompanies();
    } catch (error) {
      console.error('Error deleting company:', error);
      alert('Failed to delete company.');
    }
  };

  const filteredCompanies = companies.filter(company => 
    company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.city?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = [
    { label: 'Total Partners', value: companies.length, icon: Building2, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Real Estate', value: companies.filter(c => c.type === 'Real Estate').length, icon: MapPin, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Financial Services', value: companies.filter(c => c.type === 'Financial Planning').length, icon: Building2, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Other Partners', value: companies.filter(c => !['Real Estate', 'Financial Planning'].includes(c.type || '')).length, icon: Filter, color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Companies & Partners</h1>
          <p className="text-gray-500">Manage your referral source organizations</p>
        </div>
        <button 
          onClick={() => {
            setSelectedCompany(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Company
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-4">
              <div className={`${stat.bg} p-3 rounded-lg`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-bottom border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search companies by name, type, or city..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg border border-gray-200">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-y border-gray-100">
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Company Name</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Type</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Location</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Contact</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Website</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">Loading companies...</td>
                </tr>
              ) : filteredCompanies.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">No companies found.</td>
                </tr>
              ) : (
                filteredCompanies.map((company) => (
                  <tr key={company.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className="font-medium text-gray-900">{company.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium">
                        {company.type || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {company.city && company.state ? `${company.city}, ${company.state}` : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      {company.phone ? (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="w-3 h-3" />
                          {company.phone}
                        </div>
                      ) : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      {company.website ? (
                        <a 
                          href={company.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline flex items-center gap-1 text-sm"
                        >
                          Visit <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => {
                            setSelectedCompany(company);
                            setIsModalOpen(true);
                          }}
                          className="p-1 text-gray-400 hover:text-blue-600"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(company.id)}
                          className="p-1 text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CompanyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchCompanies}
        company={selectedCompany}
      />
    </div>
  );
}
