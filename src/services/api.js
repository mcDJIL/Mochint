// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // GUNAKAN HARDCODE DULU
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Add token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Unauthorized access - token might be invalid or expired');
      // Optional: redirect to login if token is invalid
      // localStorage.removeItem('token');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Member API endpoints
export const memberAPI = {
  getAll: () => api.get('/members'),
  create: (memberData) => api.post('/members', memberData),
  update: (id, memberData) => api.put(`/members/${id}`, memberData),
  delete: (id) => api.delete(`/members/${id}`),
};

export const therapistAPI = {
  getAll: () => api.get('/therapists'),
  getById: (id) => api.get(`/therapists/${id}`),
  create: (therapistData) => api.post('/therapists', therapistData),
  update: (id, therapistData) => api.put(`/therapists/${id}`, therapistData),
  delete: (id) => api.delete(`/therapists/${id}`),
  search: (query) => api.get(`/therapists/search?q=${query}`),
  getStats: () => api.get('/therapists/stats'),
  getTop: (limit = 5) => api.get(`/therapists/top?limit=${limit}`),
};

export const appointmentAPI = {
  getAll: () => api.get('/appointments'),
  getById: (id) => api.get(`/appointments/${id}`),
  getByMember: (memberId) => api.get(`/appointments/member/${memberId}`),
  getByStatus: (status) => api.get(`/appointments/status/${status}`),
  create: (appointmentData) => api.post('/appointments', appointmentData),
  update: (id, appointmentData) => api.put(`/appointments/${id}`, appointmentData),
  updateStatus: (id, status) => api.put(`/appointments/${id}/status`, { status }),
  complete: (id) => api.put(`/appointments/${id}/complete`),
  delete: (id) => api.delete(`/appointments/${id}`),
};

export default api;