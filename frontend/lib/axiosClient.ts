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
  const subdomain = getSubdomain();
  if (subdomain && config.url && !config.url.startsWith(`/${subdomain}/`)) {
    config.url = `/${subdomain}${config.url}`;
  }
  if (authMode === "token") {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;
