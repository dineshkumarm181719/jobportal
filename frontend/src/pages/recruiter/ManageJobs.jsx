import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  PlusCircle,
  Edit,
  Trash2,
  Users,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  DollarSign,
} from 'lucide-react';
import { recruiterService } from '../../services/recruiterService';
import { jobService } from '../../services/jobService';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Pagination } from '../../components/common/Pagination';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { formatCurrency, formatDate, formatEmploymentType } from '../../utils/helpers';

export const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [pageData, setPageData] = useState({ page: 0, totalPages: 1, totalElements: 0 });
  const [loading, setLoading] = useState(true);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  const fetchJobs = async (page = 0) => {
    setLoading(true);
    try {
      const res = await recruiterService.getMyJobs(page, 10);
      if (res.success && res.data) {
        setJobs(res.data);
        setPageData({
          page: res.page,
          totalPages: res.totalPages,
          totalElements: res.totalElements,
        });
      }
    } catch (err) {
      console.error('Failed to load recruiter jobs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(0);
  }, []);

  const handleDeleteJob = async () => {
    if (!jobToDelete) return;
    setDeleting(true);
    try {
      await jobService.deleteJob(jobToDelete.id);
      setJobs((prev) => prev.filter((j) => j.id !== jobToDelete.id));
    } catch (err) {
      console.error('Failed to delete job', err);
    } finally {
      setDeleting(false);
      setJobToDelete(null);
    }
  };

  const handleToggleStatus = async (job) => {
    const newStatus = job.status === 'OPEN' ? 'CLOSED' : 'OPEN';
    try {
      const res = await jobService.updateJob(job.id, {
        ...job,
        status: newStatus,
      });
      if (res.success) {
        setJobs((prev) =>
          prev.map((j) => (j.id === job.id ? { ...j, status: newStatus } : j))
        );
      }
    } catch (err) {
      console.error('Failed to update job status', err);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Manage Job Postings 💼
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Create, edit, toggle status, and inspect applications for all your positions
          </p>
        </div>

        <Link
          to="/recruiter/create-job"
          className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs transition-all shadow-xs"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Job</span>
        </Link>
      </div>

      {loading ? (
        <LoadingSpinner text="Fetching your job listings..." />
      ) : jobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No jobs posted yet"
          description="Create your first job listing to start receiving qualified applicant resumes."
          actionText="Create Job Now"
          onAction={() => navigate('/recruiter/create-job')}
        />
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-5">Job Title & Details</th>
                    <th className="py-3.5 px-4">Location & Type</th>
                    <th className="py-3.5 px-4">Applicants</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Posted Date</th>
                    <th className="py-3.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-5">
                        <p className="font-bold text-slate-900 line-clamp-1">{job.title}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {job.salaryMin ? formatCurrency(job.salaryMin) : ''}
                          {job.salaryMin && job.salaryMax ? ' - ' : ''}
                          {job.salaryMax ? formatCurrency(job.salaryMax) : ''}
                        </p>
                      </td>

                      <td className="py-4 px-4">
                        <p className="font-semibold text-slate-700">{job.location}</p>
                        <p className="text-[11px] text-slate-400">{formatEmploymentType(job.employmentType)}</p>
                      </td>

                      <td className="py-4 px-4">
                        <Link
                          to={`/recruiter/applications?jobId=${job.id}`}
                          className="inline-flex items-center space-x-1.5 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-xl font-bold hover:bg-indigo-100 transition-colors"
                        >
                          <Users className="w-3.5 h-3.5" />
                          <span>{job.applicationsCount} Applicants</span>
                        </Link>
                      </td>

                      <td className="py-4 px-4">
                        <Badge status={job.status}>{job.status}</Badge>
                      </td>

                      <td className="py-4 px-4 text-slate-500">
                        {formatDate(job.createdAt)}
                      </td>

                      <td className="py-4 px-5 text-right space-x-1 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleStatus(job)}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            job.status === 'OPEN'
                              ? 'text-amber-600 border-amber-200 hover:bg-amber-50'
                              : 'text-emerald-600 border-emerald-200 hover:bg-emerald-50'
                          }`}
                          title={job.status === 'OPEN' ? 'Close Job' : 'Open Job'}
                        >
                          {job.status === 'OPEN' ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                        </button>

                        <Link
                          to={`/recruiter/edit-job/${job.id}`}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 inline-flex items-center transition-colors"
                          title="Edit Job"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>

                        <button
                          onClick={() => setJobToDelete(job)}
                          className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Job"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <Pagination
            currentPage={pageData.page}
            totalPages={pageData.totalPages}
            totalElements={pageData.totalElements}
            onPageChange={(p) => fetchJobs(p)}
          />
        </div>
      )}

      <ConfirmDialog
        isOpen={!!jobToDelete}
        onClose={() => setJobToDelete(null)}
        onConfirm={handleDeleteJob}
        title="Delete Job Posting"
        message={`Are you sure you want to delete '${jobToDelete?.title}'? All associated candidate applications will also be removed.`}
        confirmText="Delete Job"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
};
