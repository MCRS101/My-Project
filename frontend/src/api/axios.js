import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.token = token; // 🔥 backend คุณอ่านจาก header ชื่อ token
  }
  return config;
});

export default api;
