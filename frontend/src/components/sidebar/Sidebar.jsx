import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Search,
  FileText,
  Calendar,
  User,
  Bell,
  Briefcase,
  PlusCircle,
  Users,
  Building,
  Shield,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../utils/constants';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getNavItems = () => {
    switch (user?.role) {
      case ROLES.CANDIDATE:
        return [
          { to: '/candidate/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
          { to: '/candidate/jobs', icon: Search, label: 'Find Jobs' },
          { to: '/candidate/applications', icon: FileText, label: 'My Applications' },
          { to: '/candidate/interviews', icon: Calendar, label: 'Interviews' },
          { to: '/candidate/profile', icon: User, label: 'My Profile & CV' },
          { to: '/candidate/notifications', icon: Bell, label: 'Notifications' },
        ];
      case ROLES.RECRUITER:
        return [
          { to: '/recruiter/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
          { to: '/recruiter/jobs', icon: Briefcase, label: 'Manage Jobs' },
          { to: '/recruiter/create-job', icon: PlusCircle, label: 'Post New Job' },
          { to: '/recruiter/applications', icon: FileText, label: 'Applications' },
          { to: '/recruiter/interviews', icon: Calendar, label: 'Interviews' },
          { to: '/recruiter/profile', icon: User, label: 'Recruiter Profile' },
          { to: '/recruiter/notifications', icon: Bell, label: 'Notifications' },
        ];
      case ROLES.COMPANY_ADMIN:
        return [
          { to: '/company/dashboard', icon: LayoutDashboard, label: 'Company Overview' },
          { to: '/company/profile', icon: Building, label: 'Company Profile' },
          { to: '/company/recruiters', icon: Users, label: 'Manage Recruiters' },
          { to: '/company/jobs', icon: Briefcase, label: 'Company Jobs' },
          { to: '/recruiter/notifications', icon: Bell, label: 'Notifications' },
        ];
      case ROLES.SYSTEM_ADMIN:
        return [
          { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Admin Overview' },
          { to: '/admin/users', icon: Users, label: 'Platform Users' },
          { to: '/admin/companies', icon: Building, label: 'Companies' },
          { to: '/admin/jobs', icon: Briefcase, label: 'All Jobs' },
          { to: '/recruiter/notifications', icon: Bell, label: 'System Alerts' },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Logo Brand Header */}
          <div className="h-16 flex items-center px-6 border-b border-slate-100">
            <NavLink to="/" className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="text-lg font-black tracking-tight text-slate-900">
                Career<span className="text-indigo-600">Sync</span>
              </span>
            </NavLink>
          </div>

          {/* Navigation Items */}
          <div className="p-4 space-y-1">
            <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Menu Navigation
            </p>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-600 shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-40" />
              </NavLink>
            ))}
          </div>
        </div>

        {/* User Card & Logout Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center space-x-3 mb-3 p-2 bg-white rounded-xl border border-slate-200/60 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-900 truncate">{user?.name}</p>
              <p className="text-[10px] text-slate-500 font-medium truncate">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
