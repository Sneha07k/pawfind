import api from "./axios";

export const getNearbyPets = (lat, lng, radiusKm = 25) =>
  api.get(`/pets/nearby?lat=${lat}&lng=${lng}&radiusKm=${radiusKm}`);

export const getNearbyNgos = (lat, lng, radiusKm = 25) =>
  api.get(`/ngo/nearby?lat=${lat}&lng=${lng}&radiusKm=${radiusKm}`);
