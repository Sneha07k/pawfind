import api from "./axios";

export const submitApplication = (petId, data) =>
  api.post(`/pets/${petId}/applications`, data);
export const getMyApplications = () => api.get("/applications/mine");
export const getApplicationById = (id) => api.get(`/applications/${id}`);
export const getNgoApplications = () => api.get("/ngo/applications");
export const approveApplication = (id) =>
  api.put(`/applications/${id}/approve`);
export const rejectApplication = (id, reason) =>
  api.put(`/applications/${id}/reject`, { reason });
export const signAgreement = (id, signatureDataUrl) =>
  api.post(`/applications/${id}/sign`, { signatureDataUrl });
