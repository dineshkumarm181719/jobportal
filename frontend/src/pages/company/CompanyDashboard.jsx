import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Users, Briefcase, Plus, ExternalLink, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { companyService } from '../../services/companyService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Badge } from '../../components/common/Badge';

export const CompanyDashboard = () => {
  const { user } = useAuth();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCompanyData = async () => {
      try {
        const companyId = user?.companyId || 1;
        const [compRes, jobsRes, recsRes] = await Promise.all([
          companyService.getCompanyById(companyId),
          companyService.getCompanyJobs(companyId, { size: 5 }),
          companyService.getCompanyRecruiters(companyId, { size: 5 }),
        ]);

        if (compRes.success) setCompany(compRes.data);
        if (jobsRes.success) setJobs(jobsRes.data);
        if (recsRes.success) setRecruiters(recsRes.data);
      } catch (err) {
        console.error('Failed to load company dashboard', err);
      } finally {
        setLoading(false);
      }
    };
    loadCompanyData();
  }, [user]);

  if (loading) {
    return <LoadingSpinner text="Loading company operations portal..." />;
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 bg-indigo-500/20 border border-indigo-400/30 px-3 py-1 rounded-full text-xs font-semibold text-indigo-300">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Company Administrator Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            {company?.name || 'Company Dashboard'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            {company?.description || 'Manage your corporate profile, recruiters, and job listings.'}
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <Link
            to="/company/recruiters"
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors border border-white/10"
          >
            Manage Recruiters
          </Link>
          <Link
            to="/company/profile"
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors shadow-xs"
          >
            Edit Profile
          </Link>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Corporate Recruiters</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{company?.recruitersCount || 0}</h3>
            <Link to="/company/recruiters" className="text-[11px] font-bold text-indigo-600 hover:underline mt-2 inline-block">
              View team →
            </Link>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Open Job Postings</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{company?.openJobsCount || 0}</h3>
            <Link to="/company/jobs" className="text-[11px] font-bold text-indigo-600 hover:underline mt-2 inline-block">
              View listings →
            </Link>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Briefcase className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Headquarters</p>
            <h3 className="text-base font-bold text-slate-900 mt-1 line-clamp-1">{company?.location || 'Remote'}</h3>
            <p className="text-[11px] text-slate-400 mt-2">{company?.industry || 'Technology'}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Active Jobs & Recruiters Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Jobs */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">Company Jobs</h3>
            <Link to="/company/jobs" className="text-xs font-bold text-indigo-600 hover:underline">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {jobs.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">No active company jobs.</p>
            ) : (
              jobs.map((job) => (
                <div key={job.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{job.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{job.applicationsCount} Candidates Applied</p>
                  </div>
                  <Badge status={job.status}>{job.status}</Badge>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recruiters */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">Talent Acquisition Team</h3>
            <Link to="/company/recruiters" className="text-xs font-bold text-indigo-600 hover:underline">
              Manage Team
            </Link>
          </div>
          <div className="space-y-3">
            {recruiters.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">No recruiters assigned yet.</p>
            ) : (
              recruiters.map((rec) => (
                <div key={rec.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                      {rec.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{rec.name}</h4>
                      <p className="text-[11px] text-slate-500">{rec.designation}</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400">{rec.postedJobsCount} Jobs</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
