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
  if (
    subdomain &&
    !url.startsWith(`/${subdomain}/`) &&
    !url.startsWith("/api/")
  ) {
    url = `/${subdomain}${url.startsWith("/") ? "" : "/"}${url}`;
  }

  if (
    authMode === "token" &&
    !url.startsWith("/api/")
  ) {
    url = `/api${url.startsWith("/") ? "" : "/"}${url}`;
  }

  config.url = url;

  if (authMode === "token") {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token && config.headers)
      (config.headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  if (authMode === "cookie" && typeof window !== "undefined") {
    const xsrfToken = getCookie("XSRF-TOKEN");
    if (xsrfToken && config.headers) {
      (config.headers as Record<string, string>)["X-XSRF-TOKEN"] = decodeURIComponent(xsrfToken);
    }
  }

  return config;
});

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)");
  return value ? value.pop() ?? null : null;
}

export default axiosClient;
