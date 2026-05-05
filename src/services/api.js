import axios from "axios";

const API = axios.create({
  baseURL: "https://shophub-backend-ee64.onrender.com/api",
  withCredentials: true,
});

//////////////////////////////////////////////////////////////
// 🔥 REQUEST INTERCEPTOR (ADD TOKEN)
//////////////////////////////////////////////////////////////

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

//////////////////////////////////////////////////////////////
// 🔥 RESPONSE INTERCEPTOR (AUTO REFRESH TOKEN)
//////////////////////////////////////////////////////////////

API.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // 🔥 agar token expire ho gaya
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // 🔄 refresh token call
        const res = await axios.get(
          "https://shophub-backend-ee64.onrender.com/api/auth/refresh",
          { withCredentials: true }
        );

        const newToken = res.data.accessToken;

        // 🔥 new token save
        localStorage.setItem("accessToken", newToken);

        // 🔥 retry original request
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return API(originalRequest);

      } catch (err) {
        // ❌ refresh fail → logout
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default API;