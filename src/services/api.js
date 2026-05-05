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

    // ❌ skip auth routes
    const isAuthRoute =
      originalRequest.url.includes("/auth/login") ||
      originalRequest.url.includes("/auth/refresh") ||
      originalRequest.url.includes("/auth/me");

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthRoute // 🔥 IMPORTANT
    ) {
      originalRequest._retry = true;

      try {
        const res = await axios.get(
          "https://shophub-backend-ee64.onrender.com/api/auth/refresh",
          { withCredentials: true }
        );

        const newToken = res.data.accessToken;

        localStorage.setItem("accessToken", newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return API(originalRequest);

      } catch (err) {
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default API;