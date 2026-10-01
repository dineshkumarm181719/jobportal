import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  MapPin,
  Briefcase,
  DollarSign,
  Filter,
  X,
  SlidersHorizontal,
  CheckCircle2,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { jobService } from '../../services/jobService';
import { candidateService } from '../../services/candidateService';
import { applicationService } from '../../services/applicationService';
import { useAuth } from '../../context/AuthContext';
import { JobCard } from '../../components/common/JobCard';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Pagination } from '../../components/common/Pagination';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { EMPLOYMENT_TYPES, EXPERIENCE_LEVELS } from '../../utils/constants';

export const JobSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, isCandidate } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [pageData, setPageData] = useState({ page: 0, totalPages: 1, totalElements: 0 });
  const [loading, setLoading] = useState(true);

  // Filters State
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [employmentType, setEmploymentType] = useState(searchParams.get('employmentType') || '');
  const [experience, setExperience] = useState(searchParams.get('experience') || '');
  const [minSalary, setMinSalary] = useState(searchParams.get('minSalary') || '');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');
  const [currentPage, setCurrentPage] = useState(0);

  // Apply Modal State
  const [selectedJobToApply, setSelectedJobToApply] = useState(null);
  const [candidateProfile, setCandidateProfile] = useState(null);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);
  const [applyMessage, setApplyMessage] = useState({ type: '', text: '' });
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());

  const fetchJobs = async (page = 0) => {
    setLoading(true);
    try {
      const params = {
        page,
        size: 9,
        sortBy,
        sortDir,
        status: 'OPEN',
      };
      if (keyword) params.keyword = keyword;
      if (location) params.location = location;
      if (employmentType) params.employmentType = employmentType;
      if (experience) params.experience = experience;
      if (minSalary) params.minSalary = minSalary;

      const res = await jobService.searchJobs(params);
      if (res.success && res.data) {
        setJobs(res.data);
        setPageData({
          page: res.page,
          totalPages: res.totalPages,
          totalElements: res.totalElements,
        });

        const initialApplied = new Set();
        res.data.forEach((j) => {
          if (j.hasApplied) initialApplied.add(j.id);
        });
        setAppliedJobIds(initialApplied);
      }
    } catch (err) {
      console.error('Failed to search jobs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(currentPage);
  }, [currentPage, sortBy, sortDir]);

  useEffect(() => {
    if (isCandidate()) {
      candidateService.getProfile().then((res) => {
        if (res.success) {
          setCandidateProfile(res.data);
          if (res.data.resumes?.length > 0) {
            setSelectedResumeId(res.data.resumes[0].id);
          }
        }
      });
    }
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(0);
    fetchJobs(0);
  };

  const handleResetFilters = () => {
    setKeyword('');
    setLocation('');
    setEmploymentType('');
    setExperience('');
    setMinSalary('');
    setCurrentPage(0);
    jobService.searchJobs({ size: 9, status: 'OPEN' }).then((res) => {
      if (res.success) {
        setJobs(res.data);
        setPageData({ page: res.page, totalPages: res.totalPages, totalElements: res.totalElements });
      }
    });
  };

  const handleOpenApplyModal = (job) => {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    setSelectedJobToApply(job);
    setApplyMessage({ type: '', text: '' });
  };

  const handleConfirmApply = async (e) => {
    e.preventDefault();
    if (!selectedJobToApply) return;
    setApplying(true);
    setApplyMessage({ type: '', text: '' });

    try {
      const res = await applicationService.applyForJob({
        jobId: selectedJobToApply.id,
        resumeId: selectedResumeId ? Number(selectedResumeId) : null,
        coverLetter,
      });

      if (res.success) {
        setApplyMessage({
          type: 'success',
          text: 'Your application has been submitted successfully!',
        });
        setAppliedJobIds((prev) => new Set(prev).add(selectedJobToApply.id));
        setTimeout(() => {
          setSelectedJobToApply(null);
          setCoverLetter('');
        }, 1500);
      }
    } catch (err) {
      setApplyMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to submit application',
      });
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Explore Job Opportunities 💼
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Search and filter verified positions across engineering, product, and leadership
        </p>
      </div>

      {/* Top Filter Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Keyword or Title..."
              className="w-full pl-10 pr-3 py-2.5 bg-slate-50 text-xs rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location (City, Remote)..."
              className="w-full pl-10 pr-3 py-2.5 bg-slate-50 text-xs rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <select
              value={employmentType}
              onChange={(e) => setEmploymentType(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 text-xs rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 font-medium"
            >
              <option value="">All Employment Types</option>
              {EMPLOYMENT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <Button type="submit" variant="primary" size="md" className="flex-1 text-xs">
              Search Jobs
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={handleResetFilters}
              title="Reset Filters"
            >
              Reset
            </Button>
          </div>
        </form>

        {/* Secondary Filter Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-semibold text-slate-500 flex items-center space-x-1">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Min Salary:</span>
            </span>
            {[60000, 100000, 140000, 180000].map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => {
                  setMinSalary(amt.toString());
                  setCurrentPage(0);
                  setTimeout(() => fetchJobs(0), 50);
                }}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  minSalary === amt.toString()
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                ${amt / 1000}k+
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-slate-500 font-medium">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-700"
            >
              <option value="createdAt">Date Posted</option>
              <option value="salaryMax">Highest Salary</option>
              <option value="title">Job Title</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div>
        {loading ? (
          <LoadingSpinner text="Searching jobs..." />
        ) : jobs.length === 0 ? (
          <EmptyState
            title="No jobs found"
            description="Try loosening your search filters or clearing location keywords."
            actionText="Clear All Filters"
            onAction={handleResetFilters}
          />
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  hasApplied={appliedJobIds.has(job.id)}
                  onApply={handleOpenApplyModal}
                />
              ))}
            </div>

            <Pagination
              currentPage={pageData.page}
              totalPages={pageData.totalPages}
              totalElements={pageData.totalElements}
              onPageChange={(p) => setCurrentPage(p)}
              size={9}
            />
          </div>
        )}
      </div>

      {/* Apply Modal */}
      <Modal
        isOpen={!!selectedJobToApply}
        onClose={() => setSelectedJobToApply(null)}
        title={`Apply for ${selectedJobToApply?.title}`}
        subtitle={`at ${selectedJobToApply?.companyName}`}
        maxWidth="max-w-lg"
      >
        {applyMessage.text ? (
          <div
            className={`p-4 rounded-2xl text-xs flex items-center space-x-2.5 mb-4 ${
              applyMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {applyMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <span>{applyMessage.text}</span>
          </div>
        ) : (
          <form onSubmit={handleConfirmApply} className="space-y-4">
            {/* Resume selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase">
                Select Resume
              </label>
              {candidateProfile?.resumes && candidateProfile.resumes.length > 0 ? (
                <select
                  value={selectedResumeId}
                  onChange={(e) => setSelectedResumeId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {candidateProfile.resumes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.fileName} (Uploaded {new Date(r.uploadedAt).toLocaleDateString()})
                    </option>
                  ))}
                </select>
              ) : (
                <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs text-amber-800 flex items-center justify-between">
                  <span>No resume uploaded yet.</span>
                  <a href="/candidate/profile" className="font-bold underline text-amber-900">
                    Upload in Profile
                  </a>
                </div>
              )}
            </div>

            {/* Cover Letter */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase">
                Cover Note / Message to Recruiter (Optional)
              </label>
              <textarea
                rows={4}
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Share relevant experience, links to portfolio / GitHub, and why you're a great fit for this position..."
                className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setSelectedJobToApply(null)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={applying}>
                Submit Application
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
