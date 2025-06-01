export function getCurrentHostname() {
  if (typeof window === "undefined") return "";
  return window.location.hostname;
}

export function getSubdomain() {
  if (typeof window === "undefined") return "";
  const hostname = window.location.hostname;
  const mainDomain = process.env.NEXT_PUBLIC_FRONTEND_DOMAIN;
  if (hostname === mainDomain) return ""; // main domain, no subdomain

  const allowed = process.env.NEXT_PUBLIC_TENANT_SUBDOMAINS?.split(",") || [];
  if (allowed.includes(hostname)) {
    // a.roshandevkota.com.np => "a"
    const diff = hostname.replace(`.${mainDomain}`, "");
    return diff.split(".")[0];
  }
  // allow 'localhost' as main
  if (hostname === "localhost") return "";
  return "";
}

export function isAllowedTenant() {
  if (typeof window === "undefined") return true; // SSR fallback
  const hostname = window.location.hostname;
  const mainDomain = process.env.NEXT_PUBLIC_FRONTEND_DOMAIN;
  const allowed = process.env.NEXT_PUBLIC_TENANT_SUBDOMAINS?.split(",") || [];
  return hostname === mainDomain || allowed.includes(hostname);
}
