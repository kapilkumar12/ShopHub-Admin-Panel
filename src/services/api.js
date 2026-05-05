import axios from "axios";
import Swal from "sweetalert2";

const API = axios.create({
  baseURL: "https://shophub-backend-ee64.onrender.com/api",
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;