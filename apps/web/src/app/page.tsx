import React from "react";
import { cookies, headers } from "next/headers";
import { verifySession } from "@/lib/session";
import { checkSetupAndLicense } from "@/lib/licensing";
import { redirect } from "next/navigation";
import { prisma } from "@webbing/db";
import GeneratorForm from "./GeneratorForm";
import MarketingHeader from "./components/MarketingHeader";
import { CheckCircle2, Compass, Globe, Globe2, Layers3, Mail, ShieldCheck, Sparkles, Zap, ShoppingCart, MessageSquare, Code, DollarSign, Eye, Download, LayoutGrid, Terminal, Rocket, Palette, Building } from "lucide-react";
import PricingSection from "./components/PricingSection";
import { getSystemSettings } from "@/lib/settings";
import * as Icons from "lucide-react";

export const dynamic = "force-dynamic";

const features = [
  { icon: Sparkles, title: "AI copy and layout", text: "Generate structured pages, hero copy, pricing blocks, feature grids, and contact sections from one prompt." },
  { icon: Layers3, title: "Modern component system", text: "Every website is composed from reusable sections that are easier to edit, inspect, and expand." },
  { icon: Globe2, title: "Subdomain publishing", text: "Publish projects to instant subdomains with custom-domain workflows ready for paid plans." },
  { icon: ShieldCheck, title: "Provider key controls", text: "Admins can configure global LLM keys while users can bring their own provider credentials." },
  { icon: ShoppingCart, title: "eCommerce Storefronts", text: "Generate complete single-vendor stores with shopping carts, checkout logic, product variants, inventory, and payment setup." },
  { icon: DollarSign, title: "Annual Subscriptions", text: "Switch to annual cycles to save up to 15% on paid plan quotas, making client sites highly affordable." },
  { icon: Code, title: "White-labeled ZIP Export", text: "Download fully offline-ready HTML, CSS, and vanilla JS archives of your sites, free of engine tags or scripts." },
  { icon: MessageSquare, title: "Integrated Feedback System", text: "Submit suggestions or report bugs directly from the dashboard panel. View resolved support tickets instantly." }
];

