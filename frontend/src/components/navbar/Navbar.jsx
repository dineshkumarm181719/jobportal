import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Bell,
  User,
  LogOut,
  ChevronDown,
  Sparkles,
  Check,
  Search,
  PlusCircle,
  Shield,
  Building,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { Badge } from '../common/Badge';
import { formatRelativeTime } from '../../utils/helpers';

export const Navbar = ({ toggleSidebar, showSidebarToggle = false }) => {
  const { user, logout, getDashboardPath, isAuthenticated } = useAuth();
  const { unreadCount, notifications, fetchNotifications, markAsRead, markAllAsRead } = useNotifications();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const navigate = useNavigate();

  const notifRef = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotifToggle = () => {
    if (!isNotifOpen) {
      fetchNotifications();
    }
    setIsNotifOpen(!isNotifOpen);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-40 glass-nav border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left Brand & Toggle */}
          <div className="flex items-center space-x-4">
            {showSidebarToggle && (
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 lg:hidden focus:outline-none"
                title="Toggle Sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
                <Briefcase className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-tight text-slate-900 flex items-center">
                  Career<span className="text-indigo-600">Sync</span>
                </span>
                <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase -mt-1">
                  Career Hub
                </span>
              </div>
            </Link>

            {/* Main Navigation Links */}
            <div className="hidden md:flex items-center space-x-1 pl-6">
              <Link
                to="/jobs"
                className="px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50 transition-colors flex items-center space-x-1.5"
              >
                <Search className="w-4 h-4 text-slate-400" />
                <span>Explore Jobs</span>
              </Link>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                {/* Post a Job button for Recruiters / Admins */}
                {(user?.role === 'RECRUITER' || user?.role === 'COMPANY_ADMIN' || user?.role === 'SYSTEM_ADMIN') && (
                  <Link
                    to="/recruiter/create-job"
                    className="hidden sm:inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold text-xs border border-indigo-200 transition-colors"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Post a Job</span>
                  </Link>
                )}

                {/* Notification Dropdown */}
                <div className="relative" ref={notifRef}>
                  <button
                    onClick={handleNotifToggle}
                    className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors focus:outline-none"
                    title="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {isNotifOpen && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white shadow-2xl border border-slate-100 py-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="flex items-center justify-between px-4 pb-3 border-b border-slate-100">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-bold text-slate-900">Notifications</h4>
                          {unreadCount > 0 && (
                            <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full font-bold">
                              {unreadCount} new
                            </span>
                          )}
                        </div>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold transition-colors"
                          >
                            Mark all as read
                          </button>
                        )}
                      </div>

                      <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                        {notifications.length === 0 ? (
                          <div className="p-8 text-center text-xs text-slate-400">
                            No notifications yet
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <div
                              key={n.id}
                              onClick={() => markAsRead(n.id)}
                              className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer flex items-start space-x-3 ${
                                !n.isRead ? 'bg-indigo-50/30' : ''
                              }`}
                            >
                              <div
                                className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                                  !n.isRead ? 'bg-indigo-600' : 'bg-transparent'
                                }`}
                              />
                              <div className="flex-1">
                                <p className="text-xs font-bold text-slate-900">{n.title}</p>
                                <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">{n.message}</p>
                                <p className="text-[10px] text-slate-400 mt-1">
                                  {formatRelativeTime(n.createdAt)}
                                </p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      <div className="pt-2 px-4 border-t border-slate-100 text-center">
                        <Link
                          to={user?.role === 'CANDIDATE' ? '/candidate/notifications' : '/recruiter/notifications'}
                          onClick={() => setIsNotifOpen(false)}
                          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                        >
                          View all notifications →
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* User Profile Menu */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors focus:outline-none border border-transparent hover:border-slate-200"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="hidden sm:flex flex-col text-left">
                      <span className="text-xs font-bold text-slate-900 leading-tight line-clamp-1 max-w-[120px]">
                        {user.name}
                      </span>
                      <span className="text-[10px] font-semibold text-indigo-600">
                        {user.role.replace('_', ' ')}
                      </span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-900 line-clamp-1">{user.name}</p>
                        <p className="text-[11px] text-slate-500 line-clamp-1">{user.email}</p>
                        <Badge variant="indigo" className="mt-1.5">
                          {user.role.replace('_', ' ')}
                        </Badge>
                      </div>

                      <div className="py-1">
                        <Link
                          to={getDashboardPath()}
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center space-x-2 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                        >
                          <Sparkles className="w-4 h-4 text-indigo-500" />
                          <span>Portal Dashboard</span>
                        </Link>

                        {user.role === 'CANDIDATE' && (
                          <Link
                            to="/candidate/profile"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center space-x-2 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                          >
                            <User className="w-4 h-4 text-slate-400" />
                            <span>My Profile & Resume</span>
                          </Link>
                        )}

                        {user.role === 'COMPANY_ADMIN' && (
                          <>
                            <Link
                              to="/company/recruiters"
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center space-x-2 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                            >
                              <Users className="w-4 h-4 text-slate-400" />
                              <span>Manage Recruiters</span>
                            </Link>
                            <Link
                              to="/company/jobs"
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center space-x-2 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                            >
                              <Briefcase className="w-4 h-4 text-slate-400" />
                              <span>Company Jobs</span>
                            </Link>
                            <Link
                              to="/company/profile"
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center space-x-2 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                            >
                              <Building className="w-4 h-4 text-slate-400" />
                              <span>Company Profile</span>
                            </Link>
                          </>
                        )}

                        {user.role === 'SYSTEM_ADMIN' && (
                          <>
                            <Link
                              to="/admin/users"
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center space-x-2 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                            >
                              <Users className="w-4 h-4 text-slate-400" />
                              <span>Platform Users</span>
                            </Link>
                            <Link
                              to="/admin/companies"
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center space-x-2 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                            >
                              <Building className="w-4 h-4 text-slate-400" />
                              <span>Manage Companies</span>
                            </Link>
                            <Link
                              to="/admin/jobs"
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center space-x-2 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                            >
                              <Briefcase className="w-4 h-4 text-slate-400" />
                              <span>All System Jobs</span>
                            </Link>
                          </>
                        )}

                        {user.role === 'RECRUITER' && (
                          <>
                            <Link
                              to="/recruiter/jobs"
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center space-x-2 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                            >
                              <Briefcase className="w-4 h-4 text-slate-400" />
                              <span>Manage Jobs</span>
                            </Link>
                            <Link
                              to="/recruiter/profile"
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center space-x-2 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                            >
                              <User className="w-4 h-4 text-slate-400" />
                              <span>Recruiter Profile</span>
                            </Link>
                          </>
                        )}
                      </div>

                      <div className="pt-1 border-t border-slate-100">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-2 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4 text-rose-500" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 shadow-sm shadow-indigo-200 transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
