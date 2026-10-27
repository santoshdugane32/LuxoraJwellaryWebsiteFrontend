
import axios from "axios";

const api = axios.create({
  baseURL: (
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"
  ).replace(/\/+$/, ""),
});

// Attach JWT token automatically to every request.
api.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem("token");

    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      token = user?.token || token;
    } catch (error) {
      console.error("Failed to read user session:", error);
    }

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
