import api from './api';

export const programService = {
  getAll: (params) => api.get('/programs', { params }),
  getById: (id) => api.get(`/programs/${id}`),
  create: (data) => api.post('/programs', data),
  update: (id, data) => api.put(`/programs/${id}`, data),
  delete: (id) => api.delete(`/programs/${id}`),

  // Program Levels
  getLevels: (programId, params) => api.get(`/programs/${programId}/levels`, { params }),
  createLevel: (programId, data) => api.post(`/programs/${programId}/levels`, data),
  updateLevel: (programId, levelId, data) => api.put(`/programs/${programId}/levels/${levelId}`, data),
  deleteLevel: (programId, levelId) => api.delete(`/programs/${programId}/levels/${levelId}`),
};

