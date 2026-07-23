import apiClient from './client';

export async function fetchTeamMembers() {
  const res = await apiClient.get('/team');
  return res.data.members;
}

export async function createTeamMember(data) {
  const res = await apiClient.post('/team', data);
  return res.data;
}

export async function updateTeamMember(id, data) {
  const res = await apiClient.put(`/team/${id}`, data);
  return res.data;
}

export async function deleteTeamMember(id) {
  const res = await apiClient.delete(`/team/${id}`);
  return res.data;
}
