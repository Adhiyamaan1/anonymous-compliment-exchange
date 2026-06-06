import axios from 'axios';

// Normalise base URL – VITE_API_URL may already contain '/api'.
// Strip any trailing '/api' (and extra slashes) then always append a single '/api'.
const API_BASE = (import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/,'')
  : 'http://localhost:8000')
  .replace(/\/+$/,'') + '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto‑refresh token on 401 responses
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refresh = localStorage.getItem('refresh_token');
      if (refresh) {
        try {
          const { data } = await axios.post(`${API_BASE}/auth/token/refresh/`, { refresh });
          localStorage.setItem('access_token', data.access);
          api.defaults.headers.common.Authorization = `Bearer ${data.access}`;
          original.headers.Authorization = `Bearer ${data.access}`;
          return api(original);
        } catch {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// ----- Auth -----
export const authApi = {
  register: (data) => api.post('/auth/register/', data),
  login: (data) => api.post('/auth/login/', data), // trailing slash required
  logout: (refresh) => api.post('/auth/logout/', { refresh }),
  getProfile: () => api.get('/auth/profile/'),
  updateProfile: (data) => api.patch('/auth/profile/', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getPublicProfile: (shareId) => api.get(`/auth/user/${shareId}/`),
  regenerateLink: () => api.post('/auth/profile/regenerate-link/'),
};

// ----- Messages -----
export const messagesApi = {
  sendCompliment: (shareId, data) => api.post(`/messages/send/${shareId}/`, data),
  getInbox: (params) => api.get('/messages/inbox/', { params }),
  getCompliment: (id) => api.get(`/messages/${id}/`),
  deleteCompliment: (id) => api.delete(`/messages/${id}/`),
  getStats () => api.get('/messages/stats/'),
};

// ----- Reactions -----
export const reactionsApi = {
  react: (id, data) => api.post(`/reactions/${id}/react/`, data),
  getReactions: (id) => api.get(`/reactions/${id}/react/`),
  getReplies: (id) => api.get(`/reactions/${id}/replies/`),
  addReply: (id, data) => api.post(`/reactions/${id}/replies/`, data),
};

// ----- Admin -----
export const adminApi = {
  getStats: () => api.get('/admin-panel/stats/'),
  getMessages: (params) => api.get('/admin-panel/messages/', { params }),
  flagMessage: (id) => api.post(`/admin-panel/messages/${id}/flag/`),
  deleteMessage: (id) => api.delete(`/admin-panel/messages/${id}/delete/`),
  getUsers: () => api.get('/admin-panel/users/'),
  toggleUser: (id) => api.post(`/admin-panel/users/${id}/toggle/`),
};

const API_BASE = (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/(\/api)?\/*$/, '') + '/api' : 'http://localhost:8000/api');

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-refresh token on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refresh = localStorage.getItem('refresh_token');
      if (refresh) {
        try {
          const { data } = await axios.post(`${API_BASE}/auth/token/refresh/`, { refresh });
          localStorage.setItem('access_token', data.access);
          api.defaults.headers.common.Authorization = `Bearer ${data.access}`;
          original.headers.Authorization = `Bearer ${data.access}`;
          return api(original);
        } catch {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// ----- Auth -----
export const authApi = {
  register: (data) => api.post('/auth/register/', data),
  login: (data) => api.post('/auth/login/', data),
  logout: (refresh) => api.post('/auth/logout/', { refresh }),
  getProfile: () => api.get('/auth/profile/'),
  updateProfile: (data) => api.patch('/auth/profile/', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getPublicProfile: (shareId) => api.get(`/auth/user/${shareId}/`),
  regenerateLink: () => api.post('/auth/profile/regenerate-link/'),
};

// ----- Messages -----
export const messagesApi = {
  sendCompliment: (shareId, data) => api.post(`/messages/send/${shareId}/`, data),
  getInbox: (params) => api.get('/messages/inbox/', { params }),
  getCompliment: (id) => api.get(`/messages/${id}/`),
  deleteCompliment: (id) => api.delete(`/messages/${id}/`),
  getStats: () => api.get('/messages/stats/'),
};

// ----- Reactions -----
export const reactionsApi = {
  react: (id, data) => api.post(`/reactions/${id}/react/`, data),
  getReactions: (id) => api.get(`/reactions/${id}/react/`),
  getReplies: (id) => api.get(`/reactions/${id}/replies/`),
  addReply: (id, data) => api.post(`/reactions/${id}/replies/`, data),
};

// ----- Admin -----
export const adminApi = {
  getStats: () => api.get('/admin-panel/stats/'),
  getMessages: (params) => api.get('/admin-panel/messages/', { params }),
  flagMessage: (id) => api.post(`/admin-panel/messages/${id}/flag/`),
  deleteMessage: (id) => api.delete(`/admin-panel/messages/${id}/delete/`),
  getUsers: () => api.get('/admin-panel/users/'),
  toggleUser: (id) => api.post(`/admin-panel/users/${id}/toggle/`),
};
