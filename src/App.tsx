import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { AlertCircle, RefreshCw } from 'lucide-react';

// Pages
import Dashboard from '@/pages/Dashboard';
import Leads from '@/pages/Leads';
import LeadDetail from '@/pages/LeadDetail';
import Applications from '@/pages/Applications';
import Loans from '@/pages/Loans';
import LoanDetail from '@/pages/LoanDetail';
import ClosedClients from '@/pages/ClosedClients';
import ClosedClientDetail from '@/pages/ClosedClientDetail';
import Agents from '@/pages/Agents';
import AgentDetail from '@/pages/AgentDetail';
import Campaigns from '@/pages/Campaigns';
import Tasks from '@/pages/Tasks';
import Documents from '@/pages/Documents';
import Reports from '@/pages/Reports';
import Settings from '@/pages/Settings';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';

export default function App() {
  const { user, loading, error } = useAuth();

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-50 rounded-2xl mb-6">
            <AlertCircle className="w-8 h-8 text-rose-600" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">Configuration Error</h1>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed">
            {error}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={user ? <Navigate to="/dashboard" replace /> : <Signup />} />

        {/* Protected CRM Routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/leads" element={
          <ProtectedRoute>
            <Layout>
              <Leads />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/leads/:id" element={
          <ProtectedRoute>
            <Layout>
              <LeadDetail />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/applications" element={
          <ProtectedRoute>
            <Layout>
              <Applications />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/loans" element={
          <ProtectedRoute>
            <Layout>
              <Loans />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/loans/:id" element={
          <ProtectedRoute>
            <Layout>
              <LoanDetail />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/closed-clients" element={
          <ProtectedRoute>
            <Layout>
              <ClosedClients />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/closed-clients/:id" element={
          <ProtectedRoute>
            <Layout>
              <ClosedClientDetail />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/agents" element={
          <ProtectedRoute>
            <Layout>
              <Agents />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/agents/:id" element={
          <ProtectedRoute>
            <Layout>
              <AgentDetail />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/campaigns" element={
          <ProtectedRoute>
            <Layout>
              <Campaigns />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/tasks" element={
          <ProtectedRoute>
            <Layout>
              <Tasks />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/documents" element={
          <ProtectedRoute>
            <Layout>
              <Documents />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/reports" element={
          <ProtectedRoute>
            <Layout>
              <Reports />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <Layout>
              <Settings />
            </Layout>
          </ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}
