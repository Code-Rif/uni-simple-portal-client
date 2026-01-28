import { useEffect, useRef } from "react";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/axios";

// Proactive token refresh every 2.5 minutes if refreshToken is present
export default function useTokenRefresh() {
  const refreshTimer = useRef<NodeJS.Timeout | null>(null);
  const { refreshToken, setAccessToken, logout } = useAuthStore();

  useEffect(() => {
    if (!refreshToken) {
      if (refreshTimer.current) clearInterval(refreshTimer.current);
      return;
    }
    // Refresh every 2.5 minutes (150000 ms)
    refreshTimer.current = setInterval(async () => {
      try {
        const res = await api.post("/auth/refresh-token", { refreshToken });
        setAccessToken(res.data.data.accessToken);
      } catch (err) {
        logout();
      }
    }, 150000);
    return () => {
      if (refreshTimer.current) clearInterval(refreshTimer.current);
    };
  }, [refreshToken, setAccessToken, logout]);
}
