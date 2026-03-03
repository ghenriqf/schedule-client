import axios from "axios";

export const AUTH_TOKEN_KEY = "@App:token";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      window.location.href = "/login";
    }

    if (!error.response) {
      console.error("Servidor indisponível");
    }

    return Promise.reject(error);
  },
);

export default api;
