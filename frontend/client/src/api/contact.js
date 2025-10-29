import api from "./index.js";

const contactAPI = {
  sendMessage: (data) => api.post("/contact"),
  getMessages: () => api.get("/contact"),
  updateRead: (id) => api.put(`/contact/read/${id}`),
  softDeleteMessage: (id) => api.put(`/contact/soft-delete/${id}`),
  restoreMessage: (id) => api.put(`/contact/restore/${id}`),
  deleteMessage: (id) => api.delete(`/contact/delete/${id}`),
};

export default contactAPI;
