import axios, { InternalAxiosRequestConfig } from "axios";
import { error } from "console";
import { config } from "process";


const apiClient = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// Interceptor request
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => { // Gunakan tipe yang benar
    const token = localStorage.getItem('authToken');
    if (token) {
      // if (config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      // }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor response
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Hapus token dan role jika token tidak valid
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      // Redirect ke login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;