import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Eye, Trash2 } from 'lucide-react';
import { jobService } from '../../services/jobService';
import { Badge } from '../../components/common/Badge';
import { Pagination } from '../../components/common/Pagination';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { formatCurrency, formatDate, formatEmploymentType } from '../../utils/helpers';

export const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [pageData, setPageData] = useState({ page: 0, totalPages: 1, totalElements: 0 });
  const [loading, setLoading] = useState(true);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchJobs = async (page = 0) => {
    setLoading(true);
    try {
      const res = await jobService.searchJobs({ page, size: 10 });
      if (res.success && res.data) {
        setJobs(res.data);
        setPageData({
          page: res.page,
          totalPages: res.totalPages,
          totalElements: res.totalElements,
        });
      }
    } catch (err) {
      console.error('Failed to load system jobs', err);
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

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Platform Job Listings Audit 💼
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Root oversight of all active, draft, and closed positions across all companies
        </p>
      </div>

      {loading ? (
        <LoadingSpinner text="Fetching all platform jobs..." />
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-5">Job Title</th>
                    <th className="py-3.5 px-4">Company</th>
                    <th className="py-3.5 px-4">Location</th>
                    <th className="py-3.5 px-4">Applicants</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Posted Date</th>
                    <th className="py-3.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-5 font-bold text-slate-900">
                        {job.title}
                      </td>

                      <td className="py-4 px-4 font-semibold text-slate-700">
                        {job.companyName}
                      </td>

                      <td className="py-4 px-4 text-slate-500">
                        {job.location}
                      </td>

                      <td className="py-4 px-4 font-bold text-indigo-600">
                        {job.applicationsCount}
                      </td>

                      <td className="py-4 px-4">
                        <Badge status={job.status}>{job.status}</Badge>
                      </td>

                      <td className="py-4 px-4 text-slate-500">
                        {formatDate(job.createdAt)}
                      </td>

                      <td className="py-4 px-5 text-right space-x-1">
                        <Link
                          to={`/jobs/${job.id}`}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 inline-flex items-center"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setJobToDelete(job)}
                          className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50"
                          title="Delete"
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
        title="Delete Job"
        message={`Are you sure you want to delete '${jobToDelete?.title}' from the system?`}
        confirmText="Delete"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
};
