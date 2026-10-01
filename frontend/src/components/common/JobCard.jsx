import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Briefcase, DollarSign, Calendar, Building2, CheckCircle2 } from 'lucide-react';
import { Badge } from './Badge';
import { formatCurrency, formatRelativeTime, formatEmploymentType } from '../../utils/helpers';

export const JobCard = ({ job, onApply, hasApplied, showActions = true }) => {
  const isApplied = hasApplied || job?.hasApplied;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md hover:border-indigo-200 transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-50 to-slate-100 border border-slate-200/60 flex items-center justify-center overflow-hidden shrink-0">
              {job.companyLogo ? (
                <img
                  src={job.companyLogo}
                  alt={job.companyName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <Building2 className={`w-6 h-6 text-indigo-600 ${job.companyLogo ? 'hidden' : 'flex'}`} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                <Link to={`/jobs/${job.id}`}>{job.title}</Link>
              </h3>
              <p className="text-xs font-medium text-slate-500 mt-0.5">{job.companyName}</p>
            </div>
          </div>
          <Badge status={job.status}>{job.status}</Badge>
        </div>

        {/* Location & Meta */}
        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-500 my-4">
          <div className="flex items-center space-x-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Briefcase className="w-3.5 h-3.5 text-slate-400" />
            <span>{formatEmploymentType(job.employmentType)}</span>
          </div>
          {(job.salaryMin || job.salaryMax) && (
            <div className="flex items-center space-x-1 font-semibold text-slate-700">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
              <span>
                {job.salaryMin ? formatCurrency(job.salaryMin) : ''}
                {job.salaryMin && job.salaryMax ? ' - ' : ''}
                {job.salaryMax ? formatCurrency(job.salaryMax) : ''}
              </span>
            </div>
          )}
          {job.experienceRequired && (
            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md text-[11px] font-medium">
              {job.experienceRequired}
            </span>
          )}
        </div>

        {/* Description snippet */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
          {job.description}
        </p>

        {/* Skills */}
        {job.skills && job.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {job.skills.slice(0, 4).map((skill, idx) => (
              <span
                key={idx}
                className="bg-indigo-50/60 text-indigo-700 font-medium text-[11px] px-2.5 py-1 rounded-lg border border-indigo-100/80"
              >
                {skill}
              </span>
            ))}
            {job.skills.length > 4 && (
              <span className="text-[11px] text-slate-400 font-medium self-center pl-1">
                +{job.skills.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-1 text-slate-400">
          <Calendar className="w-3.5 h-3.5" />
          <span>Posted {formatRelativeTime(job.createdAt)}</span>
        </div>

        {showActions && (
          <div className="flex items-center space-x-2">
            <Link
              to={`/jobs/${job.id}`}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
            >
              Details
            </Link>
            {isApplied ? (
              <span className="inline-flex items-center space-x-1 text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg font-semibold text-xs">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Applied</span>
              </span>
            ) : onApply ? (
              <button
                onClick={() => onApply(job)}
                className="px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 shadow-xs shadow-indigo-200 transition-all"
              >
                Apply
              </button>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};
