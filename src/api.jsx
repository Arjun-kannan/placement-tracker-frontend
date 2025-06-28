import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || "https://placement-tracker-backend-production.up.railway.app";

const api = axios.create({
  baseURL
});


// Add a request interceptor to include the token in the headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
