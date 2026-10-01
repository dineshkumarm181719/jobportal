import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  Briefcase,
  TrendingUp,
  Building2,
  Users,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { jobService } from '../services/jobService';
import { companyService } from '../services/companyService';
import { JobCard } from '../components/common/JobCard';
import { Button } from '../components/common/Button';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const Home = () => {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, companiesRes] = await Promise.all([
          jobService.searchJobs({ size: 6, status: 'OPEN' }),
          companyService.getCompanies({ size: 4 }),
        ]);
        if (jobsRes.success && jobsRes.data) {
          setFeaturedJobs(jobsRes.data);
        }
        if (companiesRes.success && companiesRes.data) {
          setCompanies(companiesRes.data);
        }
      } catch (err) {
        console.error('Failed to load home data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.append('keyword', keyword);
    if (location) params.append('location', location);
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-200/50 to-purple-200/40 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-indigo-50 border border-indigo-200/80 px-4 py-1.5 rounded-full text-xs font-bold text-indigo-700 mb-6 shadow-xs animate-in fade-in">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Over 1,200+ Verified Tech & Enterprise Careers Live</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
            Find the career that elevates your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600">potential.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mt-6 leading-relaxed font-normal">
            Directly connect with top employers, track application milestones in real-time, and schedule seamless online interviews.
          </p>

          {/* Search Box */}
          <form
            onSubmit={handleSearch}
            className="mt-10 max-w-3xl mx-auto bg-white p-2.5 sm:p-3 rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200 flex flex-col sm:flex-row gap-2"
          >
            <div className="flex-1 flex items-center px-3.5 py-2 rounded-xl bg-slate-50/70 border border-transparent focus-within:border-indigo-200 focus-within:bg-white transition-all">
              <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2.5" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Job title, skills (e.g. Java, React, AI)..."
                className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
              />
            </div>

            <div className="flex-1 flex items-center px-3.5 py-2 rounded-xl bg-slate-50/70 border border-transparent focus-within:border-indigo-200 focus-within:bg-white transition-all">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0 mr-2.5" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, state, or Remote..."
                className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
              />
            </div>

            <Button type="submit" variant="primary" size="md" className="shrink-0 px-6 py-3">
              Search Jobs
            </Button>
          </form>

          {/* Popular Tag Pills */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">Popular:</span>
            {['Java Developer', 'Spring Boot', 'React.js', 'DevOps AWS', 'Machine Learning', 'Remote'].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  setKeyword(tag);
                  navigate(`/jobs?keyword=${encodeURIComponent(tag)}`);
                }}
                className="bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 px-3 py-1 rounded-lg text-slate-600 font-medium transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Metric Counters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="text-center p-4 border-r border-slate-100 last:border-0">
            <p className="text-3xl font-extrabold text-indigo-600">5,000+</p>
            <p className="text-xs font-semibold text-slate-500 mt-1">Active Job Seekers</p>
          </div>
          <div className="text-center p-4 border-r border-slate-100 last:border-0">
            <p className="text-3xl font-extrabold text-indigo-600">1,200+</p>
            <p className="text-xs font-semibold text-slate-500 mt-1">Verified Jobs Posted</p>
          </div>
          <div className="text-center p-4 border-r border-slate-100 last:border-0">
            <p className="text-3xl font-extrabold text-indigo-600">350+</p>
            <p className="text-xs font-semibold text-slate-500 mt-1">Partner Companies</p>
          </div>
          <div className="text-center p-4">
            <p className="text-3xl font-extrabold text-indigo-600">98%</p>
            <p className="text-xs font-semibold text-slate-500 mt-1">Interview Rate</p>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Featured Job Openings</h2>
            <p className="text-xs text-slate-500 mt-1">Explore curated tech & engineering positions with competitive compensation</p>
          </div>
          <Link
            to="/jobs"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <span>View All Jobs</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner text="Fetching open positions..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </section>

      {/* Top Hiring Companies */}
      {companies.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl font-bold text-slate-900">Leading Hiring Partners</h2>
            <p className="text-xs text-slate-500 mt-1">Directly recruit from companies building the future</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {companies.map((comp) => (
              <div
                key={comp.id}
                className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-indigo-200 transition-all text-center flex flex-col items-center justify-between"
              >
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-slate-100 flex items-center justify-center overflow-hidden mb-4 shadow-xs">
                  {comp.logo ? (
                    <img src={comp.logo} alt={comp.name} className="w-full h-full object-cover" />
                  ) : (
                    <Building2 className="w-8 h-8 text-indigo-600" />
                  )}
                </div>
                <h4 className="text-base font-bold text-slate-900">{comp.name}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{comp.industry || 'Technology'}</p>
                <p className="text-xs text-slate-400 mt-1">{comp.location}</p>
                <div className="mt-4 pt-4 border-t border-slate-100 w-full flex items-center justify-between text-xs font-semibold text-indigo-600">
                  <span>{comp.openJobsCount || 0} Open Jobs</span>
                  <Link to={`/jobs?keyword=${encodeURIComponent(comp.name)}`} className="hover:underline">
                    Explore →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Role Dual CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-10 relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">For Candidates</span>
              <h3 className="text-2xl font-bold tracking-tight">Ready for your next career milestone?</h3>
              <p className="text-xs text-indigo-200/90 leading-relaxed">
                Build your professional profile, upload multiple resumes, apply with 1-click, and get interview invites directly.
              </p>
            </div>
            <div className="pt-8">
              <Link
                to="/register"
                className="inline-flex items-center space-x-2 bg-white text-indigo-900 px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-indigo-50 transition-colors shadow-md"
              >
                <span>Create Candidate Profile</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-8 sm:p-10 relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-300">For Employers & Recruiters</span>
              <h3 className="text-2xl font-bold tracking-tight">Hire vetted top-tier engineers faster.</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Publish job openings, filter applicants by specific tech stacks, shortlist candidates, and schedule live video interviews.
              </p>
            </div>
            <div className="pt-8">
              <Link
                to="/register"
                className="inline-flex items-center space-x-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-600/30"
              >
                <span>Post Open Positions</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
