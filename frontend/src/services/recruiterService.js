import api from './api';

export const recruiterService = {
  getProfile: async () => {
    const response = await api.get('/recruiter/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/recruiter/profile', profileData);
    return response.data;
  },

  getMyJobs: async (page = 0, size = 10) => {
    const response = await api.get('/recruiter/jobs', {
      params: { page, size },
    });
    return response.data;
  },

  getDashboardStats: async () => {
    const response = await api.get('/recruiter/dashboard-stats');
    return response.data;
  },

  addRecruiter: async (recruiterData) => {
    const response = await api.post('/recruiter/add', recruiterData);
    return response.data;
  },
};
