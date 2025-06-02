import axios from "axios";
import { getSubdomain } from "@/lib/tenantUtils";

const authMode = process.env.NEXT_PUBLIC_AUTH_MODE;

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: authMode === "cookie",
});

// Intercept requests: prefix subdomain if needed, add token if needed
axiosClient.interceptors.request.use((config) => {
  const subdomain = getSubdomain(); // Utility you wrote, gets current subdomain if on tenant
  if (subdomain && config.url && !config.url.startsWith(`/${subdomain}/`)) {
    config.url = `/${subdomain}${config.url.startsWith("/") ? "" : "/"}${config.url}`;
  }
  if (authMode === "token") {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }


  // Cookie-based CSRF protection
  if (authMode === "cookie" && typeof window !== "undefined") {
    const xsrfToken = getCookie("XSRF-TOKEN");
    if (xsrfToken) {
      config.headers["X-XSRF-TOKEN"] = decodeURIComponent(xsrfToken);
    }
  }
  return config;
});

// Helper to read cookie value by name
function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const value = document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)");
  return value ? value.pop() : null;
}

export default axiosClient;
