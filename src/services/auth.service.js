import apiClient from "./api";

export const authService = {
  login: async (credentials) => {
    const { data } = await apiClient.post("/auth/login", credentials);
    return data;
  },

  logout: async () => {
    const { data } = await apiClient.post("/auth/logout");
    return data;
  },

  getProfile: async () => {
    const { data } = await apiClient.get("/auth/me");
    return data;
  },
};
