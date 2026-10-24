import axios from "axios";



//This is work only for localhost, for production you need to change the baseURL to your production server URL

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});


// attach token automatically
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }

  return config;
});

export default api;