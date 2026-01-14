import axios from "axios";

const api = axios.create({
  baseURL: "https://spotify-project-backend-4q2h.onrender.com/api",
});

// 🔥 Automatically attach token in header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      console.warn("Unauthorized → token expired");
      localStorage.removeItem("token");
    }
    return Promise.reject(error);
  }
);

export default api;
