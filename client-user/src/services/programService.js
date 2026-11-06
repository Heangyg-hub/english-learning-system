import api from './api';

export const programService = {
  getAll: (params) => api.get('/programs', { params: { isActive: true, ...params } }),
  getById: (id) => api.get(`/programs/${id}`),
  getLevels: (programId, params) => api.get(`/programs/${programId}/levels`, { params: { isActive: true, ...params } }),
};