export default async function LandingPage() {
  const hostHeader = headers().get("x-forwarded-host") || headers().get("host") || "";
  const { setupRequired, licenseValid } = await checkSetupAndLicense(hostHeader);
  if (setupRequired || !licenseValid) {
    redirect("/setup");
  }

  let dbPlans: any[] = [];
  try {
    const [plans, settings] = await Promise.all([
      prisma.plan.findMany({ orderBy: { price: "asc" } }),
      prisma.systemSetting.findMany({
        where: { key: { startsWith: "yearlyDiscount_" } }
      })
    ]);
    const settingsMap = Object.fromEntries(settings.map((s) => [s.key, s.value]));
    dbPlans = plans.map((p) => ({
      ...p,
      yearlyDiscount: parseInt(settingsMap[`yearlyDiscount_${p.id}`] || "0", 10)
    }));
  } catch (err) {
    console.error("Failed to load plans for landing page:", err);
  }

  const sessionToken = cookies().get("webbing-session")?.value;
  const user = sessionToken ? verifySession(sessionToken) : null;
  const settings = await getSystemSettings(hostHeader);

  let parsedFeatures = features;
  if (settings.landingFeatures) {
    try {
      const rawList = JSON.parse(settings.landingFeatures);
      if (Array.isArray(rawList)) {
        parsedFeatures = rawList.map((f: any) => {
          let IconComp = Sparkles;
          if (f.icon && (Icons as any)[f.icon]) {
            IconComp = (Icons as any)[f.icon];
          }
          return {
            icon: IconComp,
            title: f.title,
            text: f.text
          };
        });
      }
    } catch (e) {
      console.error("Failed to parse custom landing features JSON:", e);
    }
  }

  return (
    <div className="app-shell">
      <MarketingHeader user={user} appName={settings.appName} appLogo={settings.appLogo} />

      <main id="home" style={{ position: "relative", zIndex: 10 }}>
        <section className="hero">
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
            <h1>What will you build today?</h1>
            <p style={{ maxWidth: "600px", margin: "0 auto" }}>Describe your vision and watch it come to life.</p>
          </div>
          <GeneratorForm user={user} />
          
          {/* Trusted Brands logos */}
          <div className="trusted-by-section">
            <span className="trusted-title">Trusted by teams at</span>
            <div className="brands-container">
              <div className="brand-pill">
                <span className="brand-dot" style={{ background: "#3b82f6" }}>T</span>
                <span>TechFlow</span>
              </div>
              <div className="brand-pill">
                <span className="brand-dot" style={{ background: "#10b981" }}>B</span>
                <span>BuildCorp</span>
              </div>
              <div className="brand-pill">
                <span className="brand-dot" style={{ background: "#8b5cf6" }}>D</span>
                <span>DataSync</span>
              </div>
              <div className="brand-pill">
                <span className="brand-dot" style={{ background: "#f59e0b" }}>C</span>
                <span>CloudBase</span>
              </div>
              <div className="brand-pill">
                <span className="brand-dot" style={{ background: "#ec4899" }}>S</span>
                <span>DevStack</span>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="section-band" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          <div className="section-copy" style={{ textAlign: "center", margin: "0 auto 1.5rem auto" }}>
            <span className="eyebrow" style={{ margin: "0 auto" }}>Features</span>
            <h2>Everything feels connected now.</h2>
            <p>The builder, pricing, account pages, generated websites, and LLM settings share one restrained product interface.</p>
          </div>

          <div style={{ width: "100%", maxWidth: "1180px", margin: "0 auto" }}>
            {/* Bento Grid Top Row (Large + 2 Medium Stacked) */}
            <div className="bento-container-top">
              {/* Large Bento Card */}
              <article className="bento-card large">
                <span className="icon-box"><Sparkles size={24} /></span>
                <h3>AI-Powered Development</h3>
                <p>Describe what you want, and watch it come to life. Our AI understands context and builds complete applications.</p>
              </article>

              {/* Stack of 2 Medium Bento Cards */}
              <div className="bento-medium-stack">
                <article className="bento-card medium">
                  <span className="icon-box"><Eye size={20} /></span>
                  <h3>Real-time Preview</h3>
                  <p>See your changes instantly as the AI builds your project. No waiting, no refreshing.</p>
                </article>
                <article className="bento-card medium">
                  <span className="icon-box"><Code size={20} /></span>
                  <h3>Built-in Code Editor</h3>
                  <p>Full Monaco editor with syntax highlighting, file tree, and code completion.</p>
                </article>
              </div>
            </div>

            {/* Bento Grid Bottom Row (4 Small Cards) */}
            <div className="bento-container-bottom">
              <article className="bento-card small">
                <span className="icon-box"><Download size={20} /></span>
                <h3>Export & Deploy</h3>
                <p>Host on our platform or export your code to deploy anywhere.</p>
              </article>
              <article className="bento-card small">
                <span className="icon-box"><LayoutGrid size={20} /></span>
                <h3>Smart Templates</h3>
                <p>Start with AI-selected templates that match your project needs perfectly.</p>
              </article>
              <article className="bento-card small">
                <span className="icon-box"><MessageSquare size={20} /></span>
                <h3>Iterative Refinement</h3>
                <p>Keep chatting to refine and improve your creation until it's perfect.</p>
              </article>
              <article className="bento-card small">
                <span className="icon-box"><Globe size={20} /></span>
                <h3>Custom Subdomains</h3>
                <p>Publish your project to a custom subdomain and share it with the world.</p>
              </article>
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section id="use-cases" className="section-band" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          <div className="section-copy" style={{ textAlign: "center", margin: "0 auto 1.5rem auto" }}>
            <span className="eyebrow" style={{ margin: "0 auto" }}>Use Cases</span>
            <h2>Built for everyone</h2>
            <p>Whether you're a developer, designer, or entrepreneur, our platform helps you build faster and smarter.</p>
          </div>

          <div className="use-cases-grid">
            <article className="bento-card" style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <span className="icon-box" style={{ borderRadius: "50%", background: "rgba(255, 255, 255, 0.04)", border: "1px solid var(--line)" }}><Terminal size={20} /></span>
              <h3>Developers</h3>
              <p>Accelerate your workflow with AI-assisted development. Focus on logic while AI handles boilerplate.</p>
            </article>

            <article className="bento-card" style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <span className="icon-box" style={{ borderRadius: "50%", background: "rgba(255, 255, 255, 0.04)", border: "1px solid var(--line)" }}><Rocket size={20} /></span>
              <h3>Entrepreneurs</h3>
              <p>Launch your MVP faster. Go from idea to working prototype in minutes, not weeks.</p>
            </article>

            <article className="bento-card" style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <span className="icon-box" style={{ borderRadius: "50%", background: "rgba(255, 255, 255, 0.04)", border: "1px solid var(--line)" }}><Palette size={20} /></span>
              <h3>Designers</h3>
              <p>Bring your designs to life without writing code. Describe your vision and see it built.</p>
            </article>

            <article className="bento-card" style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <span className="icon-box" style={{ borderRadius: "50%", background: "rgba(255, 255, 255, 0.04)", border: "1px solid var(--line)" }}><Building size={20} /></span>
              <h3>Agencies</h3>
              <p>Deliver more projects in less time. Scale your output without scaling your team.</p>
            </article>
          </div>
        </section>

        <PricingSection initialPlans={dbPlans} />


        <section id="about" className="section-band">
          <div className="about-contact-grid">
            <div className="surface-panel">
              <span className="eyebrow"><Compass size={14} /> About us</span>
              <h2>{settings.landingAboutTitle}</h2>
              <p style={{ color: "#9aa7bd" }}>{settings.landingAboutText}</p>
            </div>
            <div id="contact" className="surface-panel">
              <span className="eyebrow"><Mail size={14} /> Contact us</span>
              <h2>{settings.landingContactTitle}</h2>
              <p style={{ color: "#9aa7bd" }}>{settings.landingContactText}</p>
              <a className="primary-action" href={`mailto:${settings.landingContactEmail}`}>{settings.landingContactEmail}</a>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer" style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center", justifyContent: "center", padding: "3rem 2rem" }}>
        <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", justifyContent: "center", marginBottom: "0.5rem" }}>
          <a href="/terms" className="footer-link">Terms & Conditions</a>
          <a href="/privacy" className="footer-link">Privacy Policy</a>
          <a href="/cookies" className="footer-link">Cookies Policy</a>
          <a href="/refund" className="footer-link">Refund Policy</a>
          {settings.affiliateEnabled === "true" && (
            <a href="/affiliate" className="footer-link">Affiliate Program</a>
          )}
        </div>
        <div style={{ color: "rgba(255, 255, 255, 0.3)", fontSize: "0.8rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem" }}>
          <span>© {new Date().getFullYear()} {settings.appName} Platforms Inc. All rights reserved.</span>
          <span style={{ opacity: 0.6 }}>Version V1.0</span>
        </div>
      </footer>
    </div>
  );
}
