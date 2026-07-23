import apiClient from './client';

export async function fetchServices() {
  const res = await apiClient.get('/services');
  return res.data.services;
}

export async function createService(data) {
  const res = await apiClient.post('/services', data);
  return res.data;
}

export async function updateService(id, data) {
  const res = await apiClient.put(`/services/${id}`, data);
  return res.data;
}

export async function deleteService(id) {
  const res = await apiClient.delete(`/services/${id}`);
  return res.data;
}
