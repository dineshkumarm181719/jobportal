import api from './api';

export const companyService = {
  getCompanies: async (params = {}) => {
    const response = await api.get('/companies', { params });
    return response.data;
  },

  getCompanyById: async (id) => {
    const response = await api.get(`/companies/${id}`);
    return response.data;
  },

  createCompany: async (companyData) => {
    const response = await api.post('/companies', companyData);
    return response.data;
  },

  updateCompany: async (id, companyData) => {
    const response = await api.put(`/companies/${id}`, companyData);
    return response.data;
  },

  getCompanyJobs: async (id, params = {}) => {
    const response = await api.get(`/companies/${id}/jobs`, { params });
    return response.data;
  },

  getCompanyRecruiters: async (id, params = {}) => {
    const response = await api.get(`/companies/${id}/recruiters`, { params });
    return response.data;
  },
};
