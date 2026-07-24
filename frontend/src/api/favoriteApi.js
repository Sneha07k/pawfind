import api from "./axios";

export const toggleFavorite = (petId) => api.post(`/favorites/${petId}/toggle`);
export const getMyFavorites = () => api.get("/favorites");
export const getFavoriteStatus = (petId) =>
  api.get(`/favorites/${petId}/status`);
