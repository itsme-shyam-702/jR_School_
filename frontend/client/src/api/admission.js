import api from "./index.js"; // reuses axios with baseURL

const admissionAPI = {
  submitAdmission: (data) => api.post("/admission", data),
  getAdmissions: () => api.get("/admission"),
  deleteAdmission: (id) => api.delete(`/admission/${id}`),
};

export default admissionAPI;
