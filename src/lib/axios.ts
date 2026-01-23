import axios from "axios";
import { useAuthStore } from "@/store/authStore";
import toast from "@/lib/sonner";
import { createBrowserHistory } from "history";
const history = createBrowserHistory();

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor - Handle token refresh on 401 and show global alert
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { refreshToken, setAccessToken, logout } =
          useAuthStore.getState();

        if (!refreshToken) {
          toast.error("Not authorized. Please login again.");
          useAuthStore.getState().logout();
          setTimeout(() => {
            history.push("/login");
          }, 1000);
          return Promise.reject(error);
        }

        // Call refresh token endpoint
        const response = await axios.post("/api/auth/refresh-token", {
          refreshToken,
        });

        const { accessToken: newAccessToken } = response.data;

        // Update access token in store
        setAccessToken(newAccessToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (err) {
        toast.error("Not authorized. Please login again.");
        useAuthStore.getState().logout();
        setTimeout(() => {
          history.push("/login");
        }, 1000);
        return Promise.reject(error);
      }
    }

    // Show global error for any 401
    if (error.response?.status === 401) {
      toast.error("Not authorized. Please login again.");
      useAuthStore.getState().logout();
      setTimeout(() => {
        history.push("/login");
      }, 1000);
    }

    return Promise.reject(error);
  },
);

export default api;
