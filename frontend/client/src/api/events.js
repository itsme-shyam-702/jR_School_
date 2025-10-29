// src/api/events.js
import api from "./index.js";

export const getAllEvents = () => api.get("/events");

export const getDeletedEvents = () => api.get("/events/deleted");

export const createEvent = (formData) =>
  api.post("/events", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteEvent = (id) => api.patch(`/events/delete/${id}`);

export const restoreEvent = (id) => api.patch(`/events/restore/${id}`);

// ✅ This one was missing:
export const permanentDeleteEvent = (id) => api.delete(`/events/${id}`);
