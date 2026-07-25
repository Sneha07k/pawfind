import api from "./axios";

export const getNgosByStatus = (status = "PENDING") =>
  api.get(`/admin/ngos?status=${status}`);
export const approveNgo = (id) => api.put(`/admin/ngos/${id}/approve`);
export const rejectNgo = (id, reason) =>
  api.put(`/admin/ngos/${id}/reject`, { reason });
export const getAllUsers = () => api.get("/admin/ngos/users");
export const deleteUser = (id) => api.delete(`/admin/ngos/users/${id}`);
export const removePetListing = (id) => api.delete(`/admin/pets/${id}`);
