import api from './axios'

export const getAvailablePets = () => api.get('/pets')
export const getPetById = (id) => api.get(`/pets/${id}`)
export const getMyPets = () => api.get('/pets/mine')
export const createPet = (data) => api.post('/pets', data)
export const updatePet = (id, data) => api.put(`/pets/${id}`, data)
export const deletePet = (id) => api.delete(`/pets/${id}`)
export const uploadPetImage = (id, file) => {
  const formData = new FormData()
  formData.append('file', file)
  return api.post(`/pets/${id}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}
export const deletePetImage = (petId, imageId) => api.delete(`/pets/${petId}/images/${imageId}`)