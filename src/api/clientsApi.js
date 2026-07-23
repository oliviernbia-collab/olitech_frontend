import apiClient from './client';

export async function fetchClients() {
  const res = await apiClient.get('/clients');
  return res.data.clients;
}

export async function createClient(data) {
  const res = await apiClient.post('/clients', data);
  return res.data;
}

export async function updateClient(id, data) {
  const res = await apiClient.put(`/clients/${id}`, data);
  return res.data;
}

export async function deleteClient(id) {
  const res = await apiClient.delete(`/clients/${id}`);
  return res.data;
}
