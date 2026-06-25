import apiClient from "./api";

export const healthService = {
  check: async () => {
    const { data } = await apiClient.get("/health");
    return data;
  },
};
