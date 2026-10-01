import React from 'react';
import { Calendar, Clock, Video, MapPin, User, Building2, CheckCircle2, XCircle } from 'lucide-react';
import { Badge } from './Badge';
import { formatDate } from '../../utils/helpers';

export const InterviewCard = ({ interview, onStatusUpdate, isRecruiter = false }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:border-indigo-200 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <h4 className="text-base font-bold text-slate-900">{interview.jobTitle}</h4>
            <Badge status={interview.status}>{interview.status}</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1 flex items-center space-x-3">
            <span className="flex items-center space-x-1">
              <Building2 className="w-3.5 h-3.5" />
              <span>{interview.companyName}</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <User className="w-3.5 h-3.5" />
              <span>{isRecruiter ? `Candidate: ${interview.candidateName}` : `Recruiter: ${interview.recruiterName}`}</span>
            </span>
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs bg-indigo-50/70 border border-indigo-100 px-3 py-1.5 rounded-xl text-indigo-900">
          <div className="flex items-center space-x-1 font-semibold">
            <Calendar className="w-3.5 h-3.5 text-indigo-600" />
            <span>{formatDate(interview.interviewDate)}</span>
          </div>
          <div className="flex items-center space-x-1 font-semibold">
            <Clock className="w-3.5 h-3.5 text-indigo-600" />
            <span>{interview.interviewTime}</span>
          </div>
        </div>
      </div>

      <div className="space-y-2.5 text-xs text-slate-600 my-3">
        <div className="flex items-center space-x-2">
          {interview.interviewMode === 'ONLINE' ? (
            <Video className="w-4 h-4 text-emerald-600" />
          ) : (
            <MapPin className="w-4 h-4 text-amber-600" />
          )}
          <span className="font-semibold text-slate-700">
            Mode: {interview.interviewMode}
          </span>
          {interview.meetingLink && (
            <a
              href={interview.meetingLink}
              target="_blank"
              rel="noreferrer"
              className="text-indigo-600 font-bold hover:underline ml-2"
            >
              Open Video Room →
            </a>
          )}
          {interview.location && !interview.meetingLink && (
            <span className="text-slate-500">({interview.location})</span>
          )}
        </div>

        {interview.notes && (
          <p className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-slate-600 italic">
            Note: {interview.notes}
          </p>
        )}
      </div>

      {isRecruiter && interview.status === 'SCHEDULED' && onStatusUpdate && (
        <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
          <button
            onClick={() => onStatusUpdate(interview.id, 'COMPLETED')}
            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold hover:bg-emerald-100 transition-colors"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Mark Completed</span>
          </button>
          <button
            onClick={() => onStatusUpdate(interview.id, 'CANCELLED')}
            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold hover:bg-rose-100 transition-colors"
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Cancel</span>
          </button>
        </div>
      )}
    </div>
  );
};
