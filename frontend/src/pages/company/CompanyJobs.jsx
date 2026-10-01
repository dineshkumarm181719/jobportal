import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Eye, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { companyService } from '../../services/companyService';
import { Badge } from '../../components/common/Badge';
import { Pagination } from '../../components/common/Pagination';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { formatCurrency, formatDate, formatEmploymentType } from '../../utils/helpers';

export const CompanyJobs = () => {
  const { user } = useAuth();
  const companyId = user?.companyId || 1;

  const [jobs, setJobs] = useState([]);
  const [pageData, setPageData] = useState({ page: 0, totalPages: 1, totalElements: 0 });
  const [loading, setLoading] = useState(true);

  const fetchCompanyJobs = async (page = 0) => {
    setLoading(true);
    try {
      const res = await companyService.getCompanyJobs(companyId, { page, size: 10 });
      if (res.success && res.data) {
        setJobs(res.data);
        setPageData({
          page: res.page,
          totalPages: res.totalPages,
          totalElements: res.totalElements,
        });
      }
    } catch (err) {
      console.error('Failed to load company jobs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyJobs(0);
  }, [companyId]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Company Job Portfolio 💼
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Monitor all open, draft, and closed positions across your organization
        </p>
      </div>

      {loading ? (
        <LoadingSpinner text="Fetching company job listings..." />
      ) : jobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No jobs found"
          description="Your team has not posted any active job listings yet."
        />
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-5">Job Title</th>
                    <th className="py-3.5 px-4">Recruiter Lead</th>
                    <th className="py-3.5 px-4">Type & Location</th>
                    <th className="py-3.5 px-4">Applicants</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-5 text-right">Preview</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-5">
                        <p className="font-bold text-slate-900">{job.title}</p>
                        <p className="text-[11px] text-slate-400">
                          {job.salaryMin ? formatCurrency(job.salaryMin) : ''}
                          {job.salaryMin && job.salaryMax ? ' - ' : ''}
                          {job.salaryMax ? formatCurrency(job.salaryMax) : ''}
                        </p>
                      </td>

                      <td className="py-4 px-4 font-semibold text-slate-700">
                        {job.recruiterName}
                      </td>

                      <td className="py-4 px-4 text-slate-600">
                        {job.location} ({formatEmploymentType(job.employmentType)})
                      </td>

                      <td className="py-4 px-4 font-bold text-indigo-600">
                        {job.applicationsCount} Candidates
                      </td>

                      <td className="py-4 px-4">
                        <Badge status={job.status}>{job.status}</Badge>
                      </td>

                      <td className="py-4 px-5 text-right">
                        <Link
                          to={`/jobs/${job.id}`}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 inline-flex items-center transition-colors"
                          title="View Public Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
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
            onPageChange={(p) => fetchCompanyJobs(p)}
          />
        </div>
      )}
    </div>
  );
};
