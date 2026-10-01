import api from './api';

export const applicationService = {
  applyForJob: async (applicationData) => {
    const response = await api.post('/applications', applicationData);
    return response.data;
  },

  getMyApplications: async (page = 0, size = 10) => {
    const response = await api.get('/applications/my', {
      params: { page, size },
    });
    return response.data;
  },

  getRecruiterApplications: async (params = {}) => {
    const response = await api.get('/applications/recruiter', { params });
    return response.data;
  },

  getApplicationById: async (id) => {
    const response = await api.get(`/applications/${id}`);
    return response.data;
  },

  updateStatus: async (id, status, note = '') => {
    const response = await api.put(`/applications/${id}/status`, { status, note });
    return response.data;
  },
};
