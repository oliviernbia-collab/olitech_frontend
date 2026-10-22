import axios from 'axios';

const TOKEN_KEY = 'olitech_admin_token';
const ADMIN_KEY = 'olitech_admin_info';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Session expiree/invalide (token mort) : on nettoie et on renvoie vers la
// connexion au lieu de laisser l'admin bloque sur une page qui ne charge
// plus rien, sans jamais lui dire pourquoi.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRoute = error.config?.url?.includes('/auth/login');
    if (error.response?.status === 401 && !isAuthRoute) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(ADMIN_KEY);
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
