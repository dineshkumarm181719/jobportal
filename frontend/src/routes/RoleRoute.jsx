import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const RoleRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading, getDashboardPath } = useAuth();

  if (loading) {
    return <LoadingSpinner text="Verifying permissions..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to={getDashboardPath()} replace />;
  }

  return children;
};
