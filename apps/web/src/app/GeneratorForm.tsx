"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Sparkles, ArrowRight, Check, CornerDownLeft, 
  Terminal, Rocket, Palette, Building, LayoutGrid, MessageSquare, Globe
} from "lucide-react";

interface GeneratorFormProps {
  user: any;
  tenantId?: string;
  onSuccess?: (projectId: string) => void;
}

export default function GeneratorForm({ user, tenantId, onSuccess }: GeneratorFormProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Form Fields
  const [prompt, setPrompt] = useState(""); // Description
  const [selectedThemeId, setSelectedThemeId] = useState("Aether Homes");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<{ projectId: string; subdomain: string } | null>(null);
  const [siteUrl, setSiteUrl] = useState("");
  const [siteDisplay, setSiteDisplay] = useState("");

  // Dynamic typing placeholder prompts
  const placeholderPrompts = [
    "Make an e-commerce store with cart func",
    "Design a landing page for my dental clinic",
    "build a task management app with status columns",
    "Create a portfolio website for a visual designer",
    "Build a SaaS billing dashboard with chart views"
  ];

  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  const [displayedPlaceholder, setDisplayedPlaceholder] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    const currentFullText = placeholderPrompts[currentPlaceholderIndex];
    
    const handleTyping = () => {
      if (!isDeleting) {
        setDisplayedPlaceholder((prev) => {
          const next = currentFullText.substring(0, prev.length + 1);
          if (next === currentFullText) {
            timer = setTimeout(() => setIsDeleting(true), 2500);
          } else {
            timer = setTimeout(handleTyping, 60);
          }
          return next;
        });
      } else {
        setDisplayedPlaceholder((prev) => {
          const next = currentFullText.substring(0, prev.length - 1);
          if (next === "") {
            setIsDeleting(false);
            setCurrentPlaceholderIndex((prevIdx) => (prevIdx + 1) % placeholderPrompts.length);
            timer = setTimeout(handleTyping, 200);
          } else {
            timer = setTimeout(handleTyping, 30);
          }
          return next;
        });
      }
    };

    timer = setTimeout(handleTyping, 100);
    return () => clearTimeout(timer);
  }, [isDeleting, currentPlaceholderIndex]);

  React.useEffect(() => {
    if (success && typeof window !== "undefined") {
      const host = window.location.host;
      const cleanHost = host.startsWith("app.") ? host.substring(4) : host;
      const protocol = host.includes("localhost") ? "http:" : window.location.protocol;
      setSiteUrl(`${protocol}//${success.subdomain}.${cleanHost}`);
      setSiteDisplay(`${success.subdomain}.${cleanHost}`);
    }
  }, [success]);

  const categories = ["All", "Real Estate", "Gaming", "E-commerce", "Digital Marketing", "Clinics"];

  const themes = [
    { id: "Aether Homes", name: "Aether Homes", category: "Real Estate", desc: "Sleek, minimalist architecture portfolios and listings.", preset: "Modern Startup" },
    { id: "Vanguard Realty", name: "Vanguard Realty", category: "Real Estate", desc: "High-contrast dark designs for premium agencies.", preset: "SaaS" },
    { id: "CyberPulse", name: "CyberPulse", category: "Gaming", desc: "Cyberpunk neon accents, bold tech aesthetics for streams & teams.", preset: "Gaming" },
    { id: "Rift Esports", name: "Rift Esports", category: "Gaming", desc: "Dark, high-energy gaming landing pages and rosters.", preset: "Gaming" },
    { id: "Velvet Cart", name: "Velvet Cart", category: "E-commerce", desc: "Elegant minimal shop layouts for apparel & lifestyle brands.", preset: "Ecommerce" },
    { id: "Nova Tech", name: "Nova Tech", category: "E-commerce", desc: "Clean grid layout for consumer electronics & gadgets.", preset: "Ecommerce" },
    { id: "Apex Agency", name: "Apex Agency", category: "Digital Marketing", desc: "Modern startup B2B SaaS analytics and service presentation.", preset: "Modern Startup" },
    { id: "GrowthFlow", name: "GrowthFlow", category: "Digital Marketing", desc: "Vibrant gradient-focused page for consultancies.", preset: "Creator" },
    { id: "MediCare Plus", name: "MediCare Plus", category: "Clinics", desc: "Clean, reassuring design with simple scheduling components.", preset: "Modern Startup" },
    { id: "Aura Dental", name: "Aura Dental", category: "Clinics", desc: "Warm, professional layout for dental & wellness practices.", preset: "Creator" }
  ];

  const activeTheme = themes.find(t => t.id === selectedThemeId) || themes[0];
  const filteredThemes = selectedCategory === "All" 
    ? themes 
    : themes.filter(t => t.category === selectedCategory);

  const validateInput = () => {
    if (prompt.trim().length < 5) return "Please write a brief description (at least 5 characters).";
    return "";
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError("");
    setSuccess(null);

    const err = validateInput();
    if (err) {
      setError(err);
      return;
    }

    if (!user) {
      setError("Sign in to generate and publish your website.");
      setTimeout(() => router.push("/signin"), 900);
      return;
    }

    // Determine if ecommerce shop components are required based on theme category or prompt contents
    const isEcommerce = activeTheme.category === "E-commerce" || 
      prompt.toLowerCase().includes("ecommerce") || 
      prompt.toLowerCase().includes("shop") || 
      prompt.toLowerCase().includes("cart");

    try {
      setLoading(true);
      setStep(2); // Go directly to loading progress step

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: activeTheme.name,
          businessName: activeTheme.name,
          prompt: prompt.trim(),
          keywords: activeTheme.category,
          niche: activeTheme.category,
          targetAudience: "",
          style: activeTheme.preset,
          ecommerce: isEcommerce,
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
        msg = "The server returned an invalid HTML response. Please verify that database migrations are fully applied and Redis queue is active.";
      }
      setError(msg);
      setStep(1); // return to prompt grid
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    { label: "Make an e-commerce store", text: "Make an e-commerce store with cart function..." },
    { label: "Design a dental clinic landing page", text: "Design a landing page for my dental clinic..." },
    { label: "build a task management app", text: "build a task management app with status columns..." },
    { label: "Create a visual designer portfolio", text: "Create a portfolio website for a visual designer..." },
    { label: "Build a SaaS billing dashboard", text: "Build a SaaS billing dashboard with chart views..." }
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
            <Sparkles size={14} /> Step {step} of 2
          </span>
          <h2 style={{ fontSize: "1.75rem", color: "#fff", fontWeight: 800, margin: "0.25rem 0" }}>
            Building Project
          </h2>
          <p style={{ color: "#9ca3af", fontSize: "0.85rem", margin: 0 }}>
            Your AI website builder workspace is generating pages and writing styles.
          </p>
        </div>
      )}

      {error && <div className="form-alert" style={{ marginBottom: "1.5rem" }}>{error}</div>}

      {/* STEP 1: PARAMETERS */}
      {step === 1 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", width: "100%" }}>
          <div className="prompt-box-container">
            <textarea
              className="prompt-textarea"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              placeholder={displayedPlaceholder || "Make an e-commerce store with cart func"}
              rows={3}
            />
            <div className="prompt-bottom-bar">
              <span className="prompt-shortcut-text">
                Press <kbd style={{ fontFamily: "inherit", background: "rgba(255,255,255,0.08)", padding: "0.15rem 0.4rem", borderRadius: "0.25rem", border: "1px solid rgba(255,255,255,0.2)", fontSize: "0.72rem", color: "#fff", fontWeight: 600 }}>⌘ Enter</kbd> to start
              </span>
              <button type="button" onClick={() => handleSubmit()} className="prompt-go-btn">
                Go <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Suggestion Pills Infinite Marquee */}
          <div className="suggestion-pills-container">
            <div className="suggestion-pills-track">
              {/* First Set */}
              {suggestions.map((item, idx) => (
                <button
                  key={`set1-${idx}`}
                  type="button"
                  className="pill-btn bright"
                  onClick={() => setPrompt(item.text)}
                >
                  {item.label}
                </button>
              ))}
              {/* Duplicate Set for Loop */}
              {suggestions.map((item, idx) => (
                <button
                  key={`set2-${idx}`}
                  type="button"
                  className="pill-btn bright"
                  onClick={() => setPrompt(item.text)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* THEMES GRID & NICHE SELECTOR */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#fff" }}>Choose Website Theme</span>
              <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Selected: <strong style={{ color: "#818cf8" }}>{activeTheme.name}</strong></span>
            </div>

            {/* Category Selector Tabs */}
            <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", background: "rgba(255,255,255,0.02)", padding: "0.25rem", borderRadius: "0.5rem", border: "1px solid rgba(255,255,255,0.05)" }}>
              {categories.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    background: selectedCategory === cat ? "rgba(255, 255, 255, 0.08)" : "transparent",
                    color: selectedCategory === cat ? "#fff" : "#94a3b8",
                    border: "none",
                    borderRadius: "0.35rem",
                    padding: "0.4rem 0.8rem",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.15s"
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Themes Grid */}
            <div 
              style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", 
                gap: "0.75rem", 
                maxHeight: "260px", 
                overflowY: "auto", 
                paddingRight: "0.25rem",
                marginTop: "0.25rem"
              }}
            >
              {filteredThemes.map(t => (
                <div
                  key={t.id}
                  onClick={() => setSelectedThemeId(t.id)}
                  style={{
                    background: selectedThemeId === t.id ? "rgba(99, 102, 241, 0.1)" : "rgba(255, 255, 255, 0.02)",
                    border: selectedThemeId === t.id ? "2px solid #818cf8" : "1px solid rgba(255, 255, 255, 0.06)",
                    borderRadius: "0.5rem",
                    padding: "0.8rem 1rem",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.25rem",
                    textAlign: "left"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "0.82rem", fontWeight: 700, color: selectedThemeId === t.id ? "#818cf8" : "#fff" }}>{t.name}</span>
                    <span style={{ fontSize: "0.6rem", background: "rgba(255,255,255,0.06)", color: "#94a3b8", padding: "0.1rem 0.3rem", borderRadius: "0.25rem", fontWeight: 600 }}>{t.category}</span>
                  </div>
                  <span style={{ fontSize: "0.7rem", color: "#94a3b8", lineHeight: 1.4 }}>{t.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Direct Website Generation Action Button */}
          <button
            type="button"
            onClick={() => handleSubmit()}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              background: "linear-gradient(135deg, var(--blue), var(--teal))",
              color: "#fff",
              border: "none",
              borderRadius: "0.5rem",
              padding: "1rem",
              fontSize: "0.95rem",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 4px 15px rgba(32, 199, 181, 0.2)",
              transition: "transform 0.2s, box-shadow 0.2s",
              marginTop: "0.5rem"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(32, 199, 181, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "0 4px 15px rgba(32, 199, 181, 0.2)";
            }}
          >
            <Sparkles size={16} /> Generate Website
          </button>
        </div>
      )}

      {/* STEP 2: GENERATING LAYOUT LOADING AND REDIRECTS */}
      {step === 2 && (
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
              <button onClick={() => setStep(1)} className="secondary-action">Go Back</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
