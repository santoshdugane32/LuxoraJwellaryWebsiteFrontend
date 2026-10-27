
import axios from "axios";

const api = axios.create({
  baseURL: (
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"
  ).replace(/\/+$/, ""),
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach the JWT token to API requests.
api.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem("token");

    try {
      const storedUser = localStorage.getItem("user");
      const user = storedUser ? JSON.parse(storedUser) : null;

      token = user?.token || token;
    } catch (error) {
      console.error("Unable to read stored user:", error);
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
