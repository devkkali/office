import axios, { InternalAxiosRequestConfig } from "axios";
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

axiosClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  let url = config.url || "";
  const subdomain = getSubdomain();

  // Only do this for token mode
  if (authMode === "token") {
    // If url already starts with /{subdomain}/api/ or /api/, do nothing
    const hasSubdomainApiPrefix =
      subdomain && url.startsWith(`/${subdomain}/api/`);
    const hasApiPrefix = url.startsWith("/api/");

    if (subdomain) {
      if (!hasSubdomainApiPrefix) {
        // Remove leading slash if present
        url = url.startsWith("/") ? url.substring(1) : url;
        // Prepend subdomain/api/
        url = `/${subdomain}/api/${url}`;
      }
    } else {
      if (!hasApiPrefix) {
        url = url.startsWith("/") ? url : "/" + url;
        url = `/api${url}`;
      }
    }
  } else {
    // For cookie mode or other modes, you may want to handle differently or do nothing
    if (subdomain && !url.startsWith(`/${subdomain}/`)) {
      url = `/${subdomain}${url.startsWith("/") ? "" : "/"}${url}`;
    }
  }

  config.url = url;

  // Set Authorization header for token mode
  if (authMode === "token") {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token && config.headers)
      (config.headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  return config;
});


function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)");
  return value ? value.pop() ?? null : null;
}

export default axiosClient;
