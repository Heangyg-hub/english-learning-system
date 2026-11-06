import api from './api';

export const vocabularyService = {
  getAll: (params) => api.get('/vocabulary', { params }),
  getById: (id) => api.get(`/vocabulary/${id}`),
  create: (data) => api.post('/vocabulary', data),
  update: (id, data) => api.put(`/vocabulary/${id}`, data),
  delete: (id) => api.delete(`/vocabulary/${id}`),
  getStats: () => api.get('/vocabulary/stats'),
};

