import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL || "https://flancraftweb-backend.onrender.com";

const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Interceptor para añadir token a cada petición
axiosInstance.interceptors.request.use((config) => {
  const userData = localStorage.getItem("flan_user");
  if (userData) {
    const parsed = JSON.parse(userData);
    if (parsed.token) {
      config.headers.Authorization = `Bearer ${parsed.token}`;
    }
  }
  return config;
});

export default axiosInstance;
