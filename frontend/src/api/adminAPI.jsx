import api from './axios'

export const getNgosByStatus = (status = 'PENDING') => api.get(`/admin/ngos?status=${status}`)
export const approveNgo = (id) => api.put(`/admin/ngos/${id}/approve`)
export const rejectNgo = (id, reason) => api.put(`/admin/ngos/${id}/reject`, { reason })