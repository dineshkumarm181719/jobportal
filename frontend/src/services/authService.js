import api from './api';

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.success && response.data.data.token) {
      localStorage.setItem('careersync_token', response.data.data.token);
      localStorage.setItem('careersync_user', JSON.stringify(response.data.data));
    }
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.success && response.data.data.token) {
      localStorage.setItem('careersync_token', response.data.data.token);
      localStorage.setItem('careersync_user', JSON.stringify(response.data.data));
    }
    return response.data;
  },

  resetPassword: async (data) => {
    const response = await api.post('/auth/reset-password', data);
    return response.data;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore
    } finally {
      localStorage.removeItem('careersync_token');
      localStorage.removeItem('careersync_user');
    }
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('careersync_user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },
};
