import { useEffect } from "react";

export default function useTokenRefresh() {
  useEffect(() => {
    // Placeholder token refresh hook. Implement refresh logic here if needed.
    const id = setInterval(() => {
      // noop for now
    }, 1000 * 60 * 10); // every 10 minutes

    return () => clearInterval(id);
  }, []);
}
