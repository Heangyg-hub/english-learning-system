import api from './api';

export const dictionaryService = {
  search: (params) => api.get('/vocabulary', { params }),
  getWordById: (id) => api.get(`/vocabulary/${id}`),
};

