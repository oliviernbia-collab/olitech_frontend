import apiClient from './client';

export async function login(email, password) {
  const res = await apiClient.post('/auth/login', { email, password });
  return res.data;
}

export async function fetchMe() {
  const res = await apiClient.get('/auth/me');
  return res.data;
}
