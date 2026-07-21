import api from './axios'

export const saveNgoProfile = (data) => api.post('/ngo/profile', data)
export const getMyNgoProfile = () => api.get('/ngo/profile')