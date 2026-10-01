import api from './api';

export const adminService = {
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  getUsers: async (role = null, page = 0, size = 10) => {
    const params = { page, size };
    if (role) params.role = role;
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  updateUserStatus: async (id, status) => {
    const response = await api.put(`/admin/users/${id}/status`, { status });
    return response.data;
  },
};
