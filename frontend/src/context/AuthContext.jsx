import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { ROLES } from '../utils/constants';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = authService.getCurrentUser();
    const token = localStorage.getItem('careersync_token');
    if (savedUser && token) {
      setUser(savedUser);
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    if (res.success && res.data) {
      setUser(res.data);
      return res.data;
    }
    throw new Error(res.message || 'Login failed');
  };

  const register = async (userData) => {
    const res = await authService.register(userData);
    if (res.success && res.data) {
      setUser(res.data);
      return res.data;
    }
    throw new Error(res.message || 'Registration failed');
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const isCandidate = () => user?.role === ROLES.CANDIDATE;
  const isRecruiter = () => user?.role === ROLES.RECRUITER;
  const isCompanyAdmin = () => user?.role === ROLES.COMPANY_ADMIN;
  const isAdmin = () => user?.role === ROLES.SYSTEM_ADMIN;

  const getDashboardPath = () => {
    if (!user) return '/login';
    switch (user.role) {
      case ROLES.CANDIDATE:
        return '/candidate/dashboard';
      case ROLES.RECRUITER:
        return '/recruiter/dashboard';
      case ROLES.COMPANY_ADMIN:
        return '/company/dashboard';
      case ROLES.SYSTEM_ADMIN:
        return '/admin/dashboard';
      default:
        return '/';
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    setUser,
    isCandidate,
    isRecruiter,
    isCompanyAdmin,
    isAdmin,
    getDashboardPath,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
