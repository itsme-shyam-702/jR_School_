import api from "./index.js";

const galleryAPI = {
  getAll: () => api.get("/gallery"),
  getDeleted: () => api.get("/gallery/deleted"),
  add: (formData) =>
    api.post("/gallery", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  softDelete: (id) => api.patch(`/gallery/delete/${id}`),
  restore: (id) => api.patch(`/gallery/restore/${id}`),
  permanentDelete: (id) => api.delete(`/gallery/${id}`),
};

export default galleryAPI;
