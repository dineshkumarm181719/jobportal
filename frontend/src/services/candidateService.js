import api from './api';

export const candidateService = {
  getProfile: async () => {
    const response = await api.get('/candidates/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/candidates/profile', profileData);
    return response.data;
  },

  uploadResume: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/candidates/resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteResume: async (resumeId) => {
    const response = await api.delete(`/candidates/resumes/${resumeId}`);
    return response.data;
  },

  getDashboardStats: async () => {
    const response = await api.get('/candidates/dashboard-stats');
    return response.data;
  },

  getCandidateById: async (id) => {
    const response = await api.get(`/candidates/${id}`);
    return response.data;
  },
};
