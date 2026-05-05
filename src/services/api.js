import axios from "axios";

const API = axios.create({
  baseURL: "https://shophub-backend-ee64.onrender.com/api",
  withCredentials: true,
});

export default API;