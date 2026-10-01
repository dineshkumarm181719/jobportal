import api from './api';

export const interviewService = {
  scheduleInterview: async (interviewData) => {
    const response = await api.post('/interviews', interviewData);
    return response.data;
  },

  getInterviews: async (page = 0, size = 10) => {
    const response = await api.get('/interviews', {
      params: { page, size },
    });
    return response.data;
  },

  getUpcomingInterviews: async () => {
    const response = await api.get('/interviews/upcoming');
    return response.data;
  },

  updateStatus: async (id, status, notes = '') => {
    const response = await api.put(`/interviews/${id}`, { status, notes });
    return response.data;
  },
};
