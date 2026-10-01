import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Building2,
  Briefcase,
  FileText,
  Shield,
  Activity,
  CheckCircle2,
  UserCheck,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getStats().then((res) => {
      if (res.success && res.data) {
        setStats(res.data);
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <LoadingSpinner text="Aggregating platform system metrics..." />;
  }

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 bg-indigo-500/20 border border-indigo-400/30 px-3 py-1 rounded-full text-xs font-semibold text-indigo-300">
            <Shield className="w-3.5 h-3.5 text-indigo-400" />
            <span>Root System Administrator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Platform Master Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Real-time platform metrics, user access management, corporate directory, and system health.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <Link
            to="/admin/users"
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors"
          >
            Manage Users
          </Link>
          <Link
            to="/admin/companies"
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors border border-white/10"
          >
            Manage Companies
          </Link>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
            <Users className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold text-slate-500">Total Registered Users</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">{stats?.totalUsers || 0}</h3>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">
            {stats?.activeUsers || 0} active accounts
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-3">
            <UserCheck className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold text-slate-500">Candidates</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">{stats?.totalCandidates || 0}</h3>
          <p className="text-[11px] text-slate-400 mt-1">Job seekers</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
            <Building2 className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold text-slate-500">Registered Companies</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">{stats?.totalCompanies || 0}</h3>
          <p className="text-[11px] text-slate-400 mt-1">{stats?.totalRecruiters || 0} recruiters</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
            <Briefcase className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold text-slate-500">Jobs & Applications</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">{stats?.totalJobs || 0}</h3>
          <p className="text-[11px] text-indigo-600 font-semibold mt-1">
            {stats?.totalApplications || 0} total applications
          </p>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/admin/users"
          className="bg-white p-6 rounded-3xl border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition-all group"
        >
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
            User Access Management
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Inspect all system accounts, deactivate or activate user permissions, and view role credentials.
          </p>
        </Link>

        <Link
          to="/admin/companies"
          className="bg-white p-6 rounded-3xl border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition-all group"
        >
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Building2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
            Corporate Organizations
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Register new employer companies, edit organizational records, and monitor recruitment operations.
          </p>
        </Link>

        <Link
          to="/admin/jobs"
          className="bg-white p-6 rounded-3xl border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition-all group"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Briefcase className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
            Platform Job Listings
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Audit and moderate all job postings across the entire portal ecosystem.
          </p>
        </Link>
      </div>
    </div>
  );
};
