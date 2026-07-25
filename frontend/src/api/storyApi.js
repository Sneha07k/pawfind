import api from "./axios";

export const createStory = (petId, data) =>
  api.post(`/pets/${petId}/success-stories`, data);
export const uploadStoryImage = (storyId, file) => {
  const formData = new FormData();
  formData.append("file", file);
  return api.post(`/success-stories/${storyId}/image`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
export const getAllStories = () => api.get("/success-stories");
export const getFeaturedStories = (limit = 6) =>
  api.get(`/success-stories/featured?limit=${limit}`);
export const getMyStories = () => api.get("/success-stories/mine");
