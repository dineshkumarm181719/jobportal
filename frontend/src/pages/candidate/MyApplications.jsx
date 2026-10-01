import React, { useState, useEffect } from 'react';
import { applicationService } from '../../services/applicationService';
import { ApplicationCard } from '../../components/common/ApplicationCard';
import { Pagination } from '../../components/common/Pagination';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Modal } from '../../components/common/Modal';
import { Badge } from '../../components/common/Badge';
import { formatDate } from '../../utils/helpers';
import { Building2, Calendar, FileText, Video } from 'lucide-react';

export const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [pageData, setPageData] = useState({ page: 0, totalPages: 1, totalElements: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');
  const [selectedApp, setSelectedApp] = useState(null);
  const [appToWithdraw, setAppToWithdraw] = useState(null);
  const [withdrawing, setWithdrawing] = useState(false);

  const fetchApplications = async (page = 0) => {
    setLoading(true);
    try {
      const res = await applicationService.getMyApplications(page, 10);
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
    fetchApplications(0);
  }, []);

  const handleWithdraw = async () => {
    if (!appToWithdraw) return;
    setWithdrawing(true);
    try {
      await applicationService.updateStatus(appToWithdraw.id, 'WITHDRAWN');
      setApplications((prev) =>
        prev.map((a) => (a.id === appToWithdraw.id ? { ...a, status: 'WITHDRAWN' } : a))
      );
    } catch (err) {
      console.error('Failed to withdraw application', err);
    } finally {
      setWithdrawing(false);
      setAppToWithdraw(null);
    }
  };

  const filteredApps = applications.filter((app) => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'SHORTLISTED') return app.status === 'SHORTLISTED';
    if (activeTab === 'INTERVIEWS') return app.status === 'INTERVIEW_SCHEDULED';
    if (activeTab === 'OFFERS') return app.status === 'SELECTED';
    return true;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          My Applications 📋
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Monitor your job application pipeline, interview requests, and recruiter decisions
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 pb-2 text-xs font-bold overflow-x-auto">
        {['ALL', 'SHORTLISTED', 'INTERVIEWS', 'OFFERS'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl transition-all shrink-0 ${
              activeTab === tab
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.replace('_', ' ')}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner text="Fetching your submitted applications..." />
      ) : filteredApps.length === 0 ? (
        <EmptyState
          title="No applications in this category"
          description="You don't have any applications matching this status right now."
          actionText="Search Jobs"
          onAction={() => (window.location.href = '/candidate/jobs')}
        />
      ) : (
        <div className="space-y-4">
          {filteredApps.map((app) => (
            <div key={app.id} className="relative">
              <ApplicationCard
                application={app}
                onViewDetails={(a) => setSelectedApp(a)}
                isRecruiterView={false}
              />
              {app.status === 'APPLIED' && (
                <button
                  onClick={() => setAppToWithdraw(app)}
                  className="absolute top-5 right-5 text-xs text-rose-600 hover:underline font-semibold"
                >
                  Withdraw
                </button>
              )}
            </div>
          ))}

          <Pagination
            currentPage={pageData.page}
            totalPages={pageData.totalPages}
            totalElements={pageData.totalElements}
            onPageChange={(p) => fetchApplications(p)}
          />
        </div>
      )}

      {/* Details Modal */}
      <Modal
        isOpen={!!selectedApp}
        onClose={() => setSelectedApp(null)}
        title="Application Details"
        subtitle={selectedApp?.jobTitle}
        maxWidth="max-w-lg"
      >
        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-indigo-600" />
              <span className="font-bold text-slate-900">{selectedApp?.companyName}</span>
            </div>
            <Badge status={selectedApp?.status}>{selectedApp?.status}</Badge>
          </div>

          <div>
            <p className="text-slate-500 font-medium">Applied Date:</p>
            <p className="font-bold text-slate-800">{formatDate(selectedApp?.appliedAt)}</p>
          </div>

          {selectedApp?.coverLetter && (
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <p className="font-bold text-slate-700 mb-1">Your Cover Note:</p>
              <p className="text-slate-600 leading-relaxed italic">{selectedApp?.coverLetter}</p>
            </div>
          )}

          {selectedApp?.interview && (
            <div className="bg-indigo-50/70 p-4 rounded-xl border border-indigo-100 space-y-2">
              <div className="flex items-center space-x-2 text-indigo-900 font-bold">
                <Video className="w-4 h-4 text-indigo-600" />
                <span>Interview Scheduled</span>
              </div>
              <p className="text-slate-700">
                Date: {formatDate(selectedApp.interview.interviewDate)} at {selectedApp.interview.interviewTime}
              </p>
              {selectedApp.interview.meetingLink && (
                <a
                  href={selectedApp.interview.meetingLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block text-indigo-600 font-bold hover:underline"
                >
                  Join Meeting Room →
                </a>
              )}
            </div>
          )}
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!appToWithdraw}
        onClose={() => setAppToWithdraw(null)}
        onConfirm={handleWithdraw}
        title="Withdraw Application"
        message="Are you sure you want to withdraw your application? This will notify the recruiter and cancel any active screening."
        confirmText="Withdraw Application"
        variant="danger"
        loading={withdrawing}
      />
    </div>
  );
};
