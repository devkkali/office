// context/TenantContext.tsx
"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

interface TenantContextType {
  subdomain: string; // "" if on main domain
  isTenant: boolean;
  isMainDomain: boolean;
  isAllowed: boolean;
  checked: boolean;
}

const TenantContext = createContext<TenantContextType>({
  subdomain: "",
  isTenant: false,
  isMainDomain: false,
  isAllowed: true,
  checked: false,
});

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [subdomain, setSubdomain] = useState("");
  const [isTenant, setIsTenant] = useState(false);
  const [isMainDomain, setIsMainDomain] = useState(false);
  const [isAllowed, setIsAllowed] = useState(true);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hostname = window.location.hostname;
    const mainDomain = process.env.NEXT_PUBLIC_FRONTEND_DOMAIN;
    const allowed = process.env.NEXT_PUBLIC_TENANT_SUBDOMAINS?.split(",") || [];

    if (
      hostname === mainDomain ||
      allowed.includes(hostname) ||
      hostname === "localhost" ||
      hostname === "127.0.0.1"
    ) {
        console.log("hostname", hostname);
        console.log("main domain", mainDomain);
        console.log("tenanet subdomains", allowed);
      if (hostname === mainDomain || hostname === "localhost" || hostname === "127.0.0.1") {
        setIsMainDomain(true);
        setIsTenant(false);
        setSubdomain("");
      } else {
        const diff = hostname.replace(`.${mainDomain}`, "");
        const sub = diff.split(".")[0];
        setIsTenant(true);
        setSubdomain(sub);
        setIsMainDomain(false);
      }
      setIsAllowed(true);
    } else {
      setIsAllowed(false);
    }
    setChecked(true);
  }, []);

  if (!checked) return <div>Loading...</div>;

  if (!isAllowed) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", background: "#f8d7da" }}>
        <div style={{ padding: 32, borderRadius: 12, background: "#fff0f1", color: "#721c24", maxWidth: 400, textAlign: "center", boxShadow: "0 4px 24px 0 #b71c1c10" }}>
          <h2 style={{ fontSize: "1.8rem", fontWeight: "bold", marginBottom: 16 }}>🚫 Not a registered tenant</h2>
          <p>This domain (<b>{typeof window !== "undefined" && window.location.hostname}</b>) is not allowed to access this app.</p>
          <p style={{ marginTop: 20 }}>
            Please use the main site:&nbsp;
            <a href={`https://${process.env.NEXT_PUBLIC_FRONTEND_DOMAIN}`} style={{ color: "#0056b3", textDecoration: "underline" }}>
              {process.env.NEXT_PUBLIC_FRONTEND_DOMAIN}
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <TenantContext.Provider value={{ subdomain, isTenant, isMainDomain, isAllowed, checked }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  return useContext(TenantContext);
}
