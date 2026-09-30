import axios from "axios";

//This is work only for localhost, for production you need to change the baseURL to your production server URL


const api = axios.create({
  baseURL: "http://localhost:8080",
});


//  To this: it is only for docker-compose, because the backend is running on a different container, so we need to use the container name as the baseURL
// const api = axios.create({ baseURL: 'http://backend:8080' });

api.interceptors.request.use((config) => {

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token || localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;