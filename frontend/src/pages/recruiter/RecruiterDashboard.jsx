import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Users,
  CheckCircle2,
  Calendar,
  PlusCircle,
  TrendingUp,
  Building2,
  ArrowRight,
  Sparkles,
  Video,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { recruiterService } from '../../services/recruiterService';
import { applicationService } from '../../services/applicationService';
import { interviewService } from '../../services/interviewService';
import { jobService } from '../../services/jobService';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { formatDate } from '../../utils/helpers';

export const RecruiterDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplications: 0,
    shortlistedCandidates: 0,
    upcomingInterviews: 0,
  });
  const [recentApplications, setRecentApplications] = useState([]);
  const [upcomingInterviews, setUpcomingInterviews] = useState([]);
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [statsRes, appsRes, interRes, jobsRes] = await Promise.all([
          recruiterService.getDashboardStats(),
          applicationService.getRecruiterApplications({ size: 5 }),
          interviewService.getUpcomingInterviews(),
          recruiterService.getMyJobs(0, 4),
        ]);

        if (statsRes.success) setStats(statsRes.data);
        if (appsRes.success) setRecentApplications(appsRes.data);
        if (interRes.success) setUpcomingInterviews(interRes.data);
        if (jobsRes.success) setMyJobs(jobsRes.data);
      } catch (err) {
        console.error('Failed to load recruiter dashboard', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading recruiter dashboard metrics..." />;
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 bg-indigo-500/20 border border-indigo-400/30 px-3 py-1 rounded-full text-xs font-semibold text-indigo-300">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Recruiter Operations Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Recruiter Workspace • {user?.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Manage your open jobs, screen talent, shortlist qualified engineers, and schedule interviews.
          </p>
        </div>

        <Link
          to="/recruiter/create-job"
          className="inline-flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-2xl font-bold text-xs transition-all shadow-md shadow-indigo-600/30 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post a New Job</span>
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Active Jobs</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{stats.activeJobs}</h3>
            <Link to="/recruiter/jobs" className="text-[11px] font-bold text-indigo-600 hover:underline mt-1 inline-block">
              Manage jobs →
            </Link>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Briefcase className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Total Applicants</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{stats.totalApplications}</h3>
            <Link to="/recruiter/applications" className="text-[11px] font-bold text-indigo-600 hover:underline mt-1 inline-block">
              Review pool →
            </Link>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Shortlisted</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{stats.shortlistedCandidates}</h3>
            <span className="text-[11px] font-semibold text-emerald-600 mt-1 inline-block">
              Pipeline active
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Upcoming Calls</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{stats.upcomingInterviews}</h3>
            <Link to="/recruiter/interviews" className="text-[11px] font-bold text-indigo-600 hover:underline mt-1 inline-block">
              Schedule →
            </Link>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Grid: Recent Applications & Active Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Recent Applications */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Recent Candidate Applications</h3>
            <Link to="/recruiter/applications" className="text-xs font-bold text-indigo-600 hover:text-indigo-800">
              View All Applications
            </Link>
          </div>

          {recentApplications.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-200/80 text-center text-xs text-slate-400">
              No applications received yet for your posted jobs.
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200/80 divide-y divide-slate-100 overflow-hidden shadow-xs">
              {recentApplications.map((app) => (
                <div key={app.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-bold text-slate-900">{app.candidateName}</h4>
                      <Badge status={app.status}>{app.status.replace('_', ' ')}</Badge>
                    </div>
                    <p className="text-xs text-slate-500">
                      Applied for <span className="font-semibold text-slate-700">{app.jobTitle}</span> • {formatDate(app.appliedAt)}
                    </p>
                  </div>

                  <Link
                    to="/recruiter/applications"
                    className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors self-start sm:self-center"
                  >
                    Review Profile →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Col: Active Jobs & Interviews */}
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">My Job Postings</h3>
              <Link to="/recruiter/jobs" className="text-xs font-bold text-indigo-600 hover:text-indigo-800">
                Manage
              </Link>
            </div>

            <div className="space-y-3">
              {myJobs.length === 0 ? (
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 text-center text-xs text-slate-400">
                  You haven't posted any jobs yet.
                </div>
              ) : (
                myJobs.map((job) => (
                  <div key={job.id} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{job.title}</h4>
                      <Badge status={job.status}>{job.status}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                      <span>{job.applicationsCount} applicants</span>
                      <Link to={`/jobs/${job.id}`} className="font-bold text-indigo-600 hover:underline">
                        View Details →
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
