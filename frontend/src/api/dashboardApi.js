import api from "./axios";

export const getNgoDashboardStats = () => api.get("/dashboard/ngo");
