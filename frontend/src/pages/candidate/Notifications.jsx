import React, { useState, useEffect } from 'react';
import { Bell, CheckCheck, Clock } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { notificationService } from '../../services/notificationService';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { formatRelativeTime } from '../../utils/helpers';

export const Notifications = () => {
  const { fetchUnreadCount } = useNotifications();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const res = await notificationService.getNotifications(0, 30);
      if (res.success && res.data) {
        setNotifications(res.data);
      }
    } catch (err) {
      console.error('Failed to load notifications', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      fetchUnreadCount();
    } catch (err) {
      console.error('Failed to mark all as read', err);
    }
  };

  const handleMarkOne = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      fetchUnreadCount();
    } catch (err) {
      console.error('Failed to mark as read', err);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Notifications 🔔
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            System announcements, status updates, and interview notifications
          </p>
        </div>

        {notifications.some((n) => !n.isRead) && (
          <Button variant="secondary" size="sm" onClick={handleMarkAllRead} icon={CheckCheck}>
            Mark All as Read
          </Button>
        )}
      </div>

      {loading ? (
        <LoadingSpinner text="Loading notifications..." />
      ) : notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications yet"
          description="You are all caught up! New alerts regarding applications and interviews will appear here."
        />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 divide-y divide-slate-100 overflow-hidden shadow-xs">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => !n.isRead && handleMarkOne(n.id)}
              className={`p-4 sm:p-5 flex items-start space-x-4 transition-colors cursor-pointer ${
                !n.isRead ? 'bg-indigo-50/40 hover:bg-indigo-50/60' : 'hover:bg-slate-50'
              }`}
            >
              <div
                className={`w-3 h-3 rounded-full mt-1.5 shrink-0 ${
                  !n.isRead ? 'bg-indigo-600' : 'bg-slate-200'
                }`}
              />
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {formatRelativeTime(n.createdAt)}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
