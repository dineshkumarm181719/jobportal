import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Building2,
  MapPin,
  Briefcase,
  DollarSign,
  Calendar,
  ArrowLeft,
  CheckCircle2,
  Share2,
  Clock,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { jobService } from '../../services/jobService';
import { applicationService } from '../../services/applicationService';
import { candidateService } from '../../services/candidateService';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { formatCurrency, formatDate, formatEmploymentType } from '../../utils/helpers';

export const JobDetails = () => {
  const { id } = useParams();
  const { user, isCandidate } = useAuth();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasApplied, setHasApplied] = useState(false);

  // Apply Modal
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [candidateProfile, setCandidateProfile] = useState(null);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);
  const [applyMessage, setApplyMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await jobService.getJobById(id);
        if (res.success && res.data) {
          setJob(res.data);
          setHasApplied(res.data.hasApplied);
        }
      } catch (err) {
        console.error('Failed to load job details', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

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

  const handleApplyClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setIsApplyModalOpen(true);
    setApplyMessage({ type: '', text: '' });
  };

  const handleConfirmApply = async (e) => {
    e.preventDefault();
    setApplying(true);
    setApplyMessage({ type: '', text: '' });

    try {
      const res = await applicationService.applyForJob({
        jobId: job.id,
        resumeId: selectedResumeId ? Number(selectedResumeId) : null,
        coverLetter,
      });

      if (res.success) {
        setApplyMessage({
          type: 'success',
          text: 'Your application has been submitted successfully!',
        });
        setHasApplied(true);
        setTimeout(() => {
          setIsApplyModalOpen(false);
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

  if (loading) {
    return <LoadingSpinner text="Loading job posting..." />;
  }

  if (!job) {
    return (
      <div className="text-center py-16">
        <h3 className="text-lg font-bold text-slate-900">Job Not Found</h3>
        <Link to="/jobs" className="text-xs text-indigo-600 font-bold mt-2 inline-block">
          ← Back to All Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Back Link */}
      <Link
        to="/jobs"
        className="inline-flex items-center space-x-2 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Job Search</span>
      </Link>

      {/* Main Job Banner Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-slate-100 flex items-center justify-center overflow-hidden shrink-0">
            {job.companyLogo ? (
              <img src={job.companyLogo} alt={job.companyName} className="w-full h-full object-cover" />
            ) : (
              <Building2 className="w-8 h-8 text-indigo-600" />
            )}
          </div>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">{job.title}</h1>
              <Badge status={job.status}>{job.status}</Badge>
            </div>
            <p className="text-sm font-semibold text-indigo-600 mt-1">{job.companyName}</p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500 mt-3">
              <span className="flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{job.location}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                <span>{formatEmploymentType(job.employmentType)}</span>
              </span>
              {(job.salaryMin || job.salaryMax) && (
                <span className="flex items-center space-x-1 font-bold text-emerald-700">
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>
                    {job.salaryMin ? formatCurrency(job.salaryMin) : ''}
                    {job.salaryMin && job.salaryMax ? ' - ' : ''}
                    {job.salaryMax ? formatCurrency(job.salaryMax) : ''}
                  </span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="shrink-0 w-full md:w-auto">
          {hasApplied ? (
            <div className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-700 border border-emerald-200 px-6 py-3 rounded-2xl font-bold text-sm">
              <CheckCircle2 className="w-5 h-5" />
              <span>Application Submitted</span>
            </div>
          ) : (
            <Button
              variant="primary"
              size="lg"
              className="w-full md:w-auto shadow-md"
              onClick={handleApplyClick}
            >
              Apply for this Position
            </Button>
          )}
        </div>
      </div>

      {/* Grid: Job Details Content & Sidebar Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Description & Requirements */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-3">About the Role</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {job.description}
              </p>
            </div>

            {job.requirements && (
              <div className="pt-6 border-t border-slate-100">
                <h3 className="text-base font-bold text-slate-900 mb-3">Key Requirements</h3>
                <div className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {job.requirements}
                </div>
              </div>
            )}

            {job.skills && job.skills.length > 0 && (
              <div className="pt-6 border-t border-slate-100">
                <h3 className="text-base font-bold text-slate-900 mb-3">Target Tech Stack & Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="bg-indigo-50 text-indigo-700 font-semibold text-xs px-3 py-1.5 rounded-xl border border-indigo-100"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Overview Card */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Job Overview
            </h3>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Date Posted:</span>
                <span className="font-bold text-slate-800">{formatDate(job.createdAt)}</span>
              </div>

              {job.deadline && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Application Deadline:</span>
                  <span className="font-bold text-indigo-600">{formatDate(job.deadline)}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Experience Level:</span>
                <span className="font-bold text-slate-800">{job.experienceRequired || 'Any'}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Employment Type:</span>
                <span className="font-bold text-slate-800">{formatEmploymentType(job.employmentType)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Total Applicants:</span>
                <span className="font-bold text-slate-800">{job.applicationsCount} Candidate(s)</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <p className="text-[11px] text-slate-400">Recruiter Contact:</p>
              <p className="text-xs font-bold text-slate-800 mt-0.5">{job.recruiterName}</p>
              <p className="text-xs text-slate-500">{job.recruiterEmail}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title={`Apply for ${job.title}`}
        subtitle={`at ${job.companyName}`}
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

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase">
                Cover Letter (Optional)
              </label>
              <textarea
                rows={4}
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Share relevant experience, tech stack leadership and why you're a great fit..."
                className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsApplyModalOpen(false)}
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
