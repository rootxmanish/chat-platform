import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "/api";

// Create axios instance with base config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Request interceptor - attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("nexchat_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle global errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clear local storage and redirect
      localStorage.removeItem("nexchat_token");
      localStorage.removeItem("nexchat_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
