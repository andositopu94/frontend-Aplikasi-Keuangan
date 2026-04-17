import axios, { InternalAxiosRequestConfig } from "axios";
import { error } from "console";
import { config } from "process";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://103.197.190.226:8585/api";

console.log("API Base URL:", API_BASE_URL);

const apiClient = axios.create({
    // baseURL: "http://localhost:8080/api",
  baseURL: API_BASE_URL,
    headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }, 
  withCredentials: true
});


apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;