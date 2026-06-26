import apiClient from "./api";

export const adminService = {
  getAll: async (params) => {
    const { data } = await apiClient.get("/admin", { params });
    return data;
  },

  getById: async (id) => {
    const { data } = await apiClient.get(`/admin/${id}`);
    return data;
  },

  create: async (payload) => {
    const { data } = await apiClient.post("/admin", payload);
    return data;
  },

  update: async (id, payload) => {
    const { data } = await apiClient.put(`/admin/${id}`, payload);
    return data;
  },

  remove: async (id) => {
    const { data } = await apiClient.delete(`/admin/${id}`);
    return data;
  },

  bulkRemove: async (ids) => {
    const { data } = await apiClient.post(`/admin/bulk-delete`, { ids });
    return data;
  },
};
