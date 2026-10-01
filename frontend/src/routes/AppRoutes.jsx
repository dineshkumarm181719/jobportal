import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { MainLayout } from '../layouts/MainLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';

// Route Guards
import { ProtectedRoute } from './ProtectedRoute';
import { RoleRoute } from './RoleRoute';
import { ROLES } from '../utils/constants';

// Public Pages
import { Home } from '../pages/Home';
import { JobSearch } from '../pages/candidate/JobSearch';
import { JobDetails } from '../pages/candidate/JobDetails';
import { NotFound } from '../pages/NotFound';

// Auth Pages
import { Login } from '../pages/auth/Login';
import { Register } from '../pages/auth/Register';
import { ForgotPassword } from '../pages/auth/ForgotPassword';

// Candidate Pages
import { CandidateDashboard } from '../pages/candidate/CandidateDashboard';
import { CandidateProfile } from '../pages/candidate/CandidateProfile';
import { MyApplications } from '../pages/candidate/MyApplications';
import { MyInterviews } from '../pages/candidate/MyInterviews';
import { Notifications } from '../pages/candidate/Notifications';

// Recruiter Pages
import { RecruiterDashboard } from '../pages/recruiter/RecruiterDashboard';
import { ManageJobs } from '../pages/recruiter/ManageJobs';
import { CreateJob } from '../pages/recruiter/CreateJob';
import { EditJob } from '../pages/recruiter/EditJob';
import { JobApplications } from '../pages/recruiter/JobApplications';
import { ScheduleInterview } from '../pages/recruiter/ScheduleInterview';
import { RecruiterProfile } from '../pages/recruiter/RecruiterProfile';

// Company Admin Pages
import { CompanyDashboard } from '../pages/company/CompanyDashboard';
import { CompanyProfile } from '../pages/company/CompanyProfile';
import { ManageRecruiters } from '../pages/company/ManageRecruiters';
import { CompanyJobs } from '../pages/company/CompanyJobs';

// System Admin Pages
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { ManageUsers } from '../pages/admin/ManageUsers';
import { ManageCompanies } from '../pages/admin/ManageCompanies';
import { ManageJobs as AdminManageJobs } from '../pages/admin/ManageJobs';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages with Main Layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<JobSearch />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
      </Route>

      {/* Auth Pages with Split Layout */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* Candidate Protected Portal */}
      <Route
        path="/candidate"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={[ROLES.CANDIDATE]}>
              <DashboardLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/candidate/dashboard" replace />} />
        <Route path="dashboard" element={<CandidateDashboard />} />
        <Route path="jobs" element={<JobSearch />} />
        <Route path="profile" element={<CandidateProfile />} />
        <Route path="applications" element={<MyApplications />} />
        <Route path="interviews" element={<MyInterviews />} />
        <Route path="notifications" element={<Notifications />} />
      </Route>

      {/* Recruiter Protected Portal */}
      <Route
        path="/recruiter"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={[ROLES.RECRUITER, ROLES.COMPANY_ADMIN, ROLES.SYSTEM_ADMIN]}>
              <DashboardLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/recruiter/dashboard" replace />} />
        <Route path="dashboard" element={<RecruiterDashboard />} />
        <Route path="jobs" element={<ManageJobs />} />
        <Route path="create-job" element={<CreateJob />} />
        <Route path="edit-job/:id" element={<EditJob />} />
        <Route path="applications" element={<JobApplications />} />
        <Route path="interviews" element={<ScheduleInterview />} />
        <Route path="profile" element={<RecruiterProfile />} />
        <Route path="notifications" element={<Notifications />} />
      </Route>

      {/* Company Admin Protected Portal */}
      <Route
        path="/company"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={[ROLES.COMPANY_ADMIN, ROLES.SYSTEM_ADMIN]}>
              <DashboardLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/company/dashboard" replace />} />
        <Route path="dashboard" element={<CompanyDashboard />} />
        <Route path="profile" element={<CompanyProfile />} />
        <Route path="recruiters" element={<ManageRecruiters />} />
        <Route path="jobs" element={<CompanyJobs />} />
      </Route>

      {/* System Admin Protected Portal */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={[ROLES.SYSTEM_ADMIN]}>
              <DashboardLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="companies" element={<ManageCompanies />} />
        <Route path="jobs" element={<AdminManageJobs />} />
      </Route>

      {/* 404 Catch-All */}
      <Route element={<MainLayout />}>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};
