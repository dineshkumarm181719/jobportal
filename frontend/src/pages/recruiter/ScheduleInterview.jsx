import React, { useState, useEffect } from 'react';
import { interviewService } from '../../services/interviewService';
import { InterviewCard } from '../../components/common/InterviewCard';
import { Pagination } from '../../components/common/Pagination';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { Calendar } from 'lucide-react';

export const ScheduleInterview = () => {
  const [interviews, setInterviews] = useState([]);
  const [pageData, setPageData] = useState({ page: 0, totalPages: 1, totalElements: 0 });
  const [loading, setLoading] = useState(true);

  const fetchInterviews = async (page = 0) => {
    setLoading(true);
    try {
      const res = await interviewService.getInterviews(page, 10);
      if (res.success && res.data) {
        setInterviews(res.data);
        setPageData({
          page: res.page,
          totalPages: res.totalPages,
          totalElements: res.totalElements,
        });
      }
    } catch (err) {
      console.error('Failed to load interviews', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews(0);
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      const res = await interviewService.updateStatus(id, status);
      if (res.success) {
        setInterviews((prev) =>
          prev.map((i) => (i.id === id ? { ...i, status } : i))
        );
      }
    } catch (err) {
      console.error('Failed to update interview status', err);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Recruitment Interviews 📅
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Manage candidate technical screenings and video interview schedules
        </p>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading candidate interview calendar..." />
      ) : interviews.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No interviews scheduled yet"
          description="Shortlist candidates from your applications pipeline to schedule technical rounds."
        />
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {interviews.map((interview) => (
              <InterviewCard
                key={interview.id}
                interview={interview}
                isRecruiter={true}
                onStatusUpdate={handleStatusUpdate}
              />
            ))}
          </div>

          <Pagination
            currentPage={pageData.page}
            totalPages={pageData.totalPages}
            totalElements={pageData.totalElements}
            onPageChange={(p) => fetchInterviews(p)}
          />
        </div>
      )}
    </div>
  );
};
