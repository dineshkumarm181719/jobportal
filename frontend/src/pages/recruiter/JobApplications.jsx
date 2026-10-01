import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Users,
  Search,
  Filter,
  FileText,
  Calendar,
  CheckCircle2,
  XCircle,
  Video,
  Award,
  Download,
  AlertCircle,
  User,
  GraduationCap,
  Briefcase,
  MapPin,
} from 'lucide-react';
import { applicationService } from '../../services/applicationService';
import { recruiterService } from '../../services/recruiterService';
import { interviewService } from '../../services/interviewService';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Pagination } from '../../components/common/Pagination';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { formatDate } from '../../utils/helpers';

export const JobApplications = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialJobId = searchParams.get('jobId') || '';

  const [applications, setApplications] = useState([]);
  const [myJobs, setMyJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(initialJobId);
  const [pageData, setPageData] = useState({ page: 0, totalPages: 1, totalElements: 0 });
  const [loading, setLoading] = useState(true);

  // Candidate inspection modal
  const [inspectedCandidate, setInspectedCandidate] = useState(null);

  // Schedule Interview modal
  const [interviewApp, setInterviewApp] = useState(null);
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewTime, setInterviewTime] = useState('14:00 EST');
  const [interviewMode, setInterviewMode] = useState('ONLINE');
  const [meetingLink, setMeetingLink] = useState('https://meet.google.com/careersync-session');
  const [interviewLocation, setInterviewLocation] = useState('');
  const [interviewNotes, setInterviewNotes] = useState('');
  const [scheduling, setScheduling] = useState(false);
  const [interviewSuccess, setInterviewSuccess] = useState('');

  const fetchApplications = async (page = 0, jobId = selectedJobId) => {
    setLoading(true);
    try {
      const params = { page, size: 10 };
      if (jobId) params.jobId = jobId;

      const res = await applicationService.getRecruiterApplications(params);
      if (res.success && res.data) {
        setApplications(res.data);
        setPageData({
          page: res.page,
          totalPages: res.totalPages,
          totalElements: res.totalElements,
        });
      }
    } catch (err) {
      console.error('Failed to load applications', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    recruiterService.getMyJobs(0, 50).then((res) => {
      if (res.success && res.data) setMyJobs(res.data);
    });
    fetchApplications(0, selectedJobId);
  }, [selectedJobId]);

  const handleJobFilterChange = (e) => {
    const val = e.target.value;
    setSelectedJobId(val);
    if (val) {
      setSearchParams({ jobId: val });
    } else {
      setSearchParams({});
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    try {
      const res = await applicationService.updateStatus(appId, newStatus);
      if (res.success) {
        setApplications((prev) =>
          prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a))
        );
      }
    } catch (err) {
      console.error('Failed to change status', err);
    }
  };

  const handleOpenScheduleModal = (app) => {
    setInterviewApp(app);
    setInterviewDate(new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]);
    setInterviewSuccess('');
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!interviewApp) return;
    setScheduling(true);
    setInterviewSuccess('');

    try {
      const res = await interviewService.scheduleInterview({
        applicationId: interviewApp.id,
        interviewDate,
        interviewTime,
        interviewMode,
        meetingLink: interviewMode === 'ONLINE' ? meetingLink : '',
        location: interviewMode === 'OFFLINE' ? interviewLocation : 'Google Meet Room',
        notes: interviewNotes,
      });

      if (res.success) {
        setInterviewSuccess('Interview scheduled and invitation dispatched to candidate!');
        setApplications((prev) =>
          prev.map((a) => (a.id === interviewApp.id ? { ...a, status: 'INTERVIEW_SCHEDULED' } : a))
        );
        setTimeout(() => {
          setInterviewApp(null);
        }, 1500);
      }
    } catch (err) {
      console.error('Failed to schedule interview', err);
    } finally {
      setScheduling(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Applicant Pipeline 👥
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Review candidate resumes, shortlist talent, and schedule interviews
          </p>
        </div>

        {/* Filter by specific job */}
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedJobId}
            onChange={handleJobFilterChange}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Job Postings</option>
            {myJobs.map((j) => (
              <option key={j.id} value={j.id}>
                {j.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Fetching applicant pool..." />
      ) : applications.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No applications received yet"
          description="Candidates applying for your posted jobs will appear here for screening."
        />
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-5">Candidate Name</th>
                    <th className="py-3.5 px-4">Applied Role</th>
                    <th className="py-3.5 px-4">CV & Skills</th>
                    <th className="py-3.5 px-4">Applied Date</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-5 text-right">Review Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-5">
                        <button
                          onClick={() => setInspectedCandidate(app)}
                          className="text-left font-bold text-slate-900 hover:text-indigo-600 transition-colors block"
                        >
                          {app.candidateName}
                        </button>
                        <span className="text-[11px] text-slate-400 block">{app.candidateEmail}</span>
                      </td>

                      <td className="py-4 px-4 font-semibold text-slate-800">
                        {app.jobTitle}
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          {app.resumeFilePath ? (
                            <a
                              href={app.resumeFilePath}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center space-x-1 bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg font-semibold hover:bg-indigo-100 transition-colors text-[11px]"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>Resume</span>
                            </a>
                          ) : (
                            <span className="text-slate-400 italic text-[11px]">No CV</span>
                          )}
                          <button
                            onClick={() => setInspectedCandidate(app)}
                            className="text-slate-500 hover:text-slate-800 font-semibold text-[11px] underline"
                          >
                            Profile
                          </button>
                        </div>
                      </td>

                      <td className="py-4 px-4 text-slate-500">
                        {formatDate(app.appliedAt)}
                      </td>

                      <td className="py-4 px-4">
                        <Badge status={app.status}>{app.status.replace('_', ' ')}</Badge>
                      </td>

                      <td className="py-4 px-5 text-right space-x-1.5 whitespace-nowrap">
                        {app.status === 'APPLIED' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(app.id, 'SHORTLISTED')}
                              className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700 text-[11px] shadow-xs"
                            >
                              Shortlist
                            </button>
                            <button
                              onClick={() => handleStatusChange(app.id, 'REJECTED')}
                              className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 font-bold hover:bg-rose-100 text-[11px]"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {app.status === 'SHORTLISTED' && (
                          <button
                            onClick={() => handleOpenScheduleModal(app)}
                            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700 text-[11px] shadow-xs"
                          >
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Schedule Interview</span>
                          </button>
                        )}

                        {app.status === 'INTERVIEW_SCHEDULED' && (
                          <button
                            onClick={() => handleStatusChange(app.id, 'SELECTED')}
                            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 text-[11px] shadow-xs"
                          >
                            <Award className="w-3.5 h-3.5" />
                            <span>Extend Offer</span>
                          </button>
                        )}
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
            onPageChange={(p) => fetchApplications(p)}
          />
        </div>
      )}

      {/* Candidate Profile Details Modal */}
      <Modal
        isOpen={!!inspectedCandidate}
        onClose={() => setInspectedCandidate(null)}
        title={inspectedCandidate?.candidateName || 'Candidate Details'}
        subtitle={inspectedCandidate?.candidateEmail}
        maxWidth="max-w-xl"
      >
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4 pb-3 border-b border-slate-100">
            <div>
              <span className="text-slate-400 font-medium">Applied Position:</span>
              <p className="font-bold text-slate-800">{inspectedCandidate?.jobTitle}</p>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Experience:</span>
              <p className="font-bold text-slate-800">{inspectedCandidate?.candidateExperience || 'N/A'}</p>
            </div>
          </div>

          {inspectedCandidate?.candidateLocation && (
            <div>
              <span className="text-slate-400 font-medium">Location:</span>
              <p className="font-bold text-slate-800">{inspectedCandidate.candidateLocation}</p>
            </div>
          )}

          {inspectedCandidate?.candidateEducation && (
            <div>
              <span className="text-slate-400 font-medium">Education:</span>
              <p className="font-bold text-slate-800">{inspectedCandidate.candidateEducation}</p>
            </div>
          )}

          {inspectedCandidate?.candidateSkills && inspectedCandidate.candidateSkills.length > 0 && (
            <div>
              <span className="text-slate-400 font-medium block mb-1.5">Skills & Competencies:</span>
              <div className="flex flex-wrap gap-1.5">
                {inspectedCandidate.candidateSkills.map((s, i) => (
                  <span key={i} className="bg-indigo-50 text-indigo-700 font-semibold px-2.5 py-1 rounded-lg border border-indigo-100">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {inspectedCandidate?.coverLetter && (
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <span className="font-bold text-slate-700 block mb-1">Cover Letter:</span>
              <p className="text-slate-600 italic leading-relaxed">{inspectedCandidate.coverLetter}</p>
            </div>
          )}

          {inspectedCandidate?.resumeFilePath && (
            <div className="pt-2">
              <a
                href={inspectedCandidate.resumeFilePath}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>Download Candidate Resume ({inspectedCandidate.resumeFileName})</span>
              </a>
            </div>
          )}
        </div>
      </Modal>

      {/* Schedule Interview Modal */}
      <Modal
        isOpen={!!interviewApp}
        onClose={() => setInterviewApp(null)}
        title="Schedule Live Interview"
        subtitle={`Candidate: ${interviewApp?.candidateName} for ${interviewApp?.jobTitle}`}
        maxWidth="max-w-lg"
      >
        {interviewSuccess ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{interviewSuccess}</span>
          </div>
        ) : (
          <form onSubmit={handleScheduleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 uppercase">Interview Date *</label>
                <input
                  type="date"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 uppercase">Time & Timezone *</label>
                <input
                  type="text"
                  value={interviewTime}
                  onChange={(e) => setInterviewTime(e.target.value)}
                  placeholder="e.g. 14:30 EST"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 uppercase">Mode</label>
              <select
                value={interviewMode}
                onChange={(e) => setInterviewMode(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
              >
                <option value="ONLINE">Online (Video Meeting)</option>
                <option value="OFFLINE">In-Person (Office)</option>
              </select>
            </div>

            {interviewMode === 'ONLINE' ? (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 uppercase">Video Meeting URL</label>
                <input
                  type="url"
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
                  required
                />
              </div>
            ) : (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 uppercase">Office Location</label>
                <input
                  type="text"
                  value={interviewLocation}
                  onChange={(e) => setInterviewLocation(e.target.value)}
                  placeholder="e.g. Building 4, Floor 3, Meeting Room Alpha"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
                  required
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 uppercase">Agenda / Notes</label>
              <textarea
                rows={3}
                value={interviewNotes}
                onChange={(e) => setInterviewNotes(e.target.value)}
                placeholder="Technical architecture assessment and live pair programming session..."
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs"
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
              <Button type="button" variant="secondary" onClick={() => setInterviewApp(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={scheduling}>
                Confirm & Dispatch Invite
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
