import apiClient from "./api";

export const dashboardService = {
  getStats: async () => {
    const { data } = await apiClient.get("/dashboard/stats");
    return data;
  },
};
