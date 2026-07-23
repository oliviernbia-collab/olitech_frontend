import apiClient from './client';

export async function fetchSettings() {
  const res = await apiClient.get('/settings');
  return res.data.settings;
}

export async function updateSettings(data) {
  const res = await apiClient.put('/settings', data);
  return res.data;
}
