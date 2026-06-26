import axios from "axios";
import { ROUTES } from "@/constants";
import { normalizeApiError } from "@/utils/apiError";

const AUTH_TOKEN_KEY = "malse_admin_token";

export const getAuthToken = () => localStorage.getItem(AUTH_TOKEN_KEY);

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    return;
  }

  localStorage.removeItem(AUTH_TOKEN_KEY);
};

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      config.headers.delete("Content-Type");
    }

    return config;
  },
  (error) => Promise.reject(normalizeApiError(error))
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const normalizedError = normalizeApiError(error);

    if (normalizedError.status === 401) {
      setAuthToken(null);

      if (window.location.pathname !== ROUTES.LOGIN) {
        window.location.href = ROUTES.LOGIN;
      }
    }

    return Promise.reject(normalizedError);
  }
);

export default apiClient;
