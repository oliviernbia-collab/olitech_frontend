import apiClient from './client';

export async function login(email, password) {
  const res = await apiClient.post('/auth/login', { email, password });
  return res.data;
}

export async function fetchMe() {
  const res = await apiClient.get('/auth/me');
  return res.data;
}

export async function updateProfile(payload) {
  const res = await apiClient.put('/auth/me', payload);
  return res.data;
}
