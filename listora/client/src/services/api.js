import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api"
});

// 🔐 Attach token from localStorage OR sessionStorage
api.interceptors.request.use((req) => {
  const token =
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default api;
