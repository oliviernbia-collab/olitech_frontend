import apiClient from './client';

export async function fetchFinances() {
  const res = await apiClient.get('/finances');
  return res.data.entries;
}

export async function createFinanceEntry(data) {
  const res = await apiClient.post('/finances', data);
  return res.data;
}

export async function updateFinanceEntry(id, data) {
  const res = await apiClient.put(`/finances/${id}`, data);
  return res.data;
}

export async function deleteFinanceEntry(id) {
  const res = await apiClient.delete(`/finances/${id}`);
  return res.data;
}
