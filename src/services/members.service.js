import apiClient from "./api";

export const membersService = {
  getAll: async (params) => {
    const { data } = await apiClient.get("/members", { params });
    return data;
  },

  getById: async (id) => {
    const { data } = await apiClient.get(`/members/${id}`);
    return data;
  },

  create: async (payload) => {
    const { data } = await apiClient.post("/members", payload);
    return data;
  },

  update: async (id, payload) => {
    const { data } = await apiClient.put(`/members/${id}`, payload);
    return data;
  },

  remove: async (id) => {
    const { data } = await apiClient.delete(`/members/${id}`);
    return data;
  },

  bulkRemove: async (ids) => {
    const { data } = await apiClient.post(`/members/bulk-delete`, { ids });
    return data;
  },

  search: async (query) => {
    const { data } = await apiClient.get("/members/search", {
      params: { q: query },
    });
    return data;
  },
};
