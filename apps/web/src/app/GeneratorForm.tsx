"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Globe, Sparkles, ArrowRight, ArrowLeft, Check, ShoppingBag, ShieldCheck } from "lucide-react";

interface GeneratorFormProps {
  user: { userId: string; email: string; role: string; tenantId: string } | null;
  tenantId?: string;
  onSuccess?: (projectId: string) => void;
}

const stylesList = [
  { id: "Modern Startup", label: "Modern Startup", desc: "Sleek dark design with glowing highlights" },
  { id: "Gaming", label: "Gaming", desc: "Cyberpunk neon accents, bold tech aesthetics" },
  { id: "Creator", label: "Creator", desc: "Warm gradients, rounded friendly components" },
  { id: "SaaS", label: "SaaS", desc: "Clean bento grids, code widgets, blue accents" },
  { id: "Luxury", label: "Luxury", desc: "Refined gold, serif headlines, elegant layout" },
  { id: "Fitness", label: "Fitness", desc: "High-contrast neon sports and fitness theme" },
  { id: "Education", label: "Education", desc: "Structured slate, blue details, trusted layouts" },
  { id: "Ecommerce", label: "Ecommerce", desc: "Clean card-based visual shopping interface" },
  { id: "Corporate", label: "Corporate", desc: "Dark professional slate, clean geometric structure" },
  { id: "Portfolio", label: "Portfolio", desc: "Glassmorphic details, custom bento portfolio blocks" }
];

