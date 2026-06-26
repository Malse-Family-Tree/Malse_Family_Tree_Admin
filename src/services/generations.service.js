import apiClient from "./api";

export const generationsService = {
  getAll: async () => {
    const { data } = await apiClient.get("/generations");
    return data;
  },

  getById: async (id) => {
    const { data } = await apiClient.get(`/generations/${id}`);
    return data;
  },

  create: async (payload) => {
    const { data } = await apiClient.post("/generations", payload);
    return data;
  },

  update: async (id, payload) => {
    const { data } = await apiClient.put(`/generations/${id}`, payload);
    return data;
  },

  remove: async (id) => {
    const { data } = await apiClient.delete(`/generations/${id}`);
    return data;
  },

  bulkRemove: async (ids) => {
    const { data } = await apiClient.post(`/generations/bulk-delete`, { ids });
    return data;
  },
};
