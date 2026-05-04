import axios from "axios";
import Swal from "sweetalert2";

const API = axios.create({
  baseURL: "https://shophub-backend-ee64.onrender.com/api",
  withCredentials: true,
});

API.interceptors.response.use(
  (res) => res,
  (error) => {
    const message = error.response?.data?.message || "Something went wrong";
    const status = error.response?.status;
    const silentErrors = [400, 401, 404];
    if (!silentErrors.includes(status)) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: message,
      });
    }
    return Promise.reject(error);
  },
);

export default API;