export default function GeneratorForm({ user, tenantId, onSuccess }: GeneratorFormProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Form Fields
  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [prompt, setPrompt] = useState(""); // Description
  const [keywords, setKeywords] = useState("");
  const [style, setStyle] = useState("Modern Startup");
  const [ecommerce, setEcommerce] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<{ projectId: string; subdomain: string } | null>(null);
  const [siteUrl, setSiteUrl] = useState("");
  const [siteDisplay, setSiteDisplay] = useState("");

  React.useEffect(() => {
    if (success && typeof window !== "undefined") {
      const host = window.location.host;
      const cleanHost = host.startsWith("app.") ? host.substring(4) : host;
      const protocol = host.includes("localhost") ? "http:" : window.location.protocol;
      setSiteUrl(`${protocol}//${success.subdomain}.${cleanHost}`);
      setSiteDisplay(`${success.subdomain}.${cleanHost}`);
    }
  }, [success]);

  const validateStep1 = () => {
    if (prompt.trim().length < 5) return "Please write a brief description (at least 5 characters).";
    return "";
  };

  const handleNext = () => {
    const err = validateStep1();
    if (err) {
      setError(err);
      return;
    }
    setError("");
    setStep(2);
  };

  const handleBack = () => {
    setError("");
    setStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(null);

    if (!user) {
      setError("Sign in to generate and publish your website.");
      setTimeout(() => router.push("/signin"), 900);
      return;
    }

    try {
      setLoading(true);
      setStep(3); // Go to loading step

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          businessName: businessName.trim(),
          prompt: prompt.trim(),
          keywords: keywords.trim(),
          niche: "",
          targetAudience: "",
          style,
          ecommerce,
          tenantId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate website Layout.");

      setSuccess({ projectId: data.projectId, subdomain: data.subdomain });
      if (onSuccess) {
        onSuccess(data.projectId);
      }
    } catch (err: any) {
      let msg = err.message || "An unexpected error occurred.";
      if (msg.includes("Unexpected token") || msg.includes("is not valid JSON") || err instanceof SyntaxError) {
        msg = "The server returned an invalid HTML response. This typically indicates a database connection failure, missing migrations, or that the Redis queue server is offline on your VPS. Please verify that Redis is running and database migrations are fully applied.";
      }
      setError(msg);
      setStep(2); // return to configuration
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    { label: "Create a portfolio website", text: "Create a portfolio website for a visual designer showcasing branding, mobile app designs, and case studies." },
    { label: "Design a landing page", text: "Design a landing page for a modern B2B SaaS analytics platform showing charts, pricing, and sign up form." },
    { label: "Make an e-commerce store", text: "Make an e-commerce store for an organic coffee brand with product catalog, cart, and brewing guides." },
    { label: "Build a corporate website", text: "Build a corporate website for a renewable green energy consultant team showcasing solar projects." }
  ];

  return (
    <div
      className={step > 1 ? "surface-panel generator-card" : ""}
      style={step > 1 ? {
        padding: "2.5rem",
        borderRadius: "1rem",
        border: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(13,19,35,0.85)",
        width: "100%",
        maxWidth: "800px",
        margin: "0 auto"
      } : {
        width: "100%"
      }}
    >
      {/* HEADER AND BREADCRUMBS */}
      {step > 1 && (
        <div style={{ marginBottom: "2rem" }}>
          <span className="eyebrow" style={{ color: "#a78bfa", display: "inline-flex", gap: "0.4rem", alignItems: "center" }}>
            <Sparkles size={14} /> Step {step} of 3
          </span>
          <h2 style={{ fontSize: "1.75rem", color: "#fff", fontWeight: 800, margin: "0.25rem 0" }}>
            {step === 2 && "Visual Branding"}
            {step === 3 && "Building Project"}
          </h2>
          <p style={{ color: "#9ca3af", fontSize: "0.85rem", margin: 0 }}>
            {step === 2 && "Choose an interactive design direction and additional capabilities."}
            {step === 3 && "Your AI website builder workspace is generating pages and writing styles."}
          </p>
        </div>
      )}

      {error && <div className="form-alert" style={{ marginBottom: "1.5rem" }}>{error}</div>}

      {/* STEP 1: PARAMETERS */}
      {step === 1 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", width: "100%" }}>
          <div className="prompt-box-container">
            <textarea
              className="prompt-textarea"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault();
                  handleNext();
                }
              }}
              placeholder="Design a landing page for my "
              rows={3}
            />
            <div className="prompt-bottom-bar">
              <span className="prompt-shortcut-text">
                Press <kbd style={{ fontFamily: "inherit", background: "rgba(255,255,255,0.08)", padding: "0.15rem 0.4rem", borderRadius: "0.25rem", border: "1px solid rgba(255,255,255,0.15)", fontSize: "0.72rem", color: "#fff", fontWeight: 600 }}>Enter</kbd> to start
              </span>
              <button type="button" onClick={handleNext} className="prompt-go-btn">
                Go <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Suggestion Pills */}
          <div className="suggestion-pills">
            {suggestions.map((item, idx) => (
              <button
                key={idx}
                type="button"
                className="pill-btn"
                onClick={() => setPrompt(item.text)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 2: DESIGN STYLE SELECTION */}
      {step === 2 && (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", marginBottom: "0.5rem" }}>
            {/* Left Column: Style Selection */}
            <div className="field-group" style={{ display: "flex", flexDirection: "column" }}>
              <label>Select Design Direction</label>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", maxHeight: "290px", overflowY: "auto", paddingRight: "0.5rem" }}>
                {stylesList.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setStyle(item.id);
                      if (item.id === "Ecommerce") {
                        setEcommerce(true);
                      }
                    }}
                    style={{
                      background: style === item.id ? "rgba(99, 102, 241, 0.12)" : "rgba(255, 255, 255, 0.02)",
                      border: style === item.id ? "1.5px solid #818cf8" : "1px solid rgba(255, 255, 255, 0.06)",
                      borderRadius: "0.5rem",
                      padding: "0.75rem 1rem",
                      cursor: "pointer",
                      transition: "all 0.2s"
                    }}
                  >
                    <strong style={{ color: style === item.id ? "#818cf8" : "#fff", display: "block", fontSize: "0.85rem" }}>{item.label}</strong>
                    <span style={{ color: "#9ca3af", fontSize: "0.72rem" }}>{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Theme Preview */}
            <div className="field-group" style={{ display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
              <label>Theme Preview</label>
              <div 
                style={{ 
                  borderRadius: "0.5rem", 
                  overflow: "hidden", 
                  border: "1px solid rgba(255,255,255,0.08)", 
                  background: "rgba(0,0,0,0.2)",
                  height: "290px",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative"
                }}
              >
                {/* Visual Thumbnail */}
                <div style={{ flexGrow: 1, position: "relative", overflow: "hidden", background: "#0a0f1d" }}>
                  <img 
                    src={`/images/themes/${style === "Modern Startup" ? "startup" : style.toLowerCase().replace(" ", "")}.png`} 
                    alt={`${style} Theme Preview`} 
                    style={{ 
                      width: "100%", 
                      height: "100%", 
                      objectFit: "cover",
                      objectPosition: "top"
                    }}
                  />
                  <div 
                    style={{ 
                      position: "absolute", 
                      bottom: 0, 
                      left: 0, 
                      right: 0, 
                      padding: "1rem", 
                      background: "linear-gradient(to top, rgba(7, 11, 19, 0.95) 30%, rgba(7, 11, 19, 0))",
                      display: "flex",
                      flexDirection: "column"
                    }}
                  >
                    <span style={{ fontSize: "0.7rem", color: "#818cf8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Interactive Theme</span>
                    <strong style={{ fontSize: "1.1rem", color: "#fff", marginTop: "0.1rem" }}>{style} Preset</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="field-group">
            <label className="secondary-action" style={{ justifyContent: "flex-start", width: "100%", padding: "0.8rem", border: ecommerce ? "1px solid rgba(99,102,241,0.4)" : "1px solid rgba(255,255,255,0.06)", background: ecommerce ? "rgba(99,102,241,0.05)" : "transparent", borderRadius: "0.5rem", cursor: "pointer", transition: "all 0.2s" }}>
              <input type="checkbox" checked={ecommerce} onChange={(e) => setEcommerce(e.target.checked)} style={{ marginRight: "0.5rem" }} />
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 600, color: ecommerce ? "#818cf8" : "#fff" }}>Include e-commerce ready shop components</span>
                <span style={{ fontSize: "0.75rem", color: ecommerce ? "#a5b4fc" : "#9ca3af", marginTop: "0.1rem" }}>Requires 25 credits. Creates products catalog, cart, checkout, customer accounts, and order settings.</span>
              </div>
            </label>
          </div>

          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            <button type="button" onClick={handleBack} className="secondary-action" style={{ flex: 1, justifyContent: "center" }}>
              <ArrowLeft size={16} /> Back
            </button>
            <button type="submit" className="primary-action" style={{ flex: 1, justifyContent: "center" }}>
              <Sparkles size={16} /> Generate Website
            </button>
          </div>
        </form>
      )}

      {/* STEP 3: GENERATING LAYOUT LOADING AND REDIRECTS */}
      {step === 3 && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "3rem 1rem", gap: "1.5rem" }}>
          {loading ? (
            <>
              <div className="animate-spin" style={{ width: "3.5rem", height: "3.5rem", border: "4px solid rgba(255,255,255,0.05)", borderTopColor: "#818cf8", borderRadius: "50%" }}></div>
              <strong style={{ fontSize: "1.2rem", color: "#fff", textAlign: "center" }}>Orchestrating AI Website Build...</strong>
              <p style={{ color: "#9ca3af", fontSize: "0.85rem", textAlign: "center", maxWidth: "400px", lineHeight: 1.6, margin: 0 }}>
                Writing custom code elements, pairing theme color gradients, sourcing visual content graphics, and compiling database sections.
              </p>
            </>
          ) : success ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.2rem", width: "100%" }}>
              <div style={{ width: "3rem", height: "3rem", borderRadius: "50%", background: "rgba(52, 211, 153, 0.15)", color: "#34d399", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Check size={24} />
              </div>
              <strong style={{ fontSize: "1.25rem", color: "#fff", textAlign: "center" }}>Website Generated Successfully!</strong>
              <p style={{ color: "#cbd5e1", fontSize: "0.85rem", textAlign: "center" }}>
                Active workspace is ready for live previewing. Click below to reload.
              </p>
              
              <button
                onClick={() => {
                  if (typeof window !== "undefined") {
                    window.location.reload();
                  }
                }}
                className="primary-action"
                style={{ width: "100%", justifyContent: "center", marginTop: "1rem" }}
              >
                Go to Workspace <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            <>
              <strong style={{ color: "#f87171" }}>Workspace Build Aborted</strong>
              <p style={{ color: "#9ca3af", fontSize: "0.85rem", textAlign: "center" }}>{error || "An error occurred during compilation."}</p>
              <button onClick={() => setStep(2)} className="secondary-action">Go Back</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
