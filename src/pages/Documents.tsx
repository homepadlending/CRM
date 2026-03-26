import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Upload, 
  MoreVertical, 
  Folder, 
  Download, 
  Trash2,
  File,
  Clock
} from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import { motion } from 'motion/react';

interface DocFile {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'jpg' | 'png';
  size: string;
  updated_at: string;
  category: string;
  owner: string;
}

const mockFiles: DocFile[] = [
  { id: '1', name: '1003_Loan_Application_Henderson.pdf', type: 'pdf', size: '2.4 MB', updated_at: '2024-03-25T10:00:00Z', category: 'Application', owner: 'Ryan' },
  { id: '2', name: 'W2_2023_Henderson_John.pdf', type: 'pdf', size: '1.1 MB', updated_at: '2024-03-24T14:00:00Z', category: 'Income', owner: 'Ryan' },
  { id: '3', name: 'Purchase_Agreement_MainSt.pdf', type: 'pdf', size: '4.5 MB', updated_at: '2024-03-23T09:00:00Z', category: 'Property', owner: 'Ryan' },
  { id: '4', name: 'Credit_Report_Henderson.pdf', type: 'pdf', size: '0.8 MB', updated_at: '2024-03-22T11:00:00Z', category: 'Credit', owner: 'System' },
  { id: '5', name: 'Bank_Statement_Feb2024.pdf', type: 'pdf', size: '3.2 MB', updated_at: '2024-03-21T16:00:00Z', category: 'Assets', owner: 'Ryan' },
];

export default function Documents() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Application', 'Income', 'Assets', 'Credit', 'Property', 'Legal'];

  const filteredFiles = mockFiles.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || file.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Documents</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Secure storage for all loan and client documentation.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 rounded-xl text-sm font-bold text-white hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
          <Upload className="w-4 h-4" />
          Upload File
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar / Categories */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-2">Categories</h3>
            <div className="space-y-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-bold transition-all",
                    selectedCategory === cat 
                      ? "bg-indigo-50 text-indigo-600" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Folder className={cn("w-4 h-4", selectedCategory === cat ? "text-indigo-600" : "text-slate-400")} />
                    {cat}
                  </div>
                  {selectedCategory === cat && <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-lg font-black leading-tight">Storage Usage</h3>
              <p className="text-indigo-100 text-xs mt-1 font-medium">12.4 GB of 50 GB used</p>
              <div className="mt-4 h-2 bg-indigo-500/50 rounded-full overflow-hidden">
                <div className="h-full bg-white w-1/4 rounded-full" />
              </div>
              <button className="mt-4 text-[10px] font-black uppercase tracking-wider bg-white/10 hover:bg-white/20 py-2 px-4 rounded-lg transition-all">
                Upgrade Plan
              </button>
            </div>
            <FileText className="absolute -right-4 -bottom-4 w-24 h-24 text-white/10 rotate-12" />
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">File Name</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Size</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Updated</th>
                    <th className="px-6 py-4 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredFiles.map((file) => (
                    <motion.tr 
                      key={file.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                            file.type === 'pdf' ? "bg-rose-50 text-rose-600" : "bg-blue-50 text-blue-600"
                          )}>
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate max-w-[200px]">
                              {file.name}
                            </div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-0.5">
                              {file.owner}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-black uppercase tracking-wider">
                          {file.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-500">
                        {file.size}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-sm font-medium text-slate-500">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {formatDate(file.updated_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                          <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all">
                            <Download className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredFiles.length === 0 && (
              <div className="py-20 text-center">
                <File className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-500 font-bold">No documents found matching your search.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
