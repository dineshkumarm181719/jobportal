import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Calendar,
  CheckCircle2,
  Search,
  ArrowRight,
  Sparkles,
  Building2,
  Video,
  UserCheck,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { candidateService } from '../../services/candidateService';
import { applicationService } from '../../services/applicationService';
import { interviewService } from '../../services/interviewService';
import { jobService } from '../../services/jobService';
import { Badge } from '../../components/common/Badge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { formatDate } from '../../utils/helpers';

export const CandidateDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalApplications: 0, shortlistedApplications: 0, scheduledInterviews: 0 });
  const [profile, setProfile] = useState(null);
  const [recentApplications, setRecentApplications] = useState([]);
  const [upcomingInterviews, setUpcomingInterviews] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, profRes, appsRes, interRes, jobsRes] = await Promise.all([
          candidateService.getDashboardStats(),
          candidateService.getProfile(),
          applicationService.getMyApplications(0, 5),
          interviewService.getUpcomingInterviews(),
          jobService.searchJobs({ size: 4, status: 'OPEN' }),
        ]);

        if (statsRes.success) setStats(statsRes.data);
        if (profRes.success) setProfile(profRes.data);
        if (appsRes.success) setRecentApplications(appsRes.data);
        if (interRes.success) setUpcomingInterviews(interRes.data);
        if (jobsRes.success) setRecommendedJobs(jobsRes.data);
      } catch (err) {
        console.error('Failed to load candidate dashboard', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading your candidate dashboard..." />;
  }

  const isProfileIncomplete = !profile?.profileSummary || !profile?.resumes?.length;

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-indigo-900 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-indigo-950/10">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-indigo-200">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Job Seeker Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome back, {user?.name} 👋
          </h1>
          <p className="text-xs sm:text-sm text-indigo-200 max-w-xl">
            Track your job applications, monitor interview schedules, and explore new job opportunities.
          </p>
        </div>
        <Link
          to="/candidate/jobs"
          className="inline-flex items-center justify-center space-x-2 bg-white text-indigo-900 px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-indigo-50 transition-all shadow-md shrink-0 self-start sm:self-center"
        >
          <Search className="w-4 h-4" />
          <span>Explore Open Jobs</span>
        </Link>
      </div>

      {/* Incomplete Profile Alert */}
      {isProfileIncomplete && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-900">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-100 rounded-xl shrink-0">
              <UserCheck className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-950">Complete Your Candidate Profile</h4>
              <p className="text-xs text-amber-700 mt-0.5">
                Profiles with uploaded resumes and listed skills are 4x more likely to get shortlisted!
              </p>
            </div>
          </div>
          <Link
            to="/candidate/profile"
            className="px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold hover:bg-amber-700 transition-colors shrink-0 text-center"
          >
            Update Profile & CV
          </Link>
        </div>
      )}

      {/* Key Metric Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Submitted Applications</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{stats.totalApplications}</h3>
            <Link to="/candidate/applications" className="text-[11px] font-bold text-indigo-600 hover:underline mt-2 inline-block">
              View all applications →
            </Link>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Shortlisted</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{stats.shortlistedApplications}</h3>
            <span className="text-[11px] font-semibold text-emerald-600 mt-2 inline-block">
              Review in progress
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Scheduled Interviews</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{stats.scheduledInterviews}</h3>
            <Link to="/candidate/interviews" className="text-[11px] font-bold text-indigo-600 hover:underline mt-2 inline-block">
              View schedule →
            </Link>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Grid: Upcoming Interviews + Recent Applications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Recent Applications */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Recent Applications</h3>
            <Link to="/candidate/applications" className="text-xs font-bold text-indigo-600 hover:text-indigo-800">
              View All
            </Link>
          </div>

          {recentApplications.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-200/80 text-center">
              <p className="text-xs text-slate-500 mb-3">You haven't applied for any positions yet.</p>
              <Link
                to="/candidate/jobs"
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-indigo-600 hover:underline"
              >
                <span>Browse openings now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200/80 divide-y divide-slate-100 overflow-hidden shadow-xs">
              {recentApplications.map((app) => (
                <div key={app.id} className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-900">{app.jobTitle}</h4>
                    <p className="text-xs text-slate-500 flex items-center space-x-2">
                      <span>{app.companyName}</span>
                      <span>•</span>
                      <span>Applied {formatDate(app.appliedAt)}</span>
                    </p>
                  </div>
                  <Badge status={app.status}>{app.status.replace('_', ' ')}</Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Col: Upcoming Interviews & Profile Card */}
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Upcoming Interviews</h3>
              <Link to="/candidate/interviews" className="text-xs font-bold text-indigo-600 hover:text-indigo-800">
                View All
              </Link>
            </div>

            {upcomingInterviews.length === 0 ? (
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 text-center text-xs text-slate-400">
                No interviews scheduled right now.
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingInterviews.slice(0, 3).map((inter) => (
                  <div key={inter.id} className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{inter.jobTitle}</span>
                      <Badge status={inter.status}>{inter.status}</Badge>
                    </div>
                    <p className="text-xs text-slate-600 font-medium">{inter.companyName}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-indigo-100/60 text-[11px] text-indigo-900 font-semibold">
                      <span>{formatDate(inter.interviewDate)} • {inter.interviewTime}</span>
                      {inter.meetingLink && (
                        <a href={inter.meetingLink} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline flex items-center space-x-1">
                          <Video className="w-3.5 h-3.5" />
                          <span>Join</span>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
