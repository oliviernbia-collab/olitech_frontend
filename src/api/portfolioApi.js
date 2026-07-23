import apiClient from './client';

export async function fetchPortfolioItems() {
  const res = await apiClient.get('/portfolio');
  return res.data.items;
}

export async function createPortfolioItem(data) {
  const res = await apiClient.post('/portfolio', data);
  return res.data;
}

export async function updatePortfolioItem(id, data) {
  const res = await apiClient.put(`/portfolio/${id}`, data);
  return res.data;
}

export async function deletePortfolioItem(id) {
  const res = await apiClient.delete(`/portfolio/${id}`);
  return res.data;
}
