import axios from 'axios';

// Create Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // reads backend URL from .env
  headers: {
    'Content-Type': 'application/json'  // always send JSON
  }
});

// Automatically attach token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // get token if exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // attach to request
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;