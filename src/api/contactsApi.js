import apiClient from './client';

export async function fetchContacts() {
  const res = await apiClient.get('/contacts');
  return res.data.contacts;
}

export async function markContactRead(id, isRead) {
  const res = await apiClient.patch(`/contacts/${id}/read`, { is_read: isRead });
  return res.data;
}

export async function deleteContact(id) {
  const res = await apiClient.delete(`/contacts/${id}`);
  return res.data;
}
