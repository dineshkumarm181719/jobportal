import React from 'react';
import { Building2, MapPin, Calendar, FileText, Clock, Video, User } from 'lucide-react';
import { Badge } from './Badge';
import { formatDate } from '../../utils/helpers';

export const ApplicationCard = ({ application, onViewDetails, onStatusChange, isRecruiterView = false }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:border-indigo-200 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <h4 className="text-base font-bold text-slate-900">
              {isRecruiterView ? application.candidateName : application.jobTitle}
            </h4>
            <Badge status={application.status}>{application.status.replace('_', ' ')}</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1 flex items-center space-x-3">
            {isRecruiterView ? (
              <>
                <span className="flex items-center space-x-1">
                  <User className="w-3.5 h-3.5" />
                  <span>{application.candidateEmail}</span>
                </span>
                <span>• Role: {application.jobTitle}</span>
              </>
            ) : (
              <>
                <span className="flex items-center space-x-1">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{application.companyName}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{application.jobLocation}</span>
                </span>
              </>
            )}
          </p>
        </div>

        <div className="text-right text-xs text-slate-400">
          <p className="flex items-center sm:justify-end space-x-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>Applied {formatDate(application.appliedAt)}</span>
          </p>
        </div>
      </div>

      {application.coverLetter && (
        <div className="mb-4 bg-slate-50 rounded-xl p-3.5 text-xs text-slate-600 border border-slate-100">
          <p className="font-semibold text-slate-700 mb-1">Cover Note:</p>
          <p className="line-clamp-2 leading-relaxed italic">{application.coverLetter}</p>
        </div>
      )}

      {application.interview && (
        <div className="mb-4 bg-indigo-50/60 rounded-xl p-3.5 text-xs border border-indigo-100 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-indigo-900 font-medium">
            <Video className="w-4 h-4 text-indigo-600" />
            <span>
              Interview Scheduled: {formatDate(application.interview.interviewDate)} at {application.interview.interviewTime}
            </span>
          </div>
          {application.interview.meetingLink && (
            <a
              href={application.interview.meetingLink}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-indigo-600 hover:underline"
            >
              Join Call →
            </a>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
        <div className="flex items-center space-x-3">
          {application.resumeFilePath && (
            <a
              href={application.resumeFilePath}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-1 text-slate-600 hover:text-indigo-600 font-medium py-1 px-2.5 rounded-lg border border-slate-200 hover:border-indigo-200 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-500" />
              <span>{application.resumeFileName || 'View Resume'}</span>
            </a>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {onViewDetails && (
            <button
              onClick={() => onViewDetails(application)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
            >
              View Details
            </button>
          )}

          {isRecruiterView && onStatusChange && (
            <div className="flex items-center space-x-1.5">
              {application.status === 'APPLIED' && (
                <>
                  <button
                    onClick={() => onStatusChange(application.id, 'SHORTLISTED')}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors shadow-xs"
                  >
                    Shortlist
                  </button>
                  <button
                    onClick={() => onStatusChange(application.id, 'REJECTED')}
                    className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 font-semibold hover:bg-rose-100 transition-colors"
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
