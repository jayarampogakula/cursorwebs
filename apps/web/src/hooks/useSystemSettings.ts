import { useState, useEffect } from "react";

export interface SystemSettings {
  appName: string;
  appLogo: string;
  appEmail: string;
  landingHeroTitle: string;
  landingHeroSubtitle: string;
  landingAboutTitle: string;
  landingAboutText: string;
  landingContactTitle: string;
  landingContactText: string;
  landingContactEmail: string;
  landingFeatures: string;
  policyPrivacy: string;
  policyTerms: string;
  policyRefund: string;
}

export function useSystemSettings() {
  const [settings, setSettings] = useState<SystemSettings>({
    appName: "CursorWebs",
    appLogo: "/logo.png",
    appEmail: "support@cursorwebs.com",
    landingHeroTitle: "Build polished websites with AI in one flow.",
    landingHeroSubtitle: "Describe the business once and CursorWebs assembles a modern site with home, features, pricing, about, contact, hosting, and provider-aware AI routing.",
    landingAboutTitle: "CursorWebs is built for fast, useful site production.",
    landingAboutText: "The platform combines prompt-driven generation, reusable page sections, publishing workflows, and admin-level provider controls so teams can build without wrestling with scattered tools.",
    landingContactTitle: "Need a custom workflow?",
    landingContactText: "Reach the CursorWebs team for provider setup, agency plans, domain support, and enterprise onboarding.",
    landingContactEmail: "support@cursorwebs.com",
    landingFeatures: "",
    policyPrivacy: "",
    policyTerms: "",
    policyRefund: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (active && data.success && data.settings) {
          setSettings(data.settings);
        }
      })
      .catch((err) => console.error("Failed to fetch settings client-side:", err))
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return { settings, loading };
}
