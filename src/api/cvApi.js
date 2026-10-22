import apiClient from './client';

export async function fetchCvTemplates() {
  const res = await apiClient.get('/cv-templates');
  return res.data.templates;
}

export async function fetchCvTemplate(slug) {
  const res = await apiClient.get(`/cv-templates/${slug}`);
  return res.data.template;
}

export async function fetchCvTemplatesAdmin() {
  const res = await apiClient.get('/cv-templates/admin');
  return res.data.templates;
}

export async function updateCvTemplate(id, data) {
  const res = await apiClient.put(`/cv-templates/${id}`, data);
  return res.data;
}

export async function createCvOrder(formData) {
  const res = await apiClient.post('/cv-orders', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

export async function fetchCvOrderStatus(reference) {
  const res = await apiClient.get(`/cv-orders/${reference}`);
  return res.data.order;
}

export function getCvDownloadUrl(reference) {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  return `${apiUrl}/cv-orders/download/${reference}`;
}

export async function fetchCvOrdersAdmin() {
  const res = await apiClient.get('/cv-orders/admin');
  return res.data.orders;
}

export async function fetchCvOrderAdmin(id) {
  const res = await apiClient.get(`/cv-orders/admin/${id}`);
  return res.data.order;
}

export async function markCvOrderPaidManually(id) {
  const res = await apiClient.post(`/cv-orders/admin/${id}/mark-paid`);
  return res.data;
}

export async function initiateCvPayment(orderId, paymentMethod) {
  const res = await apiClient.post(`/cv-payments/${orderId}/initiate`, {
    payment_method: paymentMethod,
  });
  return res.data;
}
