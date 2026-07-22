import api from "./axios";

export const getQuestions = (petId) => api.get(`/pets/${petId}/questions`);
export const askQuestion = (petId, question) =>
  api.post(`/pets/${petId}/questions`, { question });
export const answerQuestion = (questionId, answer) =>
  api.put(`/questions/${questionId}/answer`, { answer });
