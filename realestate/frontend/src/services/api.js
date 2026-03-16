import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('API Error details:', err.response?.data || err.message, err.config?.url);
    if (err.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/';
    }
    return Promise.reject(err);
  }
);

// Auth
export const login = (data) => API.post('/auth/login', data);
export const register = (data) => API.post('/auth/register', data);

// Properties
export const getProperties = () => API.get('/properties');
export const getFeatured = () => API.get('/properties/featured');
export const getProperty = (id) => API.get(`/properties/${id}`);
export const searchProperties = (params) => API.get('/properties/search', { params });
export const keywordSearch = (q) => API.get('/properties/keyword', { params: { q } });
export const createProperty = (data) => API.post('/properties', data);
export const updateProperty = (id, data) => API.put(`/properties/${id}`, data);
export const deleteProperty = (id) => API.delete(`/properties/${id}`);
export const uploadImage = (id, formData) =>
  API.post(`/properties/${id}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
export const getPropertyStats = () => API.get('/properties/stats');

// Reviews
export const getReviews = (propertyId) => API.get(`/reviews/property/${propertyId}`);
export const createReview = (data) => API.post('/reviews', data);
export const deleteReview = (id) => API.delete(`/reviews/${id}`);

// Bookings
export const createBooking = (data) => API.post('/bookings', data);
export const getMyBookings = () => API.get('/bookings/my');
export const getAllBookings = () => API.get('/bookings');
export const updateBookingStatus = (id, status) =>
  API.put(`/bookings/${id}/status`, { status });
export const cancelBooking = (id) => API.put(`/bookings/${id}/cancel`);

export default API;

// Profile
export const getProfile = () => API.get('/users/profile');
