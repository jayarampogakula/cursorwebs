"use client";

import React, { useState } from "react";
import { Sparkles, Menu, X, Monitor } from "lucide-react";

interface MarketingHeaderProps {
  active?: "signin" | "signup";
  user?: { email: string; role: string } | null;
  appName?: string;
  appLogo?: string;
}

export default function MarketingHeader({ active, user, appName: propAppName, appLogo: propAppLogo }: MarketingHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [clientSettings, setClientSettings] = useState<any>(null);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const ref = urlParams.get("ref");
      if (ref) {
        localStorage.setItem("webbing_referrer", ref);
      }
    }
  }, []);

  React.useEffect(() => {
    if (!propAppName) {
      fetch("/api/settings")
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.settings) {
            setClientSettings(data.settings);
          }
        })
        .catch((err) => console.error("Error loading header branding settings:", err));
    }
  }, [propAppName]);

  const appName = propAppName || clientSettings?.appName || "Webbing";
  const appLogo = propAppLogo || clientSettings?.appLogo || "";

  return (
    <header className="site-nav" style={{ position: "relative" }}>
      <div className="brand-wrapper">
        <a className="brand" href="/" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div className="brand-mark-gradient" style={{ display: "grid", placeItems: "center", width: "2.25rem", height: "2.25rem", borderRadius: "0.5rem", background: "linear-gradient(135deg, var(--blue), var(--teal))", boxShadow: "0 8px 24px rgba(32, 199, 181, 0.25)" }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#fff" }}><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.34 18.65a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.21 1.21 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z"/><path d="m14 7 3 3"/><path d="M5 6v4"/><path d="M19 14v4"/><path d="M10 2v2"/><path d="M7 8H3"/><path d="M21 16h-4"/><path d="M11 3H9"/></svg>
            </div>
            <span style={{ fontSize: "1.45rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>
              Cursor<span style={{ color: "#f43f5e" }}>Webs</span>
            </span>
          </div>
          <span className="logo-tagline" style={{ fontSize: "0.58rem", color: "#f43f5e", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", marginTop: "-2px", marginLeft: "2.75rem" }}>
            Build your business online, instantly.
          </span>
        </a>
        
        {/* Mobile menu toggle button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            background: "none",
            border: "none",
            color: "#ffffff",
            cursor: "pointer",
            display: "none",
            alignItems: "center",
            padding: "0.5rem",
          }}
          className="mobile-menu-toggle"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Nav Menu Links and Actions */}
      <div className={`nav-menu-container ${isOpen ? "open" : ""}`}>
        <nav className="nav-links">
          <a href="/#features" onClick={() => setIsOpen(false)}>Features</a>
          <a href="/#pricing" onClick={() => setIsOpen(false)}>Pricing</a>
          <a href="/#use-cases" onClick={() => setIsOpen(false)}>Use Cases</a>
        </nav>
        <div className="nav-actions" style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          {/* Flag and Device Preview Icons */}
          <div className="header-previews" style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginRight: "0.5rem" }}>
            <span style={{ cursor: "pointer", fontSize: "0.85rem", fontWeight: 700, color: "#94a3b8" }} title="English (US)">US</span>
            <span style={{ display: "inline-flex", cursor: "pointer" }} title="Desktop Preview">
              <Monitor size={18} style={{ color: "#9ca3af" }} />
            </span>
          </div>
          {user ? (
            <>
              <span style={{ color: "#9aa7bd", fontSize: "0.85rem" }}>{user.email}</span>
              <a className="danger-action" href="/api/auth/signout">Sign out</a>
            </>
          ) : (
            <>
              <a className="signin-link" href="/signin" style={{ color: "#fff", fontWeight: 600, fontSize: "0.9rem" }}>Sign in</a>
              <a className="get-started-btn" href="/signup" style={{ background: "#fff", color: "#060914", padding: "0.6rem 1.25rem", borderRadius: "0.5rem", fontWeight: 700, fontSize: "0.9rem", border: "none", transition: "all 0.2s" }}>Get started</a>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
