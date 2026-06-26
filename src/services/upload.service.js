import apiClient from "./api";

export const uploadService = {
  uploadMemberPhoto: async (file) => {
    const formData = new FormData();
    formData.append("photo", file);

    const { data } = await apiClient.post("/members/upload-photo", formData);

    return data;
  },
};